# Contract: tema, footer y movimiento público

## Paleta

| Token                | Uso                                                   | Regla de contraste                 |
| -------------------- | ----------------------------------------------------- | ---------------------------------- |
| `primary` azul       | Acción, footer, enlaces y superficies de alto énfasis | Texto blanco.                      |
| `secondary` cian     | Acentos y superficies suaves                          | Texto azul oscuro.                 |
| `background` claro   | Fondo de aplicación y tarjetas                        | Texto azul oscuro.                 |
| `divider` azul claro | Bordes y separación                                   | Nunca es la única señal de estado. |

## Footer

| Elemento             | Contrato                                                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Enlace de autor      | Texto exacto `Made with love by Christofer Enríquez ❤️`; `href="https://khrizenriquez.github.io/khrizenriquez/"`; abre de forma segura. |
| Enlace ONG           | Conserva `https://masgenerosidad.org/` y apertura segura.                                                                               |
| Elementos eliminados | No contiene `BrandMark` ni el texto anterior de privacidad.                                                                             |

## Tarjeta pública

| Estado                           | Contrato                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| Inicial con movimiento permitido | Visible tras entrar al viewport; comienza con opacidad y desplazamiento decorativos.             |
| Hover/foco                       | La imagen existente recibe `scale(1.2)` dentro del marco recortado; tarjeta y layout no escalan. |
| Sin imagen                       | Placeholder sin zoom de imagen inexistente.                                                      |
| Reducir movimiento               | Sin observación, reveal, transición o transformación decorativa.                                 |
