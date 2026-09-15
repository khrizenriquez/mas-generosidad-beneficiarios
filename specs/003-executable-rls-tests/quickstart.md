# Quickstart: validar el contrato RLS

## Requisitos

- Node.js 24 para el harness general.
- Supabase CLI 2.117.0.
- Docker u otro motor compatible en ejecución.

## Chequeo rápido sin contenedores

```bash
npm run db:contract
```

Este comando detecta omisiones estructurales obvias, pero no sustituye las pruebas de roles.

## Contrato ejecutable local

```bash
supabase db start
npm run db:test
supabase stop
```

Resultado esperado: todos los archivos pgTAP terminan con `Result: PASS`. La base es local; no se configuran `SUPABASE_URL`, claves o tokens.

## Verificación completa

```bash
npm run verify
npm run db:test
```

En GitHub Actions, CI instala la versión fijada de la CLI, levanta la base y ejecuta ambos niveles automáticamente. Un fallo de migración, RLS o contrato debe dejar el check `verify` en rojo.
