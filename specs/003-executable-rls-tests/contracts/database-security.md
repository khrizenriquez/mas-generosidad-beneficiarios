# Contract: Seguridad de base de datos

Una ejecución conforme debe demostrar todos los puntos siguientes contra una base creada desde las migraciones del repositorio.

## Visitante anónimo

- No posee privilegios directos sobre `admin_users`, `beneficiaries` ni `beneficiary_images`.
- Puede ejecutar las dos RPC públicas.
- La colección pública contiene únicamente el perfil `published` del fixture.
- La fila pública contiene exactamente `id`, `code`, `full_name`, `age`, `gender`, `school_grade`, `favorite_subject`, `hobby`, `future_goal`, `public_story` e `images`.
- No puede insertar, actualizar ni eliminar beneficiarios.
- Solo puede leer objetos de Storage asociados a perfiles publicados; borradores y archivados quedan fuera de política.

## Usuario autenticado no autorizado

- `is_current_user_admin()` devuelve falso.
- No obtiene filas de tablas administrativas.
- No puede insertar ni actualizar beneficiarios o imágenes.

## Administrador autorizado

- `is_current_user_admin()` devuelve verdadero.
- Puede leer, crear y editar perfiles.
- No posee privilegio ni política para borrar beneficiarios definitivamente.
- No puede publicar un perfil incompleto.
- Puede publicar un perfil completo.
- No puede registrar una cuarta fotografía para el mismo perfil.

## Aislamiento

- Todos los fixtures son ficticios.
- Cada archivo finaliza con `rollback`.
- Ninguna prueba necesita credenciales o URL remota.
