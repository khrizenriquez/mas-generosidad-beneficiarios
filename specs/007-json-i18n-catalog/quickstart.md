# Guía de validación: catálogos JSON de idioma público

## Requisitos

- Node.js 24 LTS disponible según el runbook del repositorio.
- Dependencias instaladas con el lockfile existente.
- Para flujos end-to-end, el entorno local de Podman/Supabase levantado con los
  comandos documentados en `README.md`.

No se requiere secreto, proyecto remoto ni dato real para validar este cambio.

## Validación rápida local

1. Iniciar la aplicación en el modo local habitual.
2. Abrir la portada en una ventana con almacenamiento local vacío: debe abrir en
   español.
3. Usar el selector superior derecho para elegir English: encabezado, búsqueda,
   conteo, tarjetas, footer y estados deben actualizarse sin recarga.
4. Abrir una historia: las etiquetas y unidades cambian, pero el contenido
   editorial recibido permanece idéntico.
5. Recargar: se conserva la elección. Deshabilitar almacenamiento local y
   repetir: el selector funciona durante la sesión y el siguiente arranque usa
   español.
6. Visitar `/admin/login` y rutas administrativas: no debe aparecer selector ni
   cambiar los textos administrativos.

## Accesibilidad y presentación

1. En viewport móvil y escritorio, navegar al selector con Tab y escoger ambos
   idiomas sin usar puntero.
2. Confirmar foco visible, nombre accesible de idioma actual y ausencia de
   desbordamiento para “Español” y “English”.
3. Cambiar idioma con una tarjeta sin fotografía y confirmar que la alternativa
   respetuosa de galería también se traduce.

## Comandos de verificación

```sh
npm run verify
npm run test:e2e
npm run privacy:check
```

Los resultados deben pasar sin cambios de esquema, secretos, perfiles reales,
contenido del Word privado ni peticiones de analítica personalizadas.
