# Validation: Lanzamiento cloud y analítica anónima

## Validación local

| Comprobación                                 | Resultado | Evidencia agregada                                                                                                                   |
| -------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run verify`                             | PASS      | Formato, lint, 18 unitarias, build, contexto de agentes, política de contribución, privacidad y contrato SQL estático.               |
| `npm run test:e2e`                           | PASS      | 24 pruebas Playwright en móvil y escritorio: navegación, recarga de rutas profundas, privacidad, accesibilidad, footer y movimiento. |
| `npm run local:start` + `npm run test:local` | PASS      | 4 flujos contra Auth, PostgreSQL y Storage locales.                                                                                  |
| `npm run db:test`                            | PASS      | 51 pruebas pgTAP de RLS, RPC pública, autorización y Storage.                                                                        |
| `npm run test:backup`                        | PASS      | Backup local cifrado, descifrado y rechazo de contraseña errónea.                                                                    |
| `npm run test:persistence`                   | PASS      | Reinicio local conserva perfiles y derivados WebP; frontend y rutas responden.                                                       |
| `npm audit --omit=dev`                       | PASS      | 0 vulnerabilidades reportadas después de fijar la dependencia de analítica.                                                          |
| Privacidad y diff                            | PASS      | Sin secretos ni datos privados rastreados; diff sin errores de espacio.                                                              |

## Hallazgo de aislamiento corregido

`test:local` conserva intencionalmente sus fixtures locales. Las pruebas pgTAP de privacidad comparaban la colección completa y todo el bucket, por lo que dependían de ejecutar sobre una base vacía. Se limitaron las aserciones contractuales a sus códigos y objetos `contract/`; el resultado sigue verificando que no se exponen borradores o archivados y ahora es independiente del orden del harness.

## Pendiente externo después del merge

- Configurar Vercel con las tres variables públicas permitidas para Production y Preview, conectar `main` como producción y habilitar Web Analytics.
- Comprobar que Supabase Auth tiene registro público deshabilitado.
- Con una clave de servidor temporal guardada solo en local, importar los 41 borradores, crear respaldo cifrado y ejecutar humo remoto.
