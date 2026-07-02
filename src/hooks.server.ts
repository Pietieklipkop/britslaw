import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { createAuth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { getDb } from '$lib/server/db';
import { tenants } from '$lib/server/db/tenants.schema';
import { eq } from 'drizzle-orm';

// Public routes that do not require the Cloudflare D1 DB binding or auth checks
const PUBLIC_ROUTES = [
	'/stylesheet',
	'/login',
	'/register',
	'/forgot-password',
	'/magic-link-sent'
];
const PLATFORM_HOSTS = ['app', 'www', 'admin', 'localhost', '127'];

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/stylesheet')) {
		return resolve(event);
	}

	const isPublicRoute = PUBLIC_ROUTES.some((route) => event.url.pathname.startsWith(route));
	if (isPublicRoute && !event.platform?.env?.DB) {
		return resolve(event);
	}

	if (!event.platform?.env?.DB) {
		throw new Error('D1 binding "DB" not found - are you running with wrangler?');
	}

	const db = getDb(event.platform.env.DB);
	event.locals.auth = createAuth(event.platform.env.DB);

	// 1. Resolve Tenant from Hostname
	const host = event.request.headers.get('host') ?? '';
	const subdomain = host.split('.')[0];

	if (subdomain && !PLATFORM_HOSTS.includes(subdomain)) {
		const tenant = await db.query.tenants.findFirst({
			where: eq(tenants.slug, subdomain)
		});

		if (!tenant || !tenant.isActive) {
			return new Response('Tenant not found or inactive', { status: 404 });
		}

		event.locals.tenant = tenant;
	} else {
		event.locals.tenant = null;
	}

	// 2. Resolve Better Auth Session
	const { auth } = event.locals;
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	// 3. User-Tenant Scope Enforcement
	if (event.locals.user && event.locals.tenant) {
		const user = event.locals.user as typeof event.locals.user & {
			role?: string;
			tenantId?: string;
		};
		if (user.role !== 'platform_admin' && user.tenantId !== event.locals.tenant.id) {
			return new Response('Forbidden: Tenant Mismatch', { status: 403 });
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
