# Production Launch Contract

## Configuración externa obligatoria

| Sistema        | Acción                                                    | Valores permitidos                                                        | Prohibiciones                                                                                  |
| -------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Vercel         | Conectar repositorio y seleccionar `main` como producción | Build `npm run build`, salida `dist`, reescrituras de `vercel.json`       | Despliegue manual que eluda el PR, claves privadas en build.                                   |
| Vercel         | Definir entorno de Production y Preview                   | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_USE_DEMO_DATA=false` | Service role, contraseña, Word, fotos, backups, valores con datos personales.                  |
| Vercel         | Habilitar Web Analytics                                   | Componente oficial sin eventos personalizados                             | Cookies propias, perfiles persistentes, eventos con búsqueda, Auth o contenido de formularios. |
| Supabase Auth  | Desactivar registro público                               | Email/password para cuentas creadas por administrador                     | Registro abierto o promoción automática de cualquier usuario a admin.                          |
| Terminal local | Importar, preparar demo y crear backup                    | Archivo local ignorado, secreto temporal y respaldo cifrado               | Secretos en Git, logs con valores reales o ejecución desde navegador.                          |

## Contrato de build

1. Un build sin las dos variables públicas falla de forma comprensible para datos reales y nunca activa fixtures por omisión.
2. Un build de preview usa las mismas fronteras RLS y de lectura pública que producción.
3. La ruta `/`, una ruta `/historias/:code` y `/admin/login` resuelven después de recargar directamente.
4. Toda respuesta conserva `X-Robots-Tag: noindex, nofollow, noarchive` y no debilita las cabeceras existentes.

## Contrato de observabilidad

1. El componente de analítica se monta una sola vez junto a la raíz de la aplicación.
2. No se llama a APIs de eventos, identificación, usuario, búsqueda, formulario o grabación de sesión.
3. Un fallo o bloqueo de la analítica no impide renderizar, buscar ni administrar perfiles.

## Contrato de importación y humo

1. La carga privada informa solo totales: 41 perfiles, MG-042 excluido, sin valores personales impresos.
2. La operación temporal posterior exige una confirmación documentada de consentimiento, asigna una fecha privada temporal, carga solo derivados WebP de una ilustración neutral y deja 41 perfiles `published` con una imagen principal cada uno.
3. Una consulta anónima solo devuelve el contrato público y una consulta a tablas base, fecha completa, borradores, archivados o fotos no autorizadas queda denegada.
4. La publicación temporal no puede exceder tres imágenes por perfil, no almacena originales y permite sustitución o archivado por administración.
5. Solo una persona autorizada ejecuta cambios de consola, configuración de acceso o publicación; toda operación externa se confirma inmediatamente antes de aplicarse.
