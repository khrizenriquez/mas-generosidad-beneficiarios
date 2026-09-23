# Quickstart: Contenido bilingüe de beneficiarios

1. Arranca el entorno local con `npm run local:start`.
2. Ejecuta `npm run db:test` después de aplicar la migración para validar RLS,
   publicación, privacidad y localizaciones.
3. Inicia sesión con una cuenta administradora local y crea un perfil: completa
   español, guarda inglés vacío y publica. Debe funcionar.
4. Edita el mismo perfil, escribe solo un campo inglés e intenta publicar. Debe
   fallar hasta completar los cinco campos ingleses.
5. En el catálogo público, abre ese perfil, elige inglés y verifica el estado
   de indisponibilidad. Completa inglés, guarda, refresca y confirma que ambos
   idiomas cambian instantáneamente sin otra solicitud.
6. Ejecuta `npm run verify`, `npm run test:e2e` y `npm run privacy:check`.

No apuntes pruebas a Supabase cloud ni agregues datos personales al repositorio.
