# Diseño de identidad visual y parallax público

## Decisión aprobada

La portada pública adopta una identidad luminosa basada en el logo: cian y azul como colores de marca, azul oscuro para lectura y blanco para contraste. La experiencia administrativa conserva los mismos tokens sin incorporar movimiento decorativo.

El footer queda reducido a dos enlaces seguros: la ONG y “Made with love by Christofer Enríquez”. Se retiran la marca compacta y el texto de privacidad anterior.

Las tarjetas de historias revelan profundidad al entrar al viewport. Al hover o foco de teclado, la fotografía amplía 20% dentro de su propio marco, sin desplazar la tarjeta. Las personas con `prefers-reduced-motion` reciben una versión estática.

## Alternativas evaluadas

1. **CSS e IntersectionObserver — elegida**: no añade dependencias, anima solo tarjetas visibles y puede respetar reducción de movimiento.
2. Una librería de animación: acelera la composición, pero añade peso y mantenimiento injustificados para una portada estática.
3. Parallax continuo ligado a cada evento de scroll: se descarta por trabajo innecesario durante desplazamiento y mayor riesgo de afectar móviles.

## Límites

- El cambio no modifica datos, Storage, RLS, rutas ni llamadas remotas.
- El zoom se aplica únicamente a imágenes existentes y se recorta con `overflow: hidden`.
- Las pruebas usan fixtures; las fotos de demo local no se añaden a Git.
