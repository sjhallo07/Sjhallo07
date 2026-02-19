Presentaciones (Slides)

Contenido:

- `Slides.md` — Presentación principal del repositorio (overview, demo, arquitectura, roadmap).
- `Skills_Presentation.md` — Deck enfocado en tus habilidades técnicas y evidencia.
- `assets/logo.svg` — logo placeholder que puedes usar en las diapositivas.

Cómo presentar:

1. Instala `reveal-md` (requiere Node/npm):

```bash
npm install -g reveal-md
```

2. Arranca la presentación (modo desarrollo):

```bash
reveal-md presentation/Slides.md --watch
# o
reveal-md presentation/Skills_Presentation.md --watch
```

Exportar a PDF (opcional, mejor calidad con `decktape`):

```bash
npm install -g decktape
reveal-md presentation/Slides.md --static ./out
decktape reveal ./out/index.html slides.pdf
```

Personalización rápida:

- Añade capturas o imágenes en `presentation/assets/` y referencia con Markdown: `![Logo](assets/logo.svg)`.
- Si quieres un tema personalizado, crea `presentation/theme.css` y pásalo con `--css presentation/theme.css`.

Si quieres, puedo:
- Generar un PPTX desde las diapositivas.
- Insertar capturas/screenshots del repo automáticamente.
- Completar comandos de instalación según el stack exacto del proyecto.

Nota sobre assets gráficos:

- En `presentation/assets/` encontrarás SVG y PNG para los diagramas. Para presentaciones en pantalla usa las SVG; si vas a exportar a PDF/PPTX, las PNG suelen ser más compatibles.
- Ejemplos: `diagram_architecture1.svg`, `diagram_architecture1.png`, `diagram_architecture2.svg`, `diagram_architecture2.png`, `diagram_skills.svg`, `diagram_skills.png`.

Si quieres, puedo reemplazar todas las referencias por SVG en lugar de PNG o generar un PPTX con las imágenes incrustadas.
