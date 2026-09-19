# Roboto y footer móvil

## Decisión aprobada

La interfaz carga Roboto desde Google Fonts mediante `preconnect` y la hoja de estilos oficial compartida. Roboto sustituye las familias no cargadas anteriormente en texto, controles, encabezados y marca tipográfica, con las alternativas sans-serif del sistema como respaldo.

El crédito del footer muestra exactamente `Made with ❤️ by Christofer Enríquez` y conserva su enlace personal. El enlace de Más Generosidad permanece separado visualmente y mantiene su destino actual.

## Comportamiento móvil primero

El footer usa una columna centrada en pantallas estrechas y, desde el breakpoint pequeño, una fila centrada con separador. Así se evita que los enlaces compitan por ancho, se conserva un objetivo táctil claro y no se generan cortes u overflow. El header continúa ocultando su CTA secundaria en móvil.

## Alternativas descartadas

- Conservar Fraunces/Manrope sin cargar: crea una dependencia implícita del sistema y una apariencia inconsistente.
- Añadir Roboto junto a dos familias adicionales: aumenta peticiones y no aporta valor al MVP.
- Mantener el footer siempre en fila: puede dividir el crédito de manera incómoda en pantallas pequeñas.

## Verificación

Las pruebas de navegador comprueban el nombre y enlace del crédito en móvil y escritorio, el orden vertical móvil, la tipografía declarada y que los enlaces se mantienen navegables por teclado. La batería existente conserva las comprobaciones de contraste, rutas, privacidad y movimiento reducido.
