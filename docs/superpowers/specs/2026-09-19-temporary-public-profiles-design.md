# Publicación temporal de perfiles: diseño

**Fecha:** 2026-09-19  
**Estado:** Aprobado por la persona responsable de la ONG

## Propósito

Mostrar los 41 perfiles importados en el catálogo público como una demostración
visual administrable. La ONG confirmó que cuenta con consentimiento externo
para publicar los perfiles y autorizó una misma imagen temporal para todos.

## Decisión

- Publicar los 41 perfiles previamente importados, sin crear registros nuevos.
- Establecer `2019-08-19` como fecha de nacimiento administrativa temporal para
  cada perfil. La fecha completa no formará parte de ninguna respuesta pública;
  PostgreSQL continuará exponiendo únicamente la edad calculada.
- Completar únicamente los campos públicos obligatorios que estén vacíos con el
  texto temporal `Información pendiente de actualización`. No se infieren ni se
  redactan datos personales; cada valor queda visible y editable para que un
  administrador lo sustituya.
- Crear una sola ilustración neutral de marca: sin personas, rostros, nombres,
  texto ni información identificable; usará los colores azul y turquesa de Más
  Generosidad.
- Generar las dos variantes WebP ya definidas por el producto (miniatura y
  detalle) y asignar el mismo contenido visual a cada perfil. Las rutas serán
  independientes por perfil para preservar el modelo de almacenamiento, el
  orden de imágenes y el reemplazo posterior desde el área administrativa.
- Guardar los archivos derivados exclusivamente en el bucket privado de
  Supabase. No se almacenará el original, la imagen no entrará en Git y no se
  añadirá a las variables de Vercel.

## Flujo operativo

1. Generar e inspeccionar la ilustración temporal en el equipo local.
2. Transformarla localmente a WebP para miniatura y detalle; eliminar el
   original de trabajo cuando la carga haya terminado.
3. Usar una credencial de servidor almacenada solo en `private-import/` para
   cargar ambas variantes y crear una imagen principal por cada perfil.
4. Completar la fecha temporal, aplicar el texto temporal solo a campos
   obligatorios vacíos y cambiar el estado de los 41 perfiles a `published` en
   una operación comprobable.
5. Verificar únicamente conteos y límites: 41 publicaciones, ninguna fecha
   completa en RPCs públicas, una imagen por perfil y URLs firmadas disponibles
   solo para contenido publicado.

## Límites y reversibilidad

- Esta operación no introduce borrado definitivo ni relaja RLS, allowlist,
  bucket privado o URLs firmadas.
- Un administrador puede sustituir después la fecha temporal y la imagen de
  cada perfil; la eliminación de la imagen temporal se hará desde el flujo
  administrativo existente o mediante una operación de mantenimiento
  autorizada.
- Si la ONG retira una autorización, se archivará el perfil; esto lo oculta del
  catálogo y bloquea nuevas URLs firmadas para sus imágenes.
- Los resultados operativos y el PR solo contendrán cantidades agregadas, nunca
  nombres, relatos, rutas de objetos, credenciales, fotografías ni otros datos
  reales.

## Verificación

- Pruebas de esquema, formulario e importación para los valores permitidos de
  género: `Niño`, `Niña` o sin especificar.
- Pruebas de RLS y RPC que demuestren que la fecha completa sigue privada antes
  y después de publicar.
- Pruebas de interfaz móvil y escritorio para el catálogo, detalle y estado de
  imagen.
- Consulta remota de conteos solamente, seguida de un respaldo local cifrado.
