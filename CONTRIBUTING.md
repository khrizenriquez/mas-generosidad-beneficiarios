# Contribuir a Historias de Más Generosidad

Este repositorio usa una estrategia **trunk-based**. `main` es la única rama principal y debe permanecer estable y desplegable.

## Flujo obligatorio

1. Actualiza tu rama local sin reescribir historial compartido:

   ```bash
   git switch main
   git pull --ff-only origin main
   ```

2. Crea una rama corta para un solo cambio:

   ```bash
   git switch -c feat/descripcion-corta
   ```

3. Implementa y ejecuta las verificaciones indicadas en `AGENTS.md`.
4. Sube únicamente la rama de trabajo: `git push -u origin <rama>`.
5. Abre un Pull Request hacia `main`, completa la plantilla y solicita revisión a `@khrizenriquez`.
6. Espera la aprobación. Los agentes no aprueban, fusionan ni activan auto-merge.

Nunca hagas commits o pushes directos a `main`. Después de que el propietario fusione el PR, elimina la rama corta.

## Nombres de ramas

Usa minúsculas, números, puntos, guiones o guiones bajos después de uno de estos prefijos:

- `feat/` para funcionalidad.
- `fix/` para correcciones.
- `chore/` para mantenimiento y configuración.
- `docs/` para documentación.
- `refactor/`, `test/`, `ci/`, `perf/`, `build/` o `revert/` según el cambio.

Las ramas `dependabot/*` son válidas y se revisan como cualquier otro PR.

## Commits y autoría

- Escribe mensajes breves y orientados al cambio, preferiblemente con Conventional Commits.
- No alteres la identidad Git configurada por el propietario.
- **Nunca añadas trailers `Co-authored-by` ni presentes a un agente como coautor.**
- No incluyas datos personales, secretos, documentos privados o fotografías originales.

## Pull Requests

Cada PR debe ser pequeño, revisable y contener:

- motivo y alcance;
- pruebas ejecutadas;
- riesgos de privacidad, datos o despliegue;
- capturas cuando cambie una interfaz;
- migración nueva cuando cambie PostgreSQL, sin editar migraciones aplicadas.

La aprobación y el merge pertenecen exclusivamente a `@khrizenriquez`.
