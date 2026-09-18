# Tareas: MVP local consolidado

**Rama**: `fix/local-mvp`
**Entrega**: Un único PR con todos los ajustes necesarios para el MVP local con Podman. La nube queda para un PR posterior.
**Fuente**: specs 001 y 003, constitución y cambio de estrategia solicitado el 17 de septiembre de 2026.

## Checklist único de entrega

- [x] T001 Separar `db:contract` (estático) de `db:test` (PostgreSQL real).
- [x] T002 Verificar privilegios, RLS y columnas exactas de ambas RPC públicas.
- [x] T003 Probar acceso anónimo, estados y Storage con fixtures transaccionales.
- [x] T004 Probar allowlist, publicación incompleta y límite de tres fotos; corregir privilegio DELETE y lectura pública de medios mediante migración incremental.
- [x] T005 Fijar Supabase CLI 2.117.0 en npm y configurar migraciones/pgTAP en CI.
- [x] T006 Documentar contrato estático y ejecutable en README y quickstart.
- [ ] T007 Completar `npm run verify` y validar los checks de GitHub Actions.
- [x] T008 Adaptar los comandos al socket Podman sin modificar configuración global u otros proyectos.
- [x] T009 Implementar arranque, frontend contenedorizado, configuración aislada, cuentas ficticias y parada con datos conservados.
- [x] T010 Probar login, administración, fotos firmadas y archivado en móvil/escritorio contra Podman real.
- [x] T011 Documentar el flujo Podman y dejar explícito que la nube se abordará en otro PR.
- [ ] T012 Registrar evidencia final, subir una sola rama de fix y entregar un único PR para revisión humana.
- [x] T013 Corregir edición de borradores incompletos, navegación tras login, reemplazo de foto principal y recuperación de errores sin perder cambios.
- [x] T014 Verificar el parser con fixtures y el Word en dry-run; conservar ediciones existentes en importaciones repetidas.
- [x] T015 Verificar backup cifrado, fotos, descifrado y rechazo de contraseña incorrecta.
- [x] T016 Verificar persistencia de filas/fotos al reiniciar, noindex y rutas SPA.

## Criterio de cierre

Todas las tareas deben contar con evidencia en `validation.md`. La entrega incluye código, migraciones, pruebas y comandos reproducibles. No incluye aprobación/fusión del PR ni configuración cloud.
