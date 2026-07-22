# Auth Roles & Permissions — LegalForge

> **Version:** 1.0.0-draft
> **Date:** 2026-06-30

---

## 1. Role Definitions

| Role               | Identifier       | Scope  | Description                                                          |
| ------------------ | ---------------- | ------ | -------------------------------------------------------------------- |
| **Platform Admin** | `platform_admin` | Global | LegalForge internal team. Full access.                               |
| **Firm Admin**     | `firm_admin`     | Tenant | Law firm owner/principal. Full tenant access.                        |
| **Firm Editor**    | `firm_editor`    | Tenant | Paralegal / junior. Can create/edit but not publish or manage users. |
| **End User**       | `end_user`       | Tenant | Law firm client. Can build contracts only.                           |

---

## 2. Permissions Matrix

| Permission                  | Platform Admin | Firm Admin | Firm Editor | End User |
| --------------------------- | -------------- | ---------- | ----------- | -------- |
| **Platform**                |                |            |             |          |
| View all tenants            | ✅             | ❌         | ❌          | ❌       |
| Create/edit tenants         | ✅             | ❌         | ❌          | ❌       |
| Suspend/delete tenants      | ✅             | ❌         | ❌          | ❌       |
| View platform analytics     | ✅             | ❌         | ❌          | ❌       |
| Impersonate tenants         | ✅             | ❌         | ❌          | ❌       |
| Manage feature flags        | ✅             | ❌         | ❌          | ❌       |
| View audit log (global)     | ✅             | ❌         | ❌          | ❌       |
| **Tenant — Templates**      |                |            |             |          |
| View own tenant's templates | ✅             | ✅         | ✅          | ❌       |
| Create templates            | ✅             | ✅         | ✅          | ❌       |
| Edit draft templates        | ✅             | ✅         | ✅          | ❌       |
| Publish templates           | ✅             | ✅         | ❌          | ❌       |
| Archive/delete templates    | ✅             | ✅         | ❌          | ❌       |
| View published templates    | ✅             | ✅         | ✅          | ✅       |
| **Tenant — Clauses**        |                |            |             |          |
| Create/edit clauses         | ✅             | ✅         | ✅          | ❌       |
| Define conflict rules       | ✅             | ✅         | ✅          | ❌       |
| **Tenant — Clients**        |                |            |             |          |
| Invite clients              | ✅             | ✅         | ❌          | ❌       |
| View all clients            | ✅             | ✅         | ❌          | ❌       |
| Deactivate clients          | ✅             | ✅         | ❌          | ❌       |
| View client contracts       | ✅             | ✅         | ❌          | ❌       |
| **Tenant — Contracts**      |                |            |             |          |
| Create contracts (wizard)   | ❌             | ❌         | ❌          | ✅       |
| View own contracts          | ✅\*           | ✅\*       | ❌          | ✅       |
| Download own PDF            | ❌             | ❌         | ❌          | ✅       |
| View any contract in tenant | ✅             | ✅         | ❌          | ❌       |
| **Tenant — Settings**       |                |            |             |          |
| Edit firm branding          | ✅             | ✅         | ❌          | ❌       |
| Manage firm users           | ✅             | ✅         | ❌          | ❌       |
| View firm analytics         | ✅             | ✅         | ❌          | ❌       |
| **Own Account**             |                |            |             |          |
| Edit own profile            | ✅             | ✅         | ✅          | ✅       |
| Change own password         | ✅             | ✅         | ✅          | ✅       |

\*Platform Admin and Firm Admin can view contracts for oversight/support purposes.

---

## 3. Route Guards (SvelteKit)

Route-level access control is enforced in `+layout.server.ts` files at each route group level.

```typescript
// (app)/+layout.server.ts — End user guard
export async function load({ locals }) {
	const session = await locals.auth.getSession();
	if (!session) redirect(302, '/login');
	if (session.user.role === 'platform_admin' || session.user.role.startsWith('firm_')) {
		redirect(302, '/firm/dashboard'); // redirect admins to their own area
	}
	return { user: session.user };
}

// (firm)/+layout.server.ts — Firm admin/editor guard
export async function load({ locals }) {
	const session = await locals.auth.getSession();
	if (!session) redirect(302, '/login');
	if (!['firm_admin', 'firm_editor'].includes(session.user.role)) {
		redirect(302, '/dashboard');
	}
	return { user: session.user, tenantId: session.user.tenantId };
}

// (platform)/+layout.server.ts — Super admin guard
export async function load({ locals }) {
	const session = await locals.auth.getSession();
	if (!session || session.user.role !== 'platform_admin') {
		redirect(302, '/login');
	}
	return { user: session.user };
}
```

---

## 4. Tenant Resolution

On every request, the tenant is resolved from:

1. **Subdomain** (preferred): `smith-partners.legalforge.co.za` → `slug = 'smith-partners'`.
2. **Path prefix** (fallback for localhost/dev): `/t/smith-partners/...` → `slug = 'smith-partners'`.

The resolved tenant is attached to `locals.tenant` in `hooks.server.ts`.

```typescript
// hooks.server.ts
export async function handle({ event, resolve }) {
	// 1. Resolve tenant
	const host = event.request.headers.get('host') ?? '';
	const subdomain = host.split('.')[0];
	if (subdomain !== 'app' && subdomain !== 'www') {
		event.locals.tenant = await db.query.tenants.findFirst({
			where: eq(tenants.slug, subdomain)
		});
	}

	// 2. Auth session
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.user = session?.user ?? null;
	event.locals.session = session?.session ?? null;

	return resolve(event);
}
```

---

## 5. Better Auth Configuration

```typescript
// src/lib/server/auth.ts
export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true },
	emailVerification: { sendOnSignUp: true },
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 // refresh if older than 1 day
	},
	plugins: [
		// Custom role plugin
	],
	user: {
		additionalFields: {
			role: {
				type: 'string',
				defaultValue: 'end_user',
				required: true
			},
			tenantId: {
				type: 'string',
				required: false
			}
		}
	}
});
```

---

## 6. Invitation Flow

1. Firm Admin creates invitation → system generates a signed token (JWT, 72hr expiry).
2. Token is stored in `user_invitations` table with `email`, `tenant_id`, `role`, `expires_at`.
3. Email sent via Cloudflare Mail / Email Routing with a link: `https://{slug}.legalforge.co.za/register?token={token}`.
4. On registration page load, token is validated server-side.
5. On form submit, user record is created with the pre-determined `tenant_id` and `role`.
6. Invitation token is marked as used.
