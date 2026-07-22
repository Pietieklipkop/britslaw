# LegalForge Documentation Hub

Welcome to the LegalForge project documentation. This folder contains all reference documents for the development, design, architecture, and user guidance of the LegalForge platform.

---

## 📁 Document Index

| Document                                      | Purpose                                                        |
| --------------------------------------------- | -------------------------------------------------------------- |
| [SPECIFICATION.md](../SPECIFICATION.md)       | Full product specification: features, roles, NFRs, scope       |
| [DEVELOPMENT_PLAN.md](../DEVELOPMENT_PLAN.md) | Tech stack, architecture, phased delivery plan, API design     |
| [DESIGN.md](../DESIGN.md)                     | Visual design system, colour palette, typography, components   |
| [ERD.md](../ERD.md)                           | Entity relationship diagram, table definitions, query patterns |
| [stitch-prompts/](../stitch-prompts/)         | UI design prompts for each major screen                        |

---

## 📁 Stitch Prompts (UI Design)

| Prompt                                                                       | Screen                                       |
| ---------------------------------------------------------------------------- | -------------------------------------------- |
| [01-landing-page.md](../stitch-prompts/01-landing-page.md)                   | Public marketing landing page                |
| [02-auth-screens.md](../stitch-prompts/02-auth-screens.md)                   | Login, register, magic link, forgot password |
| [03-end-user-dashboard.md](../stitch-prompts/03-end-user-dashboard.md)       | Client dashboard, template selection         |
| [04-contract-wizard.md](../stitch-prompts/04-contract-wizard.md)             | Full guided contract building wizard         |
| [05-firm-admin-dashboard.md](../stitch-prompts/05-firm-admin-dashboard.md)   | Law firm admin home dashboard                |
| [06-template-builder.md](../stitch-prompts/06-template-builder.md)           | Template & clause editor for firm admins     |
| [07-conflict-rule-manager.md](../stitch-prompts/07-conflict-rule-manager.md) | Conflict rule authoring tool                 |
| [08-platform-admin.md](../stitch-prompts/08-platform-admin.md)               | Super admin platform console                 |

---

## 🗂️ Sub-documents in this folder

| Document                                                   | Purpose                                             |
| ---------------------------------------------------------- | --------------------------------------------------- |
| [USER_FLOWS.md](./USER_FLOWS.md)                           | Step-by-step user journey flows for each role       |
| [CONTRACT_TEMPLATES.md](./CONTRACT_TEMPLATES.md)           | Template definitions for initial contract types     |
| [MERGE_FIELD_REFERENCE.md](./MERGE_FIELD_REFERENCE.md)     | Complete merge field token reference                |
| [CONFLICT_DETECTION_SPEC.md](./CONFLICT_DETECTION_SPEC.md) | Technical spec for the conflict detection engine    |
| [PDF_GENERATION_SPEC.md](./PDF_GENERATION_SPEC.md)         | PDF generation service technical specification      |
| [MULTI_TENANCY.md](./MULTI_TENANCY.md)                     | Multi-tenancy architecture and data isolation       |
| [AUTH_ROLES.md](./AUTH_ROLES.md)                           | Role definitions, permissions matrix, and auth flow |

---

## 🔗 Quick Links

- **Tech stack:** SvelteKit + Cloudflare Workers + D1 + Drizzle + Better Auth
- **Toolchain:** Vite+ (`vp` CLI)
- **Target market:** South African law firms (expandable)
- **Primary auth:** Email/password + Magic Link (Better Auth)
- **PDF storage:** Cloudflare R2
- **Email:** Cloudflare Email Routing / Mail
