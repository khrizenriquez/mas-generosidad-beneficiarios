# Quickstart: validar el contrato RLS

## Requisitos

- Node.js 24 para el harness general.
- Podman instalado, con máquina activa en macOS o socket de usuario activo en Linux.
- `npm ci` instala Supabase CLI 2.117.0 fijada en el lockfile.

## Chequeo rápido sin contenedores

```bash
npm run db:contract
```

Este comando detecta omisiones estructurales obvias, pero no sustituye las pruebas de roles.

## Contrato ejecutable local

```bash
npm run local:start
npm run db:test
npm run test:local
npm run test:backup
npm run test:persistence
npm run local:stop
```

Resultado esperado: pgTAP termina con `Result: PASS`, los escenarios de navegador pasan en móvil y escritorio y los verificadores de backup/persistencia terminan correctamente. La app está en `http://127.0.0.1:5173`; las credenciales ficticias se generan en `private-import/local-environment.json`. No se requieren claves cloud.

## Verificación completa

```bash
npm run verify
npm run db:test
```

En GitHub Actions, `npm ci` instala la versión fijada de la CLI. El job `verify` ejecuta migraciones y pgTAP; `local-podman` levanta el MVP completo con Podman y prueba navegador, backup y persistencia. Un fallo debe dejar el check correspondiente en rojo. La preparación de nube será un PR posterior.
