# Quickstart: validar identidad visual y movimiento

1. Ejecuta `npm ci` y `npm run local:start`, o usa `VITE_USE_DEMO_DATA=true npm run dev` para datos ficticios.
2. Abre `http://127.0.0.1:5173/` y confirma fondo claro, cian/azul, hero, tarjetas y footer.
3. Baja por el listado: cada tarjeta debe revelarse al entrar y dejar de moverse al estar visible.
4. Pasa el mouse sobre una fotografía y navega con Tab hacia “Leer su historia”: la imagen debe ampliar 20% dentro de su marco sin cambiar el tamaño de la tarjeta.
5. Activa “reducir movimiento” en el sistema o emula `prefers-reduced-motion: reduce`; tarjetas deben permanecer visibles y estáticas.
6. Comprueba que el footer contiene ambos enlaces, sin la marca compacta ni el texto retirado.
7. Ejecuta `npm run verify` y `npm run test:e2e`.
