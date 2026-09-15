# Constitución de Historias de Más Generosidad

## I. Privacidad antes que conveniencia

Ningún dato real vive en Git. La fecha de nacimiento, las notas de importación y los estados no públicos nunca forman parte del contrato anónimo. Toda nueva exposición de datos requiere una prueba negativa que demuestre qué queda oculto.

## II. Publicación deliberada

Un perfil nace como borrador. Solo una acción administrativa explícita puede publicarlo y PostgreSQL debe rechazar publicaciones incompletas. El consentimiento se confirma mediante el proceso externo de la ONG antes de esa acción.

## III. Seguridad por capas

La interfaz no es un control de seguridad. RLS, privilegios SQL, allowlist administrativa, bucket privado y URLs firmadas siguen siendo obligatorios aunque la UI o un cliente sea alterado.

## IV. Presupuesto cero y portabilidad

El MVP usa únicamente niveles gratuitos y estándares portables: React estático, PostgreSQL y WebP. Ninguna dependencia nueva puede exigir pago, fijar los datos a un formato propietario o impedir una migración futura razonable.

## V. Calidad verificable

Todo cambio debe pasar `npm run verify`. Los cambios de datos requieren `npm run db:test`; los flujos críticos visibles requieren Playwright móvil y escritorio. Los fixtures siempre son ficticios.

## VI. Accesibilidad y dignidad

La experiencia es móvil primero, navegable por teclado y WCAG AA. El lenguaje y la presentación muestran a cada persona con dignidad, sin sensacionalismo, etiquetas reductoras ni exposición innecesaria.

## VII. Integración mediante revisión humana

`main` es la única rama principal y debe permanecer estable. Cada cambio se desarrolla en una rama corta y se entrega mediante un Pull Request hacia `main`. Los agentes nunca hacen commits o pushes directos a `main`, no aprueban ni fusionan PRs y no activan auto-merge; `@khrizenriquez` revisa, aprueba y fusiona. Ningún agente añade trailers `Co-authored-by`, altera la identidad Git configurada o se presenta como coautor.

**Versión**: 1.1.0 · **Ratificada**: 2026-09-14 · **Enmendada**: 2026-09-15
