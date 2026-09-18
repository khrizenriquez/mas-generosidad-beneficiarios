# Quickstart: validar el runbook local

## Prerrequisitos

- Node 24 y npm disponibles.
- Podman instalado; en macOS, `podman machine start` debe haber terminado antes de iniciar el stack.
- Un clon del repositorio sin archivos privados ni variables de producción.

## Recorrido local

1. Ejecuta `npm ci`.
2. Ejecuta `npm run local:start` y abre `http://127.0.0.1:5173`.
3. Comprueba el catálogo público y `/admin/login` usando solo la identidad ficticia local creada por el harness.
4. Ejecuta, en este orden, `npm run verify`, `npm run db:test`, `npm run test:local`, `npm run test:e2e`, `npm run test:backup` y `npm run test:persistence`.
5. Ejecuta `npm run local:stop` cuando ya no necesites el entorno. Los volúmenes quedan conservados.

## Recorrido de documentación privada

1. Comprueba que `GUIA-DESPLIEGUE-NUBE-MAS-GENEROSIDAD.md` existe junto al directorio del repositorio, no dentro de él.
2. Verifica que no contiene claves, contraseñas, IDs de proyecto reales ni información de beneficiarios.
3. Comprueba que enumera solo las dos variables permitidas para Vercel y que prohíbe la clave de servicio en el navegador.
4. Confirma que el archivo describe un despliegue posterior y no ejecuta ni solicita cambios remotos en esta rama.
