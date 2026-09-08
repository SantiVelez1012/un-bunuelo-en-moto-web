# Publicaciones del blog

## Crear una publicación

1. Copia `blog-post.mdx` dentro de `src/content/blog/`.
2. Usa un nombre de archivo descriptivo, por ejemplo `2026-10-03-ruta-al-eje-cafetero.mdx`.
3. Completa el frontmatter y escribe el contenido debajo de la segunda línea `---`.
4. Ejecuta `yarn dev` para revisar la publicación en `/blog`.

La URL se genera a partir del nombre del archivo:

`src/content/blog/2026-10-03-ruta-al-eje-cafetero.mdx`

se convierte en:

`/blog/2026-10-03-ruta-al-eje-cafetero/`

## Agrupación

La colección `blog` está definida en `src/content.config.ts`.

- `category` agrupa el contenido principal: `Rutas`, `Garaje`, `Equipamiento`, `Historias`, `Consejos` o `Comunidad`.
- `tags` permite añadir etiquetas más específicas sin crear nuevas rutas.
- `date` controla el orden cronológico del índice.
- `featured: true` convierte la publicación en el artículo destacado del índice.

No es necesario crear un componente nuevo para cada publicación: el índice `/blog` y la ruta dinámica `/blog/[...slug]` leen la colección automáticamente.
