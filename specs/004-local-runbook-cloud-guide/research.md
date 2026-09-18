# Research: Manual local y guía privada de nube

## Decisión: el README es la única fuente versionada para el uso local

- **Decisión**: Documentar en `README.md` prerrequisitos, inicio, recarga, pruebas, importación, backup, detención y reglas de privacidad locales.
- **Rationale**: Queda junto al código y los comandos que documenta, por lo que un PR puede revisarlo y CI puede comprobar los comandos referidos.
- **Alternatives considered**: Un segundo manual local en `docs/` duplicaría el README y elevaría el riesgo de instrucciones divergentes.

## Decisión: la guía de nube se mantiene fuera de Git

- **Decisión**: Entregar `../GUIA-DESPLIEGUE-NUBE-MAS-GENEROSIDAD.md` sin añadirlo al repositorio.
- **Rationale**: Un runbook de producción suele asociarse a propietarios de cuentas, referencias de proyecto y procedimientos de recuperación. Mantenerlo fuera de Git evita que esos detalles terminen por error en una rama o historial compartido.
- **Alternatives considered**: Versionarlo sin secretos en `docs/` seguiría mezclando la operación de una cuenta productiva con el producto y contradice el alcance explícito del usuario.

## Decisión: migraciones remotas solo tras revisión y previsualización

- **Decisión**: La guía de un PR posterior usará `supabase link --project-ref`, `supabase db push --dry-run` y luego `supabase db push`; nunca `db reset --linked` en producción.
- **Rationale**: La documentación oficial explica que `db push` aplica migraciones pendientes, mientras que un reset remoto elimina datos. Solo una persona coordina el push para mantener el historial de migraciones sincronizado.
- **Alternatives considered**: Aplicar SQL manualmente desde el Dashboard rompe el historial de migraciones y complica la reproducción local.
- **Sources**: [Supabase: Database migrations](https://supabase.com/docs/guides/deployment/database-migrations), [Supabase: Local development workflow](https://supabase.com/docs/guides/local-development/cli-workflows).

## Decisión: deshabilitar signup y usar una allowlist administrativa

- **Decisión**: La guía exige desactivar “Allow new users to sign up”, crear la primera cuenta fuera de la aplicación e insertarla en `admin_users`.
- **Rationale**: El MVP no tiene registro público y una sesión autenticada por sí sola no debe conceder privilegios administrativos.
- **Alternatives considered**: Confiar solo en ocultar una pantalla de registro no protege el proveedor de Auth ni la base.
- **Source**: [Supabase Auth: General configuration](https://supabase.com/docs/guides/auth/general-configuration).

## Decisión: Vercel recibe solo configuración pública de cliente

- **Decisión**: En Vercel se configuran únicamente `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`; queda prohibida `SUPABASE_SERVICE_ROLE_KEY` y cualquier variable secreta prefijada `VITE_`.
- **Rationale**: Vite incorpora las variables con prefijo `VITE_` al bundle del navegador. La URL y la clave anónima se protegen con RLS; la clave de servicio elude RLS y debe limitarse a una terminal controlada para importación o backup.
- **Alternatives considered**: Incluir la clave de servicio en el build o en una función estática expondría acceso privilegiado a visitantes.
- **Sources**: [Vercel: Vite](https://vercel.com/docs/frameworks/frontend/vite), [Vercel: Environment variables](https://vercel.com/docs/environment-variables).

## Decisión: la validación local es la puerta previa al PR de nube

- **Decisión**: Ejecutar la verificación estática, contrato de base, flujos locales Playwright, e2e, backup y persistencia antes de entregar la documentación.
- **Rationale**: El usuario pidió confirmar el MVP al 100% localmente y la constitución exige verificaciones reproducibles con datos ficticios.
- **Alternatives considered**: Confiar solo en el build no valida Auth, Storage, RLS ni los volúmenes de Podman.
