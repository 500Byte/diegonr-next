---
trigger: when_modifying_env
glob: .env
description: Asegura que los cambios en .env se sincronicen con Cloudflare Workers.
---

# Regla: Sincronización de Secretos

Cada vez que se modifique el archivo `.env` o se añadan nuevas variables que deban estar disponibles en producción (Cloudflare), DEBES informar al usuario o ejecutar el workflow de sincronización.

## Puntos de Control

- **Verificación**: Comprueba si las nuevas variables en `.env` coinciden con las configuradas en el entorno de producción de Cloudflare.
- **Workflow Relacionado**: Utiliza `/.agents/workflows/cloudflare-sync.md` para realizar la sincronización.
- **Seguridad**: NUNCA intentes sincronizar si no tienes la certeza de que el usuario está logueado en Wrangler.

> [!WARNING]
> Olvidar sincronizar el `.env` con los secretos del Worker causará que la aplicación falle en producción debido a variables de entorno `undefined` (ej: Prismic docs no cargando).
