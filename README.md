# Historias de Más Generosidad

Catálogo público y editor administrativo de las historias de beneficiarios de [Más Generosidad](https://masgenerosidad.org/). El público puede buscar historias publicadas por nombre y leer cada perfil; las personas administradoras autorizadas pueden crear, editar, publicar y archivar perfiles.

Este repositorio contiene el MVP y su entorno local reproducible. No contiene nombres, relatos, fechas, fotografías, exportaciones, respaldos ni credenciales reales.

## Qué incluye el MVP

- Catálogo público móvil primero, búsqueda por nombre sin distinguir mayúsculas ni acentos, tarjetas y página de detalle.
- Perfil público con edad calculada, información escolar, intereses, aspiración, relato revisado y hasta tres fotografías WebP opcionales.
- Área `/admin` con acceso por email/contraseña y allowlist; no existe registro público.
- Borradores incompletos, publicación deliberada y archivado sin borrado definitivo.
- Fecha de nacimiento, notas privadas, estados no públicos y metadatos administrativos fuera del contrato anónimo.
- Fotos en bucket privado y URLs firmadas únicamente para historias publicadas.
- `noindex` en `robots.txt` y cabeceras para que el catálogo no se indexe intencionalmente.

El consentimiento para publicar se gestiona fuera de la aplicación: la ONG debe revisarlo antes de cada publicación.

## Tecnologías

Las versiones están bloqueadas en `package-lock.json`; esta tabla resume las dependencias relevantes de `package.json`.

| Área                        | Tecnología                                                                                                     |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Runtime y empaquetado       | Node.js `>=24 <25`, npm, Vite `8.3.0`                                                                          |
| Interfaz                    | React `19.3.0`, React Router `7.18.3`, Material UI Community `9.4.0`, Emotion y Roboto desde Google Fonts      |
| Formularios y datos remotos | React Hook Form `7.88.0`, Zod `4.6.5`, TanStack Query `5.102.8`, Supabase JS `2.116.0`                         |
| Backend local               | Supabase CLI `2.117.0`, PostgreSQL 17, Auth, REST y Storage ejecutados en Podman                               |
| Imágenes                    | Canvas del navegador para miniatura y detalle WebP; nunca se conserva el original                              |
| Calidad                     | ESLint `10.10.0`, Prettier `3.9.6`, Vitest `5.0.0`, Testing Library, Playwright `1.63.0` y axe-core Playwright |
| Producción futura           | SPA estática compatible con Vercel Hobby y Supabase Free; no hay despliegue configurado en esta rama           |

## Requisitos locales

- macOS o Linux con Node 24 y npm. Confirma con `node --version`.
- [Podman](https://podman.io/) 5 o posterior. No hace falta Docker Desktop ni una instalación global de Supabase CLI: `npm ci` instala la versión fijada para el proyecto.
- En macOS, inicia la máquina antes de trabajar:

  ```bash
  podman machine start
  ```

- En Linux, habilita el socket de usuario si aún no está activo:

  ```bash
  systemctl --user start podman.socket
  ```

Si tu máquina de Podman tiene otro nombre, exporta `PODMAN_MACHINE` antes de iniciar. Un `DOCKER_HOST` explícito tiene prioridad. Para la vista demo no se requiere Podman ni cuenta de Supabase.

## Inicio rápido: MVP completo con Podman

Desde la raíz del repositorio:

```bash
npm ci
npm run local:start
```

Abre [http://127.0.0.1:5173](http://127.0.0.1:5173). El comando arranca PostgreSQL, Auth, REST y Storage locales; prepara cuentas ficticias de prueba; construye el frontend en Podman; y lo publica solo en loopback. La primera descarga de imágenes de contenedor puede tardar varios minutos.

El catálogo comienza vacío. Para probar el área administrativa, abre `/admin/login` y usa la identidad ficticia que el harness crea en `private-import/local-environment.json`. Ese archivo, igual que `.env.podman.local`, está ignorado por Git y nunca debe reutilizarse en nube.

### Desarrollo diario

| Necesidad                              | Comando                            | Resultado                                                                                          |
| -------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| Iniciar o reconstruir el entorno local | `npm run local:start`              | Conserva los datos locales, comprueba Auth/REST/Storage por HTTP y sirve la app en el puerto 5173. |
| Reconstruir solo el frontend en Podman | `npm run local:build`              | Reemplaza el contenedor local del frontend.                                                        |
| Recarga rápida en el host              | `npm run dev:local -- --port 5174` | Vite en `127.0.0.1:5174` conectado al backend de Podman.                                           |
| Detener el entorno                     | `npm run local:stop`               | Detiene únicamente este proyecto y conserva sus volúmenes.                                         |
| Revisar configuración de navegador     | `cp .env.example .env.local`       | Crea un archivo local ignorado; ajusta únicamente valores que correspondan a tu entorno.           |

No uses `supabase stop --no-backup`, `supabase db reset` ni comandos remotos de reset si quieres conservar el entorno local. La aplicación nunca debe apuntar a una base remota durante las pruebas locales.

### Vista visual sin backend

Para explorar la interfaz con perfiles ficticios sin arrancar Podman:

```bash
cp .env.example .env.local
VITE_USE_DEMO_DATA=true npm run dev
```

Sin `VITE_USE_DEMO_DATA=true`, el navegador exige `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Estas dos variables son públicas por diseño; RLS es quien protege los datos. No uses una clave de servicio ni información privada en ninguna variable `VITE_*`.

## Validación local

Primero inicia el stack con `npm run local:start`. Después ejecuta los comandos siguientes; todos usan fixtures, cuentas y fotografías ficticias.

| Comando                    | Qué valida                                                                                                                 | Requiere Podman                          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `npm run verify`           | Entorno, formato, ESLint, pruebas unitarias, build, contexto de agentes, contribución, privacidad y contrato SQL estático. | No                                       |
| `npm run db:test`          | Migraciones y contrato ejecutable de PostgreSQL/RLS.                                                                       | Sí                                       |
| `npm run test:local`       | Flujos móvil y escritorio contra Auth, base y Storage reales: login, edición, publicación, imágenes y archivado.           | Sí                                       |
| `npm run test:e2e`         | Flujos del navegador, accesibilidad y rutas públicas usando el entorno de pruebas configurado.                             | Sí para la validación integrada completa |
| `npm run test:backup`      | Cifrado, descifrado y restauración de un respaldo local de prueba, incluida una fotografía ficticia.                       | Sí                                       |
| `npm run test:persistence` | Que detener y reiniciar Podman conserva los datos del volumen local.                                                       | Sí                                       |
| `npm run privacy:check`    | Que Git no contiene los patrones privados bloqueados.                                                                      | No                                       |
| `npm run context:check`    | Que los contextos administrados de Codex, Claude y Copilot no divergen.                                                    | No                                       |

Una corrida completa recomendada es:

```bash
npm run local:start
npm run verify
npm run db:test
npm run test:local
npm run test:e2e
npm run test:backup
npm run test:persistence
```

`test:local` deja sus perfiles ficticios archivados para conservar trazabilidad. `test:persistence` reinicia el stack como parte de su prueba. Al terminar, ejecuta `npm run local:stop` si ya no lo necesitas.

## Importación privada del Word

El Word y las fotos de origen no son parte de Git. Cuando estén disponibles localmente en `docs/`, primero comprueba la importación sin conectarte ni mostrar información:

```bash
npm run import:beneficiaries -- --dry-run
```

El resultado esperado son 41 borradores con códigos normalizados `MG-001` a `MG-041`, excluyendo `MG042`. Las fechas incompletas quedan pendientes y no se infieren; las fotografías se ignoran en esta importación.

Solo después de una revisión humana, define `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en una terminal controlada para ejecutar `npm run import:beneficiaries`. Nunca pongas la clave de servicio en `.env` versionado, variables `VITE_*`, Vercel o el navegador.

## Demostración temporal autorizada

Después de confirmar externamente el consentimiento de la ONG y aplicar las
migraciones aprobadas, una terminal local puede publicar la demostración con una
ilustración neutral no identificable. Guarda el original solo dentro de
`private-import/`; el script genera derivados WebP, los almacena en el bucket
privado y elimina el original tras una operación correcta.

```bash
set -a
source private-import/supabase-import.env
set +a
npm run publish:temporary-demo -- --source=private-import/ilustracion-temporal.png --confirm-authorized-temporary-publication
```

Esta operación exige exactamente MG-001 a MG-041, usa una imagen principal por
perfil, conserva el límite de tres imágenes y completa solo los campos públicos
obligatorios vacíos con `Información pendiente de actualización`. La fecha
temporal nunca se devuelve públicamente: el catálogo solo muestra edad.

## Backups y reactivación local

El plan gratuito no sustituye un respaldo. Para crear uno manual, define en tu terminal `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y una frase de al menos 16 caracteres en `BACKUP_ENCRYPTION_PASSWORD`; luego ejecuta:

```bash
npm run backup
```

El resultado es un archivo AES-256-GCM en `backups/`, ignorado por Git. Copia el archivo fuera del equipo y conserva la frase por separado. `npm run backup:local` sirve para el stack local.

## Privacidad y límites no negociables

- Nunca versionar `docs/*.docx`, ZIPs, fotos originales, `private-import/`, `backups/`, `.env*` ni exportaciones de datos.
- La fecha de nacimiento completa, notas de importación y estados no públicos son exclusivamente administrativos.
- Un visitante nunca debe poder leer tablas base, borradores, archivados o imágenes privadas; RLS, privilegios, bucket privado y URLs firmadas son obligatorios.
- No hay borrado definitivo desde la interfaz: retirar una historia significa archivarla.
- Un usuario autenticado solo es administrador si aparece en `admin_users`.
- No hay pagos, contacto por beneficiario, registro público ni IA dentro del producto. La única analítica permitida es Vercel Web Analytics agregada, sin eventos personalizados, cookies propias ni datos identificables de visitantes.

## Despliegue futuro

Esta rama no crea ni modifica proyectos de Supabase o Vercel. El runbook detallado de nube se mantiene deliberadamente **fuera de este repositorio** para no mezclar operación de producción, referencias de cuenta o secretos con Git. Su ejecución será objeto de un Pull Request posterior, después de la aprobación de la ONG.

El destino previsto sigue siendo una SPA Vite en Vercel Hobby y Supabase Free. `vercel.json` conserva el enrutamiento SPA y las cabeceras `X-Robots-Tag: noindex, nofollow, noarchive`; el dominio temporal previsto es `mas-generosidad-beneficiarios.vercel.app`.

Para publicar después del Pull Request aprobado, conecta el repositorio a Vercel y deja `main` como rama de producción; los Pull Requests deben ser previews. Usa `npm run build` y `dist`. En Production y Preview configura únicamente `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_USE_DEMO_DATA=false`. Las variables `VITE_*` viajan al navegador: nunca configures una service role, contraseña, Word, fotografía original, respaldo ni cualquier dato personal. Habilita Web Analytics en el panel de Vercel; el componente incluido no envía eventos personalizados, búsquedas, credenciales ni datos de formularios.

Antes de publicar, en Supabase Auth desactiva el registro público y comprueba que cada cuenta administradora aparece en `admin_users`. Después del primer despliegue, ejecuta la prueba de humo de `specs/006-cloud-launch-analytics/quickstart.md`; la demostración temporal autorizada se ejecuta únicamente desde una terminal local controlada.

## Contribución

El repositorio usa trunk-based development: `main` permanece estable y cada cambio llega desde una rama corta mediante un Pull Request hacia `main`. Solo `@khrizenriquez` revisa, aprueba y fusiona. Los agentes no hacen push directo a `main`, no activan auto-merge y no añaden trailers `Co-authored-by`.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para la convención de ramas y el checklist de revisión. Spec Kit está fijado en `.specify/VERSION`; el plan activo se refleja en los archivos de contexto de agentes mediante `npm run context:sync`.
