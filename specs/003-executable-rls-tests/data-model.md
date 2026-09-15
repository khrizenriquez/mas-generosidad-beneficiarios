# Data Model: Contrato RLS ejecutable

## Cambios al modelo

Esta feature no crea tablas, columnas, relaciones ni estados de producción. La migración existente continúa siendo la única definición del modelo.

## Fixtures transaccionales

Las pruebas crean únicamente estas identidades y registros ficticios:

- **Administrador autorizado**: usuario de Auth incluido temporalmente en `admin_users`.
- **Usuario autenticado no autorizado**: usuario de Auth ausente de `admin_users`.
- **Perfil borrador**: solo código, con campos públicos incompletos.
- **Perfil publicado**: fecha y campos públicos principales completos, sin notas privadas expuestas por la RPC.
- **Perfil archivado**: registro fuera de la proyección pública.
- **Fotografías ficticias**: rutas no reales para perfiles en distintos estados y órdenes 0–2.

## Reglas de aislamiento

- Cada UUID y código son constantes reservadas exclusivamente para el contrato.
- No se cargan archivos binarios ni imágenes.
- Cada suite inicia una transacción y termina con `rollback`.
- La prueba no lee el Word, backups, variables de servicio ni datos remotos.
