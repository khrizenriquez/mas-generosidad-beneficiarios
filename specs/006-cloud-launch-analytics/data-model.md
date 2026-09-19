# Data Model: Lanzamiento cloud y analítica anónima

## Cambios de esquema

Se añade una migración reproducible que normaliza cualquier género histórico no
permitido a `NULL` y limita `beneficiaries.gender` a `Niño`, `Niña` o `NULL`.
`NULL` representa “Sin especificar” en la interfaz. No se alteran vistas, RPCs,
RLS ni el bucket privado.

## Entidades operativas

| Entidad                | Ubicación                     | Datos permitidos                                            | Restricciones                                                                                |
| ---------------------- | ----------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Configuración de build | Vercel, fuera de Git          | URL pública, clave publicable y bandera de demo desactivada | No admite secretos, contraseñas ni datos personales.                                         |
| Perfil temporal        | `beneficiaries`               | Campos autorizados, fecha administrativa temporal y estado  | 41 códigos MG-001–MG-041; fecha completa privada; estado publicado reversible por archivado. |
| Imagen temporal común  | Bucket + `beneficiary_images` | Derivados WebP no identificables de una ilustración neutral | Dos objetos privados por perfil, una relación principal por perfil y máximo tres imágenes.   |
| Cuenta administrativa  | Auth + `admin_users`          | Identificador autenticado y registro de allowlist           | Registro público deshabilitado; Auth sin allowlist no da permisos.                           |
| Métrica agregada       | Panel de Vercel               | Totales anónimos de navegación                              | Sin tabla de aplicación, cookie, evento personalizado, búsqueda, correo ni ID persistente.   |
| Respaldo manual        | Archivo local ignorado        | Exportación cifrada de contenido administrativo             | Nunca vive en Git, Vercel ni bucket público.                                                 |

## Transiciones

```text
Documento privado local
  -> importación controlada
  -> 41 borradores privados
  -> consentimiento externo confirmado
  -> fecha temporal + ilustración neutral privada
  -> 41 perfiles publicados
  -> sustitución individual o archivado cuando corresponda
```

La importación no tiene transición directa a `published`. La publicación temporal
es una operación posterior, confirmada y separada. Las fotografías reales se
agregan o sustituyen después por un administrador y conservan el límite existente
de tres derivados WebP por perfil.
