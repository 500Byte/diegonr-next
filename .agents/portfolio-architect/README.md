# Portfolio Next.js Architect

## Descripción
Este agente es el orquestador principal y experto de la base de código del portafolio. Conoce todas las convenciones arquitecturales establecidas en `AGENTS.md` y `GEMINI.md`, incluyendo Server/Client components, animaciones con GSAP, headless CMS con Sanity, y despliegue usando Cloudflare Workers.

## Casos de Uso
1. **Crear nuevas secciones**: El agente sabe colocarlas correctamenta bajo los directorios `_sections` locales.
2. **Animaciones**: Asiste usando `useGSAP` y `useRef` sin corromper el contexto global de Next.js.
3. **Refactorización**: Aplica las reglas contra "anti-patrones" (ej. no extraer arreglos pequeños a archivos separados).

## Uso con Gemini CLI
```bash
gemini -e portfolio-architect -p "Crea una nueva sección llamada Testimonials en el home page usando mis estilos base."
```

## Dependencias o sub-agentes
Actualmente, este es el agente principal para el portfolio Next.js. Si necesitas delegar sincronización de secretos a Cloudflare, te basarás en los scripts o procesos del workflow `cloudflare-sync.md`.
