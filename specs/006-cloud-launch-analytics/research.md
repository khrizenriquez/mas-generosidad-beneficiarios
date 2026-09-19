# Research: Lanzamiento cloud y analítica anónima

## Decisión: desplegar desde Git y no mediante CLI de producción

- **Decisión**: Conectar el proyecto Vercel al repositorio y usar `main` como rama de producción. Los Pull Requests reciben únicamente previews.
- **Rationale**: Conserva el flujo trunk-based y permite que la única producción proceda de una revisión humana aprobada. Vercel genera previews para Pull Requests conectados a Git.
- **Alternatives considered**:
  - `vercel --prod`: descartado porque permite omitir el Pull Request y requiere credenciales de operador.
  - Carga manual de artefactos: descartada porque pierde trazabilidad y previews por rama.
- **Sources**: [Vercel: Vite](https://vercel.com/docs/frameworks/frontend/vite).

## Decisión: mantener SPA estática con reescritura existente

- **Decisión**: Mantener `vercel.json` y su reescritura a `index.html`; el build es `npm run build` y el resultado estático es `dist`.
- **Rationale**: Las rutas de React Router requieren que una ruta profunda se resuelva a la SPA. La configuración existente ya añade `noindex` y cabeceras de seguridad.
- **Alternatives considered**:
  - Añadir funciones o SSR: descartado porque no aporta valor al MVP, aumenta superficie de secretos y puede salir del presupuesto cero.
  - Reemplazar React Router: descartado porque la ruta profunda actual ya funciona localmente.
- **Sources**: [Vercel: Vite SPA rewrites](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas).

## Decisión: Vercel Web Analytics sin eventos personalizados

- **Decisión**: Añadir `@vercel/analytics` 2.0.1 a la raíz de React y habilitar Web Analytics en el proyecto Vercel. No se instrumentan eventos, búsquedas, logins ni datos de formularios.
- **Rationale**: Web Analytics ofrece páginas, referidores, país, navegador, sistema y dispositivo como métricas agregadas; Vercel indica que usa datos anonimizados, no cookies y un hash diario que no permite seguimiento entre sitios o días.
- **Alternatives considered**:
  - Guardar eventos en Supabase: descartado por aumentar el tratamiento de datos y la superficie de seguridad.
  - Analítica de terceros: descartada por introducir otra cuenta, términos, script y potencial costo.
  - No medir: descartado por no cumplir la necesidad aprobada de conocer alcance.
- **Sources**: [Vercel Web Analytics](https://vercel.com/docs/analytics), [quickstart](https://vercel.com/docs/analytics/quickstart), `npm view @vercel/analytics version` consultado el 2026-09-18.

## Decisión: configurar únicamente variables públicas de cliente

- **Decisión**: En Vercel se definen `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_USE_DEMO_DATA=false` para Production y Preview. No se agregan service role, contraseñas, Word, fotografías ni backups.
- **Rationale**: Las variables `VITE_*` se incorporan al bundle de Vite. La anon key está diseñada para el cliente y RLS protege el acceso; una service role invalidaría la frontera de seguridad si llegara al navegador.
- **Alternatives considered**:
  - Variables secretas con prefijo `VITE_`: descartado porque se exponen al navegador.
  - Variables solo de producción: descartado porque previews deben poder construir y validar la SPA, sin cambiar el comportamiento de seguridad.
- **Sources**: [Vercel: environment variables](https://vercel.com/docs/environment-variables), [Vercel: Vite environment variables](https://vercel.com/docs/frameworks/frontend/vite#environment-variables).

## Decisión: importar el Word solo desde una terminal local controlada

- **Decisión**: Usar el importador existente con el Word local y un secreto de servidor temporal fuera de Git. Se ejecuta una vez; su `upsert` por código evita duplicados.
- **Rationale**: Crea MG-001 a MG-041 como borradores, omite MG-042 y deja fechas incompletas para revisión sin inferirlas. El secreto jamás entra en Vercel, el navegador o archivos versionados.
- **Alternatives considered**:
  - Importar en el navegador: descartado porque expondría el documento y privilegios de escritura.
  - Publicar durante importación: descartado porque no demuestra consentimiento ni revisión humana.
  - Copiar valores al repositorio: descartado por la constitución de privacidad.

## Decisión: control de acceso y lanzamiento por etapas

- **Decisión**: Desactivar el registro público en Supabase Auth antes de activar producción; conservar la allowlist existente y realizar humo remoto después del primer despliegue. Crear un backup cifrado manual después de la importación y antes de publicar perfiles.
- **Rationale**: Autenticación por sí sola no concede administración. La operación necesita comprobar el estado de proveedor, contenido, rutas y RLS sin registrar secretos.
- **Alternatives considered**:
  - Dejar registro público activo: descartado porque contradice los requisitos de administración explícita.
  - Respaldos sin cifrar: descartado porque contienen datos privados.
