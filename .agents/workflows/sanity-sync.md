---
description: Sincronización de esquemas de Sanity CMS y regeneración de tipos TypeScript.
---

# Sincronización de Sanity CMS

Este workflow permite mantener los tipos de TypeScript del proyecto sincronizados con el esquema actual de Sanity Cloud.

## Procedimiento de Sincronización

1. **Desplegar Esquema** (si hay cambios locales):
   ```bash
   cd sanity && npx sanity deploy
   ```

2. **Generar Tipos**:
   Ejecuta el generador de tipos desde la raíz del proyecto para actualizar `src/types/index.ts`:
   ```bash
   npm run sanity:typegen
   ```
   *Nota: Asegúrate de que el comando esté definido en el package.json de la raíz o usa `cd sanity && npx sanity typegen`.*

3. **Verificación**:
   Ejecuta el chequeo de tipos para asegurar que no hay breaking changes:
   ```bash
   npm run type-check
   ```

## Cuándo usar este workflow
- Después de modificar cualquier archivo en `sanity/schemaTypes/`.
- Antes de realizar cambios importantes en los componentes que consumen datos de Sanity.
- Al detectar errores de "undefined" o propiedades faltantes en las interfaces de contenido.

> [!IMPORTANT]
> Mantener los tipos sincronizados es crítico para la integridad del portafolio, especialmente en las secciones animadas que dependen de la estructura exacta de los datos.
