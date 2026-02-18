# arq-manager — Instrucciones para Claude

## Skills disponibles en este proyecto

Este proyecto tiene skills en `.agents/skills/`. Lee el archivo `SKILL.md` correspondiente **antes** de ejecutar cualquier tarea relacionada.

### Cuándo usar cada skill

| Tarea | Skill a leer |
|---|---
| Crear, editar o refactorizar componentes React | `.agents/skills/react-best-practices/SKILL.md` |
| Revisar patrones de composición, evitar props booleanas, compound components | `.agents/skills/composition-patterns/SKILL.md` |
| Revisar UI, accesibilidad, performance visual, UX | `.agents/skills/web-design-guidelines/SKILL.md` |

### Instrucciones generales

- **Siempre** lee el `SKILL.md` relevante antes de generar, revisar o refactorizar código.
- Si la tarea involucra componentes React, consulta tanto `react-best-practices` como `composition-patterns`.
- Si la tarea involucra diseño o revisión de interfaz, consulta `web-design-guidelines`.
- No uses props booleanas para variantes de componentes — aplica los patrones de composición de la skill.
- Prioriza performance: evita renders innecesarios, usa lazy loading cuando aplique.

## Estructura del proyecto

- Skills: `.agents/skills/`
- Sigue las convenciones de TypeScript estricto.
- Preferir `children` sobre `renderX` props para composición.
