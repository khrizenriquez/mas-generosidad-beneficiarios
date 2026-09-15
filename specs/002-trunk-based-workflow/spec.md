# Especificación: Flujo trunk-based y revisión humana

**Rama**: `chore/trunk-based-workflow`
**Estado**: Aprobada
**Fecha**: 2026-09-15

## Objetivo

Adoptar una estrategia trunk-based en la que `main` sea la única rama principal, cada cambio se desarrolle en una rama corta y toda integración ocurra mediante un Pull Request aprobado y fusionado por `@khrizenriquez`.

## Requisitos

- WF-001: `main` representa el estado estable y desplegable; no recibe commits directos de agentes.
- WF-002: cada cambio usa una rama nueva, corta y actualizada desde `main`.
- WF-003: las ramas usan uno de los prefijos `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`, `ci/`, `perf/`, `build/` o `revert/`; Dependabot conserva su prefijo propio.
- WF-004: cada rama se sube y genera un PR hacia `main` con alcance, pruebas y riesgos descritos.
- WF-005: los agentes nunca aprueban, fusionan ni activan auto-merge; el propietario revisa y aprueba.
- WF-006: ningún commit contiene un trailer `Co-authored-by`; los agentes nunca se atribuyen coautoría.
- WF-007: `@khrizenriquez` figura como CODEOWNER global.
- WF-008: CI verifica el nombre de rama, la base `main` y ausencia de trailers de coautoría en los commits del PR.

## Criterios de aceptación

1. Las reglas son visibles en `CONTRIBUTING.md`, la constitución y los archivos de contexto de agentes.
2. Existe plantilla de PR con comprobaciones de privacidad, alcance y pruebas.
3. Un script reproducible falla ante una rama inválida, base distinta de `main` o `Co-authored-by`.
4. El cambio se entrega desde `chore/trunk-based-workflow` mediante PR sin auto-merge.

## Fuera de alcance

- Fusionar este PR.
- Fusionar o modificar PRs de Dependabot.
- Elegir una estrategia de releases o versionado semántico.
- Añadir nuevos proveedores o servicios pagados.
