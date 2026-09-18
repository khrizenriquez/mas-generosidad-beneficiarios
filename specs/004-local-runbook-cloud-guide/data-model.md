# Data Model: Manual local y guía privada de nube

Esta feature no crea, modifica ni migra entidades, tablas, buckets, políticas, archivos de datos o secretos.

| Artefacto                  | Estado              | Regla                                                                                             |
| -------------------------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| Datos de beneficiarios     | Sin cambios         | Permanecen fuera de Git y no se usan para la validación.                                          |
| Esquema Supabase existente | Sin cambios         | Las migraciones solo se documentan como un paso futuro y revisable.                               |
| Variables de entorno       | Sin cambios         | El README muestra nombres, nunca valores; la guía externa prohíbe la clave de servicio en Vercel. |
| Documento privado de nube  | Nuevo, fuera de Git | No contiene secretos, IDs reales ni datos personales.                                             |
