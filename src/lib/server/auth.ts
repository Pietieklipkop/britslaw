import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import type { D1Database } from '@cloudflare/workers-types';
import { getDb } from '$lib/server/db';

const parseBetterAuthUrl = (urlEnv: string | undefined) => {
	if (!urlEnv) return undefined;

	const urls = urlEnv
		.split(',')
		.map((u) => u.trim())
		.filter(Boolean);
	if (urls.length === 0) return undefined;

	const allowedHosts: string[] = [];
	const fallback = urls[0];

	for (const urlStr of urls) {
		let host = urlStr;
		if (host.includes('://')) {
			host = host.split('://')[1];
		}
		host = host.split('/')[0].split('?')[0];
		if (host) {
			allowedHosts.push(host);
		}
	}

	if (urls.length > 1 || allowedHosts.some((h) => h.includes('*'))) {
		return {
			allowedHosts,
			fallback,
			protocol: 'auto' as const
		};
	}

	return fallback;
};

const authConfig = {
	baseURL: parseBetterAuthUrl(env.BETTER_AUTH_URL) || 'http://localhost',
	secret:
		env.BETTER_AUTH_SECRET || 'a_very_long_dummy_secret_for_build_time_validation_placeholder',
	emailAndPassword: { enabled: true },
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
	},
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
} satisfies Omit<Parameters<typeof betterAuth>[0], 'database'>;

export const createAuth = (d1: D1Database) =>
	betterAuth({
		...authConfig,
		database: drizzleAdapter(getDb(d1), { provider: 'sqlite' })
	});

/**
 * DO NOT USE!
 *
 * This instance is used by the `better-auth` CLI for schema generation ONLY.
 * To access `auth` at runtime, use `event.locals.auth`.
 */
export const auth = createAuth(null!);
