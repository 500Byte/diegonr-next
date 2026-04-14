---
description: Sincronización de variables de entorno (.env) con secretos de Cloudflare Workers (Wrangler).
---

# Sincronización de Secretos con Wrangler

Este workflow permite subir las variables de entorno locales definidas en el archivo `.env` a los secretos de producción en Cloudflare Workers para el servicio `diegonr-next`.

## Requisitos Previos

- Tener un archivo `.env` en la raíz con las variables necesarias.
- Haber iniciado sesión en Cloudflare: `npx wrangler login`.

## Procedimiento de Sincronización

Sigue estos pasos para sincronizar de forma segura sin exponer los valores en los logs:

// turbo-all
1. Ejecuta el siguiente bucle en la terminal para cada variable:
   ```bash
   grep -v '^#' .env | grep -v '^[[:space:]]*$' | while IFS='=' read -r key value; do
       # Limpiar espacios
       key=$(echo "$key" | xargs)
       value=$(echo "$value" | xargs)
       
       if [ -n "$key" ] && [ -n "$value" ]; then
           echo "Sincronizando $key..."
           echo -n "$value" | npx wrangler secret put "$key" --name diegonr-next
       fi
   done
   ```

## Cuándo usar este workflow

- Después de añadir nuevas variables de Sanity, GitHub o EmailJS.
- Al cambiar el `REPOSITORY_NAME` o los tokens de acceso.
- Antes de realizar un `npx wrangler deploy` si hay cambios en la configuración.

> [!IMPORTANT]
> Los secretos de Cloudflare Workers se aplican a nivel de servicio. Asegúrate de que el nombre `--name diegonr-next` coincida con el definido en `wrangler.jsonc`.
