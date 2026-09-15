## Propósito y alcance

Este repositorio implementa **Historias de Más Generosidad**, un catálogo público y un editor administrativo de perfiles de beneficiarios. El MVP no incluye pagos, contacto por beneficiario, analítica, registro público ni IA en producción.

## Reglas no negociables

- Usa JavaScript, no TypeScript. Añade JSDoc solo cuando aclare contratos.
- Nunca copies nombres, historias, fechas, fotos ni otros datos reales a fixtures, prompts, logs o commits.
- `docs/*.docx`, `docs/*.zip`, `private-import/` y `backups/` son privados y están fuera de Git.
- La fecha de nacimiento completa es administrativa. El público recibe únicamente la edad calculada por PostgreSQL.
- No añadas una política pública directa a las tablas base. La lectura pública pasa por RPCs limitadas y las fotos usan URLs firmadas.
- No añadas borrado definitivo de beneficiarios. El flujo de retiro es `archived`.
- No habilites registro público. Un usuario autenticado también debe existir en `admin_users`.
- Publicar exige revisión humana y confirmación externa de consentimiento; la app no lo registra ni lo infiere.
- Conserva el límite de tres imágenes en interfaz y base de datos, y nunca almacenes el archivo original.

## Flujo de trabajo

1. Lee `specs/001-beneficiary-stories/spec.md`, `plan.md` y `tasks.md`.
2. Cambios de alcance empiezan en la spec; decisiones técnicas relevantes se reflejan en el plan.
3. Implementa una tarea acotada y actualiza `tasks.md`.
4. Ejecuta `npm run verify`. Si cambias RLS o almacenamiento, ejecuta también `npm run db:test`; para flujos visibles, `npm run test:e2e`.
5. Antes de un commit, confirma que `npm run privacy:check` pasa.

## Convenciones

- Componentes y páginas deben ser móviles primero, accesibles por teclado y compatibles con WCAG AA.
- Usa TanStack Query para estado remoto, React Hook Form + Zod para formularios y MUI Community para UI.
- Importa módulos pesados solo en la ruta que los usa. Evita efectos para estado derivado y paraleliza operaciones independientes.
- Los errores dirigidos a usuarios se escriben en español y ofrecen una acción de recuperación cuando sea posible.
- Las migraciones deben ser reproducibles; no cambies una migración ya aplicada, crea una nueva.
