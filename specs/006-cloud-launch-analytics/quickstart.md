# Quickstart: Lanzamiento cloud y analítica anónima

## Prerrequisitos seguros

- Rama `feat/cloud-launch-analytics` actualizada desde `main` y un único Pull Request pendiente de revisión humana.
- Node 24 LTS, npm y Podman para las pruebas locales.
- Proyecto Supabase con las migraciones ya aplicadas, Auth sin registro público y administradores explícitos.
- Proyecto Vercel conectado al repositorio; solo la persona autorizada configura variables y habilita analítica.
- El Word y cualquier secreto de importación viven fuera de Git y no se muestran en terminal, PR ni incidencias.

## Validación antes del PR

```bash
npm ci
npm run verify
npm run db:test
npm run test:local
npm run test:e2e
npm run test:backup
npm run test:persistence
```

El resultado esperado es una batería verde, sin secreto ni documento privado rastreado y con flujos públicos/administrativos cubiertos en móvil y escritorio.

## Configuración externa tras la aprobación del PR

1. En Vercel, conectar el repositorio, confirmar que `main` es producción y que build/salida son `npm run build` y `dist`.
2. Definir las tres variables permitidas para Production y Preview; comprobar que `VITE_USE_DEMO_DATA` es `false` y que no existe ningún secreto de servidor.
3. Habilitar Web Analytics desde el proyecto Vercel.
4. En Supabase Auth, comprobar que registro público está deshabilitado y que cada admin aparece en `admin_users`.
5. Fusionar el PR; esperar el despliegue automático de `main` y abrir la URL de producción.

## Importación, demostración temporal y verificación posterior

1. Desde una terminal local controlada, colocar el secreto temporal y ejecutar el importador existente contra el Word privado.
2. Confirmar solo los totales: 41 borradores, MG-042 excluido, sin fotos y ninguna publicación automática.
3. Solo después de confirmar consentimiento externo, ejecutar la preparación temporal desde la terminal local: ilustración neutral, derivados WebP privados, fecha administrativa temporal y publicación de los 41 perfiles.
4. Confirmar solo los totales: 41 publicados, una imagen por perfil, ninguna fecha completa en las respuestas públicas y ninguna exposición de objetos del bucket sin URL firmada.
5. Crear un backup manual cifrado y guardarlo fuera del equipo de trabajo.
6. En producción, probar recarga de `/`, una historia, `/admin/login`, login de una cuenta autorizada y rechazo de una no autorizada.
7. Con una sesión anónima, verificar que no aparece una fecha completa, nota privada, perfil archivado ni imagen privada; comprobar la búsqueda y la galería de los perfiles publicados.
8. Comprobar que el panel de Vercel muestra métricas agregadas sin eventos personalizados y que el sitio conserva `noindex`.

## Recuperación segura

- Si el build falla por variables públicas, corregir únicamente las tres permitidas y volver a desplegar desde el flujo Git.
- Si Supabase está pausado, reactivarlo desde su consola y ejecutar la comprobación de humo; no restaurar ni reiniciar la base.
- Si se detecta una publicación no autorizada, archivarla desde el área administrativa y revisar el consentimiento fuera de la aplicación.
- Si se necesita volver atrás, promover el último despliegue sano desde Vercel o revertir mediante un nuevo Pull Request; no modificar `main` directamente.
