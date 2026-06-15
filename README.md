# SolGe Ambiental - Landing Page

Landing page estática para SolGe Ambiental, migrada a Bootstrap 5 con Sass y una capa visual propia de marca.

## Estructura

- `index.html` - HTML semántico de la landing.
- `scss/custom.scss` - entrada Sass.
- `scss/_variables.scss` - variables Bootstrap sobrescritas con la identidad SolGe.
- `scss/_components.scss` - componentes propios: hero, tarjetas, stepper, CTA y WhatsApp fijo.
- `dist/css/styles.css` - CSS compilado.
- `js/main.js` - interacciones, scroll suave, reveals, offcanvas y validación.
- `package.json` - scripts de build y watch.

## Requisitos

- Node.js 16+.
- npm.

## Uso

Instala dependencias:

```bash
npm install
```

Compila el CSS:

```bash
npm run build
```

Modo desarrollo:

```bash
npm run watch
```

Para previsualizar, abre `index.html` en el navegador o sirve la carpeta con un servidor local.

## Notas

- Bootstrap se instala por npm y se compila desde Sass.
- La implementación usa Bootstrap 5 compilado con Sass y componentes propios de SolGe.
- Todos los botones de WhatsApp usan mensaje pre-cargado.
- El formulario valida campos requeridos, email y teléfono chileno antes de abrir WhatsApp.
