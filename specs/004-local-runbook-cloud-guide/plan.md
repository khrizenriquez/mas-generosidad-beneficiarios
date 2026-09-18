# Implementation Plan: Manual local y guía privada de nube

**Branch**: `docs/local-runbook-and-cloud-guide` | **Date**: 2026-09-18 | **Spec**: [spec.md](spec.md)

**Input**: Especificación de feature en `specs/004-local-runbook-cloud-guide/spec.md`

## Summary

Convertir el README en el runbook canónico de desarrollo y validación local del MVP, con versiones efectivamente fijadas y rutas seguras para Podman. Extraer la operación futura de Supabase Free y Vercel Hobby a un archivo Markdown privado fuera del árbol Git. Confirmar la documentación mediante la batería local existente, sin cambiar infraestructura ni efectuar despliegues.

## Technical Context

**Language/Version**: Markdown; comandos Node.js `>=24 <25` y npm.

**Primary Dependencies**: React 19.3, Vite 8.3, Material UI Community 9.4, Supabase CLI 2.117, Podman 5+; las versiones exactas se obtienen de `package.json` y `package-lock.json`.

**Storage**: No se añaden datos. El MVP local existente usa PostgreSQL/Auth/Storage de Supabase en Podman; la guía futura describe Supabase Free.

**Testing**: `npm run verify`, `npm run db:test`, Playwright local y de navegador, backup local y persistencia de volumen.

**Target Platform**: macOS y Linux para el runbook local; Vercel estático y Supabase gestionado solo como destino futuro documentado.

**Project Type**: Documentación y validación operativa para una SPA web existente.

**Performance Goals**: El inicio debe ofrecer una URL local usable y cada comando de validación debe completar con código cero; no se introduce una nueva métrica de rendimiento de producto.

**Constraints**: Sin secretos, datos personales, cambios de RLS, migraciones, configuración de producción, cuenta remota o gasto. La guía de nube debe vivir fuera de Git y la clave de servicio nunca llega al bundle Vite.

**Scale/Scope**: Un README versionado, una guía privada externa, los artefactos Spec Kit de esta feature y validación de todo el harness local ya implementado.

## Constitution Check

| Principio                            | Evidencia en el plan                                                                                                       | Estado |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------ |
| Privacidad antes que conveniencia    | El README no revela datos reales; la guía externa prohíbe secretos y conserva el runbook de nube fuera de Git.             | PASS   |
| Publicación deliberada               | La guía conserva publicación/archivado, allowlist y la revisión de consentimiento como controles ya existentes.            | PASS   |
| Seguridad por capas                  | Se documentan RLS, Auth sin signup, allowlist, bucket privado y URLs firmadas; no se reemplazan por controles de interfaz. | PASS   |
| Presupuesto cero y portabilidad      | Se documentan Podman, Supabase Free y Vercel Hobby sin añadir servicios ni dependencias.                                   | PASS   |
| Calidad verificable                  | El plan exige `verify` y la batería local completa antes del PR.                                                           | PASS   |
| Accesibilidad y dignidad             | No cambia la UI ni los datos; el runbook conserva las pruebas e2e existentes.                                              | PASS   |
| Integración mediante revisión humana | La rama se entrega por PR a `main`, sin merge, auto-merge ni coautoría.                                                    | PASS   |

**Resultado previo a investigación**: PASS. No hay excepciones de complejidad ni clarificaciones pendientes.

## Phase 0: Research

Las decisiones y enlaces oficiales se registran en [research.md](research.md). Se usará el flujo de migraciones de Supabase mediante `link`, previsualización y `db push`; Vercel detecta Vite y las variables `VITE_*` son públicas para el bundle. La guía indicará estos límites de forma explícita.

## Phase 1: Design

- [data-model.md](data-model.md): no hay entidad, migración ni almacenamiento nuevo.
- [contracts/runbook-contract.md](contracts/runbook-contract.md): contrato editorial de comandos, límites de secretos y separación de artefactos.
- [quickstart.md](quickstart.md): recorrido reproducible de validación local y de inspección de la guía privada.

## Project Structure

### Documentation (this feature)

```text
specs/004-local-runbook-cloud-guide/
├── checklists/requirements.md
├── contracts/runbook-contract.md
├── data-model.md
├── plan.md
├── quickstart.md
├── research.md
├── spec.md
├── tasks.md
└── validation.md
```

### Source Code (repository root)

```text
README.md                                    # Runbook local versionado
package.json                                 # Fuente de versiones y comandos
scripts/                                     # Harness existente, sin cambios funcionales
supabase/                                    # Migraciones existentes, sin cambios
containers/                                  # Definición del frontend local, sin cambios
../GUIA-DESPLIEGUE-NUBE-MAS-GENEROSIDAD.md  # Guía privada, fuera de Git
```

**Structure Decision**: Se modifica únicamente `README.md` dentro del repositorio. La guía de despliegue queda como archivo Markdown hermano del directorio Git para que no sea indexable por Git ni se mezcle con código, secretos o datos reales.

## Complexity Tracking

No se requieren excepciones a la constitución.
