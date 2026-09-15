# Diseño aprobado: flujo trunk-based

`main` será la única rama principal y siempre representará el estado estable. Cada cambio se hará en una rama corta creada desde `main`, se subirá al repositorio y terminará en un Pull Request dirigido a `main`. El propietario `@khrizenriquez` será el único responsable de aprobar y fusionar; los agentes no usarán auto-merge ni harán pushes directos a `main`.

La convención de ramas usa prefijos por intención (`feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`, `ci/`, `perf/`, `build/`, `revert/`) y acepta las ramas administradas por Dependabot. Un control de CI validará nombre, rama base y mensajes de los commits del PR.

La prohibición de coautoría es absoluta: los agentes no añadirán trailers `Co-authored-by`, no alterarán la autoría configurada y no se presentarán como coautores en commits o PRs. La política estará duplicada únicamente mediante el mecanismo de contexto sincronizado del repositorio, de modo que Codex, Claude y Copilot reciban la misma instrucción.

La aplicación de protección de `main` se intentará en GitHub si los permisos de la sesión lo permiten. La documentación y CI siguen siendo válidas si esa configuración externa requiere que el propietario la active manualmente.
