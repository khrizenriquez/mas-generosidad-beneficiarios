# Historias de Más Generosidad

Catálogo público y editor administrativo de beneficiarios para [Más Generosidad](https://masgenerosidad.org/). Es una SPA React en JavaScript preparada para Vercel Hobby y Supabase Free.

## Requisitos

- Node 24 LTS
- Un proyecto Supabase y, para publicar, una cuenta Vercel
- Podman para el MVP completo local; Supabase CLI 2.117.0 se instala con npm

## Desarrollo

### MVP completo con Podman

Requiere Node 24, npm y Podman con una máquina activa en macOS (`podman machine start`). La CLI de Supabase se instala con `npm ci`; no hace falta Docker Desktop ni Supabase global. En Linux activa el socket con `systemctl --user start podman.socket`. Para una máquina con otro nombre usa `PODMAN_MACHINE`; un `DOCKER_HOST` explícito tiene prioridad.

```bash
npm ci
npm run local:start
```

Abre <http://127.0.0.1:5173>. El frontend se construye y sirve en Podman, junto a PostgreSQL, Auth, REST y Storage. La primera descarga puede tardar varios minutos. El catálogo comienza vacío: entra por `/admin/login` con la cuenta ficticia guardada en `private-import/local-environment.json`. Este archivo y `.env.podman.local` están ignorados por Git; nunca uses esas credenciales en la nube.

`local:start` conserva datos existentes y actualiza el frontend. Usa `npm run local:build` después de cambiar código, o `npm run dev:local -- --port 5174` para recarga rápida con Vite en el host y el backend de Podman. `npm run local:stop` detiene únicamente este proyecto y conserva los volúmenes. No uses `supabase stop --no-backup` ni `db reset` si quieres conservar tus datos.

```bash
npm run verify
npm run db:test
npm run test:local
npm run test:backup
```

`test:local` recorre móvil y escritorio con Auth, base y fotografías reales locales; solo usa identidades y perfiles ficticios con códigos reservados MG-800–MG-899, separados del Word. Deja los perfiles de prueba archivados, sin borrar trazabilidad. `test:backup` comprueba cifrado, descifrado y fotografías, y elimina únicamente su archivo de prueba. Para un respaldo conservable define `BACKUP_ENCRYPTION_PASSWORD` en tu terminal y ejecuta `npm run backup:local`.

Podman puede informar `starting` en Kong/PostgREST aunque no tengan healthcheck definido. El harness comprueba Auth, RPC y Storage mediante HTTP antes de confirmar el arranque; no acepta un servicio inaccesible. Studio, analítica, correo y otros servicios ajenos al MVP no se inician.

### Vista demo sin backend

```bash
cp .env.example .env.local
npm ci
VITE_USE_DEMO_DATA=true npm run dev
```

Los datos demo son ficticios. Sin `VITE_USE_DEMO_DATA=true`, la app exige `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para consultar información.

## Preparar Supabase

1. Crea un proyecto gratuito y desactiva el registro público en Authentication.
2. Vincula el proyecto con Supabase CLI y aplica todas las migraciones de `supabase/migrations/` con `supabase db push`.
3. En Authentication crea manualmente la primera cuenta con email y contraseña.
4. Añádela a la allowlist desde SQL Editor:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'ADMIN@EJEMPLO.ORG';
```

5. Define en Vercel `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. La `SUPABASE_SERVICE_ROLE_KEY` nunca se configura como variable `VITE_` ni es necesaria para el frontend.

## Importar el Word privado

Primero valida sin conectarte ni mostrar datos en consola:

```bash
npm run import:beneficiaries -- --dry-run
```

Después define `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` solo en tu terminal local y ejecuta `npm run import:beneficiaries`. El proceso lee `docs/BASE DE DATOS MG ONG.docx`, inserta 41 borradores, excluye MG042 y no crea JSON intermedio. Repetirlo conserva los códigos ya existentes y sus ediciones. Las fotos del ZIP se ignoran.

## Verificación

El comando general incluye el contrato estático de base y no requiere Docker:

```bash
npm run verify
npm run test:e2e
```

Para ejecutar las migraciones y políticas contra PostgreSQL real:

```bash
npm run local:start
npm run db:test
npm run local:stop
```

`npm run db:contract` ejecuta únicamente el chequeo estructural rápido incluido en `verify`; no reemplaza pgTAP. GitHub Actions instala la versión fijada de Supabase CLI, levanta una base desechable y ejecuta `db:test` en cada Pull Request sin secretos ni conexión al proyecto remoto.

`npm run context:sync` actualiza los bloques compartidos para Codex, Claude y Copilot; `context:check` impide que diverjan. Spec Kit está fijado en `.specify/VERSION`, con feature activa en `specs/003-executable-rls-tests/`.

El scaffold oficial de Spec Kit 1.0.6 instala los skills `$speckit-specify`, `$speckit-plan`, `$speckit-tasks`, `$speckit-implement` y auxiliares para los tres agentes. Codex es la integración predeterminada. La extensión oficial `agent-context` mantiene en los tres archivos el puntero al plan activo; las reglas privadas del proyecto se sincronizan desde `.agent-context/shared.md`.

## Contribución

El repositorio usa trunk-based development: `main` permanece estable y cada cambio llega desde una rama corta mediante un Pull Request. Solo `@khrizenriquez` aprueba y fusiona; los agentes no usan auto-merge ni añaden trailers `Co-authored-by`. Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para nombres de rama, verificaciones y checklist.

## Backup y reactivación

El nivel gratuito no se considera una estrategia de backup. Define `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y una frase de al menos 16 caracteres en `BACKUP_ENCRYPTION_PASSWORD`; luego ejecuta `npm run backup`. Se crea un archivo AES-256-GCM en `backups/`, ignorado por Git. Copia ese archivo fuera del equipo y conserva la frase por separado.

Si Supabase pausa el proyecto por inactividad, entra al panel, abre el proyecto y elige restaurarlo/reactivarlo; después confirma el catálogo y crea un backup manual. Las cuotas y políticas gratuitas pueden cambiar, así que revísalas antes de lanzamiento.

## Despliegue

La entrega actual se valida localmente con Podman. La configuración y validación en Vercel/Supabase se realizarán en un PR posterior, según la estrategia acordada. Las instrucciones siguientes son una referencia; no implican que la nube esté desplegada.

Importa `https://github.com/khrizenriquez/mas-generosidad-beneficiarios.git` en Vercel, usa el preset Vite, comando `npm run build` y salida `dist`. `vercel.json` conserva el routing SPA y envía `X-Robots-Tag: noindex, nofollow, noarchive` en todas las rutas. El dominio inicial esperado es `mas-generosidad-beneficiarios.vercel.app`.

## Privacidad

No agregues el Word, ZIP, fotos originales, exportaciones, backups o datos reales a Git. La aplicación no registra consentimiento: la ONG debe confirmarlo fuera del sistema antes de publicar. Archivar retira una historia del catálogo sin destruir la trazabilidad.
