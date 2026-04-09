# Coding Standards

## TypeScript
- Ensure proper typings for component props using interfaces or type aliases.
- Despite some disabled ESLint rules (`any`, `unused-vars`), strive for strict typing to maintain codebase health.
- Use `React.FC` or explicitly type `children: React.ReactNode` for layout and wrapper components.

## React Components
- **Client vs. Server**: Default to Server Components. Only add `"use client"` to the top of a file when you need interactivity, lifecycle hooks (`useEffect`, `useState`), or DOM manipulation (GSAP refs).
- **Exports**: Use named exports for all components and utility functions.
  ```typescript
  // Good
  export function MyComponent() { ... }
  
  // Avoid unless required by Next.js
  export default function MyComponent() { ... }
  ```

## Animations (GSAP)
- Always use the `@gsap/react` package's `useGSAP` hook instead of standard `useEffect` for animations to handle cleanup automatically.
- **Scoping**: Always provide a `scope` to `useGSAP` using a `useRef` pointing to the component's root element.
  ```typescript
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.to('.item', { opacity: 1 });
  }, { scope: containerRef });
  ```

## Styling (Tailwind)
- Use Tailwind classes for all styling. Avoid custom CSS files unless absolutely necessary (e.g., `src/index.css` for global resets).
- Combine dynamic classes using `clsx` and `tailwind-merge` (often abstracted into a `cn()` utility in `src/lib/utils.ts`).

## File Naming
- Page sections and complex components: `PascalCase.tsx`
- Small, reusable UI components: `kebab-case.tsx`
- Utility files and hooks: `camelCase.ts`
