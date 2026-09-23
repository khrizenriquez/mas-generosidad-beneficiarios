# Data Model: Contenido bilingüe de beneficiarios

## `beneficiary_localizations`

| Campo                      | Tipo        | Restricción                   |
| -------------------------- | ----------- | ----------------------------- |
| `beneficiary_id`           | UUID        | FK a `beneficiaries`, no nulo |
| `locale`                   | text        | `es` o `en`, no nulo          |
| `school_grade`             | text        | nulo o máximo 180 caracteres  |
| `favorite_subject`         | text        | nulo o máximo 180 caracteres  |
| `hobby`                    | text        | nulo o máximo 500 caracteres  |
| `future_goal`              | text        | nulo o máximo 500 caracteres  |
| `public_story`             | text        | nulo o máximo 5000 caracteres |
| `created_at`, `updated_at` | timestamptz | auditoría de registro         |

Clave primaria compuesta: `(beneficiary_id, locale)`.

Una localización está **completa** cuando los cinco campos editoriales son
texto no vacío. Solo localizaciones completas aparecen en el contrato público.

## `beneficiary_image_localizations`

| Campo      | Tipo | Restricción                        |
| ---------- | ---- | ---------------------------------- |
| `image_id` | UUID | FK a `beneficiary_images`, no nulo |
| `locale`   | text | `es` o `en`, no nulo               |
| `alt_text` | text | nulo o máximo 300 caracteres       |

Clave primaria compuesta: `(image_id, locale)`. Una localización de imagen
vacía no se incluye públicamente; el cliente utiliza una descripción genérica
del catálogo de interfaz.

## Reglas de publicación

1. El perfil debe tener fecha de nacimiento y nombre.
2. Debe existir una localización española completa.
3. Al cambiar desde `draft` a `published`, si existe una fila inglesa con
   cualquier valor principal, sus cinco campos principales deben ser no vacíos.
   Un perfil ya publicado puede conservar una fila inglesa parcial mientras se
   completa, pero esa fila nunca aparece en el contrato público.
4. Fotos y localizaciones de imagen no son obligatorias para publicar.

## Migración y fuente de verdad

La migración crea/actualiza una fila `es` desde los campos editoriales
históricos de `beneficiaries`, sin sobreescribir una fila `es` que un
administrador ya hubiera editado. Desde la entrega, servicios y RPCs leen y
escriben exclusivamente las tablas de localización. Las columnas históricas
permanecen como respaldo de migración, sin exposición pública ni nuevas
escrituras.
