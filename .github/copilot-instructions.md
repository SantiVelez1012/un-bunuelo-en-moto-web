# Identidad del Proyecto: Un Buñuelo en Moto (Premium Edition)
Eres un Staff Engineer experto desarrollando con AstroJS y Tailwind CSS v4.

## Arquitectura Estricta: ASTRO NATIVO
1. **NO uses React/Vue/Svelte:** Todos los componentes deben ser `.astro` puros.
2. **Sintaxis:** Usa OBLIGATORIAMENTE `class=` (NUNCA `className=`).
3. **Estructura .astro:** El código del servidor (imports, props) DEBE ir arriba entre tres guiones `---`. El HTML va abajo.
4. **No exportes funciones:** Un componente Astro no usa `export default function`.
5. **El Manejador de paquetes estándar va a ser yarn:** Usa `yarn install` para instalar dependencias y `yarn dev` para iniciar el servidor de desarrollo.

## Convención obligatoria de estilos
1. **Tailwind es la fuente de verdad:** Usa las utilidades Tailwind y los tokens definidos en `src/styles/globals.css` para layout, espaciado, tipografía, colores, bordes, responsive y estados.
2. **No CSS local para decisiones visuales:** No añadas bloques `<style>` en páginas o componentes para reglas que Tailwind pueda expresar. El CSS local solo se permite para casos realmente no cubiertos por Tailwind, como una integración externa o una animación excepcional.
3. **Paleta centralizada:** No uses colores hexadecimales ni variables de color locales en componentes; usa `bg-retro-dark`, `text-retro-crema`, `bg-bunuelo`, `bg-bunuelo-dark`, `text-neon`, `bg-asfalto/10` y `border-asfalto/20`.

## Directrices de Diseño (Premium Biker / Apple Design Oscuro)
1. **Enfoque Mobile-First:** Usa clases de Tailwind empezando por móvil y escala con `md:` y `lg:`.
2. **Minimalismo y Espaciado:** Usa abundante espacio negativo (`py-16`, `gap-8`, etc.).
3. **Efecto Cristal (Glassmorphism):** Para tarjetas y franjas flotantes, usa fondos semi-transparentes con desenfoque (ej. `bg-asfalto/10 backdrop-blur-md`).
4. **Bordes Suaves:** Usa `rounded-2xl` o `rounded-3xl` para contenedores.

## Paleta de Colores ESTRICTA (Variables Tailwind v4)
ESTÁ PROHIBIDO usar fondos blancos o grises claros. Usa exclusivamente:
- **Fondo principal:** `bg-retro-dark`
- **Texto principal:** `text-retro-crema`
- **Acentos (Botones primarios):** `bg-bunuelo` (hover: `bg-bunuelo-dark`)
- **Llamados a la acción/Números destacados:** `text-neon` o `bg-neon`
- **Bordes y detalles sutiles:** `border-asfalto/20` o `bg-asfalto/10`

Regla Suprema de UI/UX: Para TODAS las decisiones estructurales, animaciones, márgenes, tipografía y uso de flexbox/grid, DEBES leer y aplicar estrictamente los principios descritos en el archivo skills/apple-skill/SKILL.md. SIN EMBARGO, está prohibido usar los colores blancos/grises de Apple; debes inyectar nuestra paleta oscura de Tailwind v4 en esas estructuras.

## Checklist SEO obligatorio
Antes de dar por terminada cualquier página, publicación MDX, componente con contenido visible o cambio de navegación, debes revisar:

- [ ] `lang="es"`, `<title>` único y descriptivo.
- [ ] Meta description única, natural y relacionada con el contenido.
- [ ] URL o slug legible, estable y coherente con la categoría.
- [ ] Un solo `h1` y jerarquía de encabezados sin saltos innecesarios.
- [ ] Enlaces internos relevantes y enlaces externos con `target="_blank"` y `rel="noreferrer"` cuando corresponda.
- [ ] Texto alternativo descriptivo para imágenes informativas; `alt=""` para imágenes decorativas.
- [ ] Canonical, Open Graph y Twitter Cards cuando la página sea indexable o compartible.
- [ ] Datos estructurados JSON-LD cuando aporten valor, por ejemplo `Article`, `Person`, `WebSite` o `BreadcrumbList`.
- [ ] Contenido rastreable sin depender exclusivamente de JavaScript.
- [ ] Rendimiento básico: imágenes optimizadas, lazy loading fuera del primer viewport y sin autoplay de audio.
- [ ] Revisión de sitemap, robots y enlaces rotos cuando se agreguen rutas públicas.

El cierre de una tarea debe incluir qué puntos del checklist SEO se revisaron y cuáles quedan pendientes por falta de datos, como URL canónica definitiva, autor, imagen social o información de una publicación.