# Multi-Tenancy Architecture — LegalForge

> **Version:** 1.0.0-draft
> **Date:** 2026-06-30

---

## 1. Strategy

LegalForge uses **single-database, row-level multi-tenancy**. All law firm tenants share the same Cloudflare D1 database instance, with every tenant-scoped table containing a `tenant_id` column that enforces data isolation at the application layer.

This approach is chosen over separate-database-per-tenant because:

- Cloudflare D1 doesn't support dynamic database provisioning.
- Simpler schema migrations (one schema for all tenants).
- Cost-effective at the scale of 20–100 tenants.

---

## 2. Tenant Identifier

- Each tenant has a UUID `id` (primary key) and a URL-friendly `slug` (e.g., `smith-partners`).
- The `slug` drives subdomain routing.

---

## 3. Subdomain Routing

**Production:**

```
smith-partners.legalforge.co.za  →  slug: "smith-partners"
louw-attorneys.legalforge.co.za  →  slug: "louw-attorneys"
app.legalforge.co.za             →  No tenant (platform admin login only)
```

**Development (localhost):**
Path-prefix fallback: `localhost:5173/t/smith-partners/...`

**DNS:** Cloudflare wildcard CNAME: `*.legalforge.co.za → legalforge.co.za` (handled at CF edge).

**Wrangler local dev:**
Use the `--host` flag or test with custom host headers:

```bash
curl -H "Host: smith-partners.legalforge.co.za" http://localhost:8787/
```

---

## 4. Tenant Resolution in hooks.server.ts

```typescript
// src/hooks.server.ts
import { db } from '$lib/server/db';
import { tenants } from '$lib/server/db/schema/tenants.schema';
import { eq } from 'drizzle-orm';

const PLATFORM_HOSTS = ['app', 'www', 'admin', 'localhost'];

export async function handle({ event, resolve }) {
	const host = event.request.headers.get('host') ?? '';
	const subdomain = host.split('.')[0];

	// Resolve tenant from subdomain
	if (!PLATFORM_HOSTS.includes(subdomain)) {
		const tenant = await db.query.tenants.findFirst({
			where: eq(tenants.slug, subdomain)
		});

		if (!tenant || !tenant.isActive) {
			// Tenant not found or suspended
			return new Response('Tenant not found', { status: 404 });
		}

		event.locals.tenant = tenant;
	} else {
		event.locals.tenant = null; // Platform-level access
	}

	// Auth session (Better Auth)
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.user = session?.user ?? null;
	event.locals.session = session?.session ?? null;

	// Tenant-user scope enforcement
	if (event.locals.user && event.locals.tenant) {
		if (
			event.locals.user.role !== 'platform_admin' &&
			event.locals.user.tenantId !== event.locals.tenant.id
		) {
			// User belongs to a different tenant — deny access
			return new Response('Forbidden', { status: 403 });
		}
	}

	return resolve(event);
}
```

---

## 5. Database Query Guard Pattern

Every Drizzle query touching tenant-scoped data **must** include a `tenant_id` filter. To enforce this, use a typed DB wrapper:

```typescript
// src/lib/server/db/tenant-db.ts
import { db } from './index';
import type { Tenant } from './schema/tenants.schema';

/**
 * Returns a DB helper pre-scoped to a tenant.
 * All queries through this helper automatically include tenant_id in WHERE clauses.
 */
export function tenantDb(tenant: Tenant) {
	return {
		async getTemplates() {
			return db.query.contractTemplates.findMany({
				where: eq(contractTemplates.tenantId, tenant.id)
			});
		},
		async getContracts(userId: string) {
			return db.query.contracts.findMany({
				where: and(eq(contracts.tenantId, tenant.id), eq(contracts.userId, userId))
			});
		}
		// ... all tenant-scoped operations
	};
}
```

Usage in route handlers:

```typescript
// src/routes/(app)/contracts/+page.server.ts
export async function load({ locals }) {
	const tdb = tenantDb(locals.tenant!);
	const userContracts = await tdb.getContracts(locals.user!.id);
	return { contracts: userContracts };
}
```

---

## 6. Tenant-Scoped Tables

The following tables have `tenant_id` as a foreign key and **must always be queried with a tenant filter**:

| Table                | Tenant Column |
| -------------------- | ------------- |
| `users`              | `tenant_id`   |
| `contract_templates` | `tenant_id`   |
| `clauses`            | `tenant_id`   |
| `contracts`          | `tenant_id`   |
| `audit_log`          | `tenant_id`   |

**NOT tenant-scoped** (shared across platform):

- `sessions`
- `accounts`
- `verifications`
- `tenants` (obviously — it IS the tenant table)

---

## 7. Platform Admin Access

Platform admins (`role = 'platform_admin'`) bypass the tenant-user scope check in `hooks.server.ts`. However, they still access data through explicit tenant ID parameters when impersonating:

```typescript
// Platform admin viewing tenant's data
const tenant = await db.query.tenants.findFirst({ where: eq(tenants.id, params.tenantId) });
const tdb = tenantDb(tenant!);
```

**Impersonation sessions** set a secondary `impersonatedTenantId` in the session metadata, which is audited on every request.

---

## 8. Data Isolation Audit

Security review checklist for each new feature:

- [ ] Does this route access any tenant-scoped table?
- [ ] Is `tenant_id` included in every `WHERE` clause?
- [ ] Is the user's `tenantId` verified against `locals.tenant.id`?
- [ ] Are file storage paths prefixed with `/{tenantId}/`?
- [ ] Are generated PDF file names namespaced by tenant?

---

## 9. File Storage Isolation (Cloudflare R2)

All files in R2 are stored under a tenant-namespaced path:

```
/{tenantId}/contracts/{contractId}/contract.pdf
/{tenantId}/assets/logo.png
/{tenantId}/templates/{templateId}/cover.jpg
```

Signed URL generation always validates that the requesting user belongs to the tenant before generating the URL.

---

## 10. Branding Isolation

Each tenant can configure:

- `logo_url` → logo displayed in the app and on PDF letterhead
- `primary_colour` → used for Tailwind CSS variable injection at runtime
- `firm_name` → displayed in UI, PDF headers, and email subjects

Runtime CSS variable injection (in the root layout):

```svelte
<!-- src/routes/(app)/+layout.svelte -->
<script>
  const { tenant } = $props();
</script>
<svelte:head>
  <style>
    :root {
      --color-tenant-primary: {tenant?.primaryColour ?? '#4F7FFF'};
    }
  </style>
</svelte:head>
```
