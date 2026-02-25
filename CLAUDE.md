# arq-manager — Instructions for Claude

## Available Skills in this Project

This project has skills in `.agents/skills/`. Read the corresponding `SKILL.md` file **before** executing any related task.

### When to use each skill

| Task | Skill to read |
|---|---|
| Create, edit or refactor React components | `.agents/skills/react-best-practices/SKILL.md` |
| Review composition patterns, avoid boolean props, compound components | `.agents/skills/composition-patterns/SKILL.md` |
| Review UI, accessibility, visual performance, UX | `.agents/skills/web-design-guidelines/SKILL.md` |

### General instructions

- **Always** read the relevant `SKILL.md` before generating, reviewing or refactoring code.
- If the task involves React components, consult both `react-best-practices` and `composition-patterns`.
- If the task involves design or interface review, consult `web-design-guidelines`.
- Do not use boolean props for component variants — apply the composition patterns from the skill.
- Prioritize performance: avoid unnecessary renders, use lazy loading when applicable.

## Project structure

- Skills: `.agents/skills/`
- Follow strict TypeScript conventions.
- Prefer `children` over `renderX` props for composition.
