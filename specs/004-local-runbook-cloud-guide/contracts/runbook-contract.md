# Contract: runbook local y guía privada

## README versionado

| Aspecto   | Contrato                                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| Ubicación | `README.md` en la raíz del repositorio.                                                                         |
| Audiencia | Personas que desarrollan, prueban o revisan el MVP local.                                                       |
| Entradas  | Node 24, npm y Podman; archivos privados opcionales solo para importación.                                      |
| Salidas   | URL local, comandos de verificación, resultado esperado y ruta de detención.                                    |
| Secretos  | Solo nombres de variables; nunca valores, IDs reales, credenciales o datos de beneficiarios.                    |
| Nube      | Solo indica que el runbook detallado se conserva fuera del repositorio y que no se despliega desde este cambio. |

## Guía privada de nube

| Aspecto                             | Contrato                                                                                                                                              |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ubicación                           | `../GUIA-DESPLIEGUE-NUBE-MAS-GENEROSIDAD.md`, fuera del árbol Git.                                                                                    |
| Audiencia                           | Responsable autorizado de Supabase y Vercel.                                                                                                          |
| Alcance                             | Preparar un posterior PR de nube; no crear ni modificar recursos remotos en esta feature.                                                             |
| Variables permitidas en Vercel      | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.                                                                                                        |
| Variables prohibidas en Vercel/Vite | `SUPABASE_SERVICE_ROLE_KEY`, contraseñas, tokens, datos personales y cualquier secreto `VITE_*`.                                                      |
| Controles requeridos                | Signup desactivado, allowlist administrativa, migraciones por CLI, bucket privado, RLS, `noindex`, pruebas de humo, backup y rollback no destructivo. |

## Criterio de conformidad

La documentación cumple si los nombres de comandos existen en `package.json`, la guía privada no está bajo Git, `npm run privacy:check` pasa y la batería local termina satisfactoriamente.
