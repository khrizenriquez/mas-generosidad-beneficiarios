# Public Contract: Localizaciones de historias

## RPCs existentes

Las firmas permanecen:

```text
get_public_beneficiaries()
get_public_beneficiary(p_code text)
```

Cada fila conserva `id`, `code`, `full_name`, `age`, `gender`, `images` y
añade `localizations`:

```json
{
  "es": {
    "school_grade": "string",
    "favorite_subject": "string",
    "hobby": "string",
    "future_goal": "string",
    "public_story": "string"
  },
  "en": {
    "school_grade": "string",
    "favorite_subject": "string",
    "hobby": "string",
    "future_goal": "string",
    "public_story": "string"
  }
}
```

Solo se incluyen claves de versiones completas. La ausencia de `en` o `es`
significa indisponibilidad, no permiso para reutilizar la otra clave.

Cada imagen conserva rutas, orden y principal; incorpora:

```json
{ "alt_texts": { "es": "string", "en": "string" } }
```

`alt_texts` puede ser un objeto vacío. Ninguno de los contratos incluye
`date_of_birth`, `import_notes`, estado, auditoría ni localizaciones de un
perfil que no esté publicado.
