# Implementation Plan: Identidad visual y parallax público

**Branch**: `feat/visual-brand-parallax` | **Date**: 2026-09-18 | **Spec**: [spec.md](spec.md)

**Input**: Especificación en `specs/005-visual-brand-parallax/spec.md`

## Summary

Reemplazar la paleta verde, beige, maíz y arcilla por tokens semánticos derivados del logo: cian, azul, azul oscuro y superficies claras. Simplificar el footer a enlaces de ONG y autor. En la portada, revelar tarjetas cuando entran al viewport con `IntersectionObserver` y ampliar sus fotografías WebP a escala `1.2` en hover o foco, respetando la preferencia de reducir movimiento.

## Technical Context

**Language/Version**: JavaScript ESM; React 19.3 y CSS.

**Primary Dependencies**: Material UI Community 9.4, React 19.3, React Router 7, Playwright 1.63 y axe-core Playwright; no se añaden dependencias.

**Storage**: Sin cambios. Las URLs firmadas, WebP, Supabase Storage, RLS y tablas existentes permanecen intactos.

**Testing**: Vitest/Testing Library existentes; Playwright móvil y escritorio para footer, zoom, reducción de movimiento y accesibilidad; `npm run verify` y `npm run test:e2e`.

**Target Platform**: Navegadores modernos en móvil y escritorio, SPA Vite.

**Project Type**: Aplicación web React SPA.

**Performance Goals**: Sin listeners globales de scroll ni dependencias nuevas; cada tarjeta observa su propia entrada y deja de observarse tras revelarse. Las imágenes mantienen `loading="lazy"`.

**Constraints**: Solo portada pública recibe movimiento decorativo. `prefers-reduced-motion` evita el estado inicial oculto y las transformaciones. El zoom no altera el layout ni expone fotos privadas. WCAG AA se conserva con texto azul oscuro sobre cian/superficies claras y blanco sobre azul.

**Scale/Scope**: Tema, marca, footer, tarjetas públicas, placeholder, layouts administrativos y pruebas visuales. No cambia servicios, datos, imágenes, rutas, APIs o nube.

## Constitution Check

| Principio                            | Evidencia                                                                                                | Estado |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------ |
| Privacidad antes que conveniencia    | No se modifican respuestas públicas ni medios; pruebas verifican que la animación no cambia el contrato. | PASS   |
| Publicación deliberada               | La presentación no altera estados ni acciones de publicación.                                            | PASS   |
| Seguridad por capas                  | Storage, RLS, rutas firmadas y allowlist no cambian.                                                     | PASS   |
| Presupuesto cero y portabilidad      | Solo React, MUI, CSS e API web nativa existentes; sin servicios o dependencias nuevos.                   | PASS   |
| Calidad verificable                  | Se añaden pruebas Playwright y se ejecutan verificación y e2e.                                           | PASS   |
| Accesibilidad y dignidad             | Contraste, foco y reducción de movimiento forman parte de la entrega.                                    | PASS   |
| Integración mediante revisión humana | Rama `feat/` y Pull Request hacia `main`, sin merge automático.                                          | PASS   |

**Resultado previo a investigación**: PASS.

## Phase 0: Research

Decisiones consolidadas en [research.md](research.md): tokens centralizados, observación nativa al entrar al viewport, transformación del elemento de imagen y reducción de movimiento desde JS/CSS.

## Phase 1: Design

- [data-model.md](data-model.md): sin entidades o migraciones.
- [contracts/public-motion.md](contracts/public-motion.md): contrato de tema, footer y atributos de movimiento verificables.
- [quickstart.md](quickstart.md): recorrido visual, accesible y de pruebas.

## Project Structure

```text
src/
├── components/
│   ├── BrandMark.jsx                    # Marca con tokens cian/azul
│   ├── layout/PublicLayout.jsx           # Footer reducido
│   └── story/StoryCard.jsx               # Reveal y zoom de tarjeta
├── hooks/useRevealOnViewport.js          # Observación nativa y reduce motion
├── pages/HomePage.jsx                    # Superficie visual de la portada
├── styles/global.css                     # Fondo y motion preference globales
└── theme/theme.js                        # Tokens semánticos de paleta

e2e/public-stories.spec.js                # Footer, hover/foco/reduce motion y a11y
docs/superpowers/specs/...-design.md      # Diseño aprobado
specs/005-visual-brand-parallax/          # Artefactos Spec Kit
```

**Structure Decision**: El hook concentra estado y ciclo de vida de `IntersectionObserver`; `StoryCard` consume una interfaz mínima (`ref`, `isRevealed`, `reduceMotion`). El tema es la fuente única de color y los componentes dejan de depender de hexadecimales heredados.

## Complexity Tracking

No se requieren excepciones a la constitución.
