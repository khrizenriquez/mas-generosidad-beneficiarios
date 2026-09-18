# Research: Identidad visual y parallax público

## Decisión: tokens semánticos centralizados en MUI

- **Decisión**: Usar azul como `primary`, cian como `secondary`, azul oscuro para tinta y superficies blancas/azuladas claras; los componentes consumen `palette` y `divider` en vez de hexadecimales heredados.
- **Rationale**: Un token semántico evita que la interfaz derive hacia colores inconsistentes y permite aplicar la paleta del logo a áreas públicas y administrativas sin duplicar decisiones de contraste.
- **Alternatives considered**: Cambiar colores por componente deja tonos verdes y dorados residuales; usar cian como texto principal no alcanza el contraste esperado sobre blanco.

## Decisión: reveal de tarjetas con IntersectionObserver

- **Decisión**: Cada `StoryCard` observa su propio contenedor con `IntersectionObserver`, cambia a revelada al entrar y se desobserva.
- **Rationale**: Evita listeners globales de scroll y trabajo para elementos fuera del viewport; el efecto se mantiene visual sin afectar búsqueda ni carga de datos.
- **Alternatives considered**: Un handler de scroll continuo causa más trabajo en móvil; una biblioteca de animación añade peso sin aportar un requisito necesario.

## Decisión: zoom de imagen, no de tarjeta

- **Decisión**: El marco de imagen conserva dimensiones y `overflow: hidden`; solamente el `img` pasa a `scale(1.2)` en hover o `focus-within`.
- **Rationale**: Se obtiene profundidad sin cambio de layout, sin cortar contenido y con el mismo resultado para teclado.
- **Alternatives considered**: Escalar toda la tarjeta provoca reflow perceptible y puede invadir tarjetas vecinas.

## Decisión: reducir movimiento de forma completa

- **Decisión**: El hook devuelve las tarjetas como visibles sin observación cuando `prefers-reduced-motion` está activo; CSS anula transición y transformación decorativas.
- **Rationale**: Reducir solo la duración todavía deja un estado inicial desplazado u opacidad inesperada.
- **Alternatives considered**: Confiar únicamente en la regla CSS global no evita que JavaScript espere la entrada al viewport.
