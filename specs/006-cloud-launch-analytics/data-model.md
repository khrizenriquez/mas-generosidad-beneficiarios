# Data Model: Lanzamiento cloud y analítica anónima

## Cambios de esquema

No hay cambios de tablas, vistas, RPCs, bucket, RLS ni migraciones. La estructura ya desplegada conserva la frontera entre perfiles publicados y registros administrativos.

## Entidades operativas

| Entidad                | Ubicación              | Datos permitidos                                            | Restricciones                                                                              |
| ---------------------- | ---------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Configuración de build | Vercel, fuera de Git   | URL pública, clave publicable y bandera de demo desactivada | No admite secretos, contraseñas ni datos personales.                                       |
| Perfil importado       | `beneficiaries`        | Campos extraídos por el importador y notas administrativas  | 41 códigos MG-001–MG-041, estado `draft`, sin fotos; nunca se publica en la carga.         |
| Cuenta administrativa  | Auth + `admin_users`   | Identificador autenticado y registro de allowlist           | Registro público deshabilitado; Auth sin allowlist no da permisos.                         |
| Métrica agregada       | Panel de Vercel        | Totales anónimos de navegación                              | Sin tabla de aplicación, cookie, evento personalizado, búsqueda, correo ni ID persistente. |
| Respaldo manual        | Archivo local ignorado | Exportación cifrada de contenido administrativo             | Nunca vive en Git, Vercel ni bucket público.                                               |

## Transiciones

```text
Documento privado local
  -> importación controlada
  -> 41 borradores privados
  -> revisión humana + consentimiento externo
  -> publicación individual opcional
  -> archivado cuando corresponda
```

La importación no tiene transición directa a `published`. Las fotografías reales se agregan después por un administrador y conservan el límite existente de tres derivados WebP por perfil.
