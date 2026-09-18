# Data Model: Identidad visual y parallax público

Esta feature no crea ni modifica tablas, columnas, RPCs, buckets, políticas, datos de beneficiarios, fotografías o archivos de importación.

| Área                    | Estado      | Garantía                                                        |
| ----------------------- | ----------- | --------------------------------------------------------------- |
| `beneficiaries`         | Sin cambios | Estados, edad pública y campos privados permanecen iguales.     |
| `beneficiary_images`    | Sin cambios | Máximo de tres imágenes y orden existente permanecen iguales.   |
| Storage y URLs firmadas | Sin cambios | El zoom se aplica solamente tras recibir la URL ya autorizada.  |
| Theme y CSS             | Modificado  | Solo cambia la representación visual de contenido ya permitido. |
