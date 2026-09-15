# Diseño aprobado: Historias de Más Generosidad

Aplicación pública por enlace y editor administrativo para 41 historias iniciales. La lectura pública prioriza dignidad y privacidad: muestra edad calculada, nunca fecha completa, y únicamente perfiles publicados. El editor acepta borradores incompletos, pero PostgreSQL impide publicar si faltan datos principales. El consentimiento se gestiona fuera del sistema.

La solución usa React SPA en Vercel Hobby y Supabase Free para datos, autenticación y dos derivados WebP por foto. RLS, allowlist administrativa, RPCs públicas de columnas explícitas, bucket privado y URLs firmadas forman la frontera de seguridad. Los perfiles se archivan; no hay borrado definitivo en la interfaz.

El documento fuente se procesa localmente hacia Supabase sin generar JSON intermedio. Los 41 registros útiles se importan como borradores, MG042 se excluye y ninguna fecha incompleta se infiere. Word, ZIP, originales y backups permanecen ignorados.

La experiencia visual sigue la metáfora de un cuaderno de historias comunitarias: papel cálido, tinta verde, maíz, arcilla y una cinta de aspiración. La interfaz es móvil primero, española, accesible por teclado y sin donaciones, contacto individual, analítica o IA de producto.
