---
trigger: model_decision
description: Documenta la dependencia obligatoria de las skills de diseño y auditoría en el comando /impeccable.
---

# Regla: Dependencia de Impeccable

Muchas de las skills instaladas (`audit`, `polish`, `clarify`, `animate`, `adapt`, `critique`, `optimize`) tienen una **preparación obligatoria** que requiere invocar `/impeccable`.

## Instrucciones Críticas

- **Antes de usar una skill de diseño**: Debes invocar `/impeccable`.
- **Propósito**: `/impeccable` proporciona los principios de diseño, anti-patrones y el Protocolo de Recolección de Contexto necesarios para que las demás skills funcionen con precisión.
- **Falta de Contexto**: Si no hay contexto de diseño previo, debes ejecutar `/impeccable teach` primero para alimentar al sistema con las bases visuales del proyecto.

## Skills Afectadas
- `audit`: Para reportes de calidad técnica.
- `polish`: Para refinamiento final de UI.
- `clarify`: Para mejora de UX copy.
- `animate`: Para añadir micro-interacciones.
- `adapt`: Para diseño responsivo.
- `critique`: Para evaluación de UX.
- `optimize`: Para rendimiento visual.

> [!NOTE]
> Estas skills provienen del ecosistema `pbakaus/impeccable` y están diseñadas para trabajar en conjunto. No omitas la fase de preparación o los resultados serán genéricos.