# Plan técnico: flujo trunk-based

## Diseño

La política tendrá tres capas complementarias:

1. **Guía humana:** `CONTRIBUTING.md`, plantilla de PR y CODEOWNERS explican el flujo y dejan la aprobación en manos del propietario.
2. **Contexto de agentes:** la constitución y `.agent-context/shared.md` hacen que Codex, Claude y Copilot creen ramas y PRs, nunca commits directos a `main`, auto-merge o coautoría.
3. **Verificación automática:** `scripts/check-contribution-policy.mjs` valida contexto de PR, nombre de rama y mensajes de commit. GitHub Actions lo ejecuta con historial completo.

## Flujo esperado

`main` actualizado → rama corta → implementación y verificación → push → PR hacia `main` → revisión y aprobación de `@khrizenriquez` → merge realizado por el propietario.

## Manejo de errores

- Rama inválida: CI muestra el patrón permitido y falla.
- Base distinta de `main`: CI falla y solicita recrear o cambiar la base del PR.
- Trailer de coautoría: CI identifica los hashes afectados sin imprimir el contenido completo del commit.
- Ejecución local en `main`: se permite para que `npm run verify` siga funcionando en un checkout limpio.

## Verificación

- Pruebas unitarias del validador para ramas, base y trailers.
- `npm run verify` con formato, lint, tests, build, contexto y privacidad.
- Revisión del rango de commits antes del push.
- PR creado sin auto-merge y asignado a revisión del propietario cuando GitHub lo permita.
