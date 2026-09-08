import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourceFile = process.argv[2];

if (!sourceFile) {
  throw new Error('Usage: node scripts/import-contentful.mjs /path/to/contentful-export.json');
}

const projectRoot = new URL('..', import.meta.url).pathname;
const contentDirectory = path.join(projectRoot, 'src/content/blog');
const imageDirectory = path.join(projectRoot, 'public/images/blog');
const exportData = JSON.parse(await readFile(sourceFile, 'utf8'));
const locale = 'es-CO';
const localized = (field) => field?.[locale] ?? field?.['es-419'];
const tagNames = new Map(
  exportData.entries
    .filter((entry) => entry.sys.contentType.sys.id === 'tag')
    .map((entry) => [entry.sys.id, localized(entry.fields.name)]),
);
const assets = new Map(
  exportData.assets.map((asset) => [
    asset.sys.id,
    {
      title: localized(asset.fields.title) || 'Imagen de la publicación',
      description: localized(asset.fields.description),
      url: `https:${localized(asset.fields.file)?.url}`,
      fileName: localized(asset.fields.file)?.fileName || 'image',
    },
  ]),
);

const escapeYaml = (value) => value.replaceAll("'", "''");
const categoryFor = (tags) => {
  if (tags.includes('Motos')) return 'Motos';
  if (tags.includes('Promociones')) return 'Beneficios';
  return 'Articulos moteros';
};

const inlineMarkdown = (nodes = []) => nodes.map((node) => {
  if (node.nodeType === 'text') {
    let value = node.value.replace(/\n+/g, ' ');
    if (node.marks?.some((mark) => mark.type === 'code')) value = `\`${value}\``;
    if (node.marks?.some((mark) => mark.type === 'bold')) value = `**${value}**`;
    if (node.marks?.some((mark) => mark.type === 'italic')) value = `*${value}*`;
    if (node.marks?.some((mark) => mark.type === 'underline')) value = `<u>${value}</u>`;
    if (node.marks?.some((mark) => mark.type === 'strikethrough')) value = `~~${value}~~`;
    return value;
  }

  const value = inlineMarkdown(node.content);
  if (node.nodeType === 'hyperlink') return `[${value}](${node.data.uri})`;
  return value;
}).join('').trim();

const renderNodes = (nodes, postSlug, assetPaths, depth = 0) => nodes.map((node) => {
  const value = inlineMarkdown(node.content);

  if (node.nodeType === 'paragraph') return value ? `${value}\n` : '';
  if (node.nodeType === 'heading-1') return `# ${value}\n`;
  if (node.nodeType.startsWith('heading-')) return `${'#'.repeat(Number(node.nodeType.at(-1)))} ${value}\n`;
  if (node.nodeType === 'blockquote') return value ? `> ${value}\n` : '';
  if (node.nodeType === 'hr') return '---\n';
  if (node.nodeType === 'unordered-list' || node.nodeType === 'ordered-list') {
    return node.content.map((item, index) => {
      const marker = node.nodeType === 'ordered-list' ? `${index + 1}.` : '-';
      const itemText = renderNodes(item.content, postSlug, assetPaths, depth + 1).trim().replace(/\n+/g, ' ');
      return `${'  '.repeat(depth)}${marker} ${itemText}`;
    }).join('\n') + '\n';
  }
  if (node.nodeType === 'list-item') return renderNodes(node.content, postSlug, assetPaths, depth);
  if (node.nodeType === 'embedded-asset-block') {
    const asset = assets.get(node.data.target.sys.id);
    if (!asset) return '';
    const imagePath = assetPaths.get(node.data.target.sys.id);
    return `![${asset.description || asset.title}](${imagePath})\n`;
  }

  return value ? `${value}\n` : '';
}).join('\n');

const downloadAsset = async (asset, postSlug, number) => {
  const extension = path.extname(new URL(asset.url).pathname) || path.extname(asset.fileName) || '.jpg';
  const fileName = `${String(number).padStart(2, '0')}${extension.toLowerCase()}`;
  const relativePath = `/images/blog/${postSlug}/${fileName}`;
  const absolutePath = path.join(imageDirectory, postSlug, fileName);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  const response = await fetch(asset.url);
  if (!response.ok) throw new Error(`Could not download ${asset.url}: ${response.status}`);
  await writeFile(absolutePath, Buffer.from(await response.arrayBuffer()));
  return relativePath;
};

const posts = exportData.entries.filter((entry) => entry.sys.contentType.sys.id === 'blogPost' && localized(entry.fields.isShown) !== false);

for (const entry of posts) {
  const fields = entry.fields;
  const slug = localized(fields.urlSlug);
  const destination = path.join(contentDirectory, `${slug}.mdx`);

  try {
    await stat(destination);
    console.log(`Skipped existing post: ${slug}`);
    continue;
  } catch {}

  const tags = (localized(fields.tags) || []).map((tag) => tagNames.get(tag.sys.id)).filter(Boolean);
  const assetIds = [];
  const collectAssets = (nodes = []) => nodes.forEach((node) => {
    if (node.nodeType === 'embedded-asset-block') assetIds.push(node.data.target.sys.id);
    collectAssets(node.content);
  });
  const richText = localized(fields.content);
  collectAssets(richText.content);
  const coverId = localized(fields.coverImage)?.sys?.id;
  const orderedAssets = [...new Set([coverId, ...assetIds].filter(Boolean))];
  const assetPaths = new Map();

  for (const [index, assetId] of orderedAssets.entries()) {
    assetPaths.set(assetId, await downloadAsset(assets.get(assetId), slug, index + 1));
  }

  const date = new Date(localized(fields.createdAt)).toISOString().slice(0, 10);
  const markdown = renderNodes(richText.content, slug, assetPaths).replace(/\n{3,}/g, '\n\n').trim();
  const file = `---\ntitle: '${escapeYaml(localized(fields.title))}'\ndescription: '${escapeYaml(localized(fields.postSummary))}'\ncategory: '${categoryFor(tags)}'\ndate: ${date}\nheroImage: '${assetPaths.get(coverId)}'\nfeatured: false\ntags:\n${tags.map((tag) => `  - ${tag.toLowerCase().replaceAll(' ', '-')}`).join('\n')}\n---\n\n${markdown}\n`;
  await writeFile(destination, file);
  console.log(`Imported: ${slug}`);
}