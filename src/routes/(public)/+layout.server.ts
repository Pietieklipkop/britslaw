import { getDb } from '$lib/server/db';
import { tenants } from '$lib/server/db/tenants.schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

const PLATFORM_HOSTS = ['app', 'www', 'admin', 'localhost'];

export const load: LayoutServerLoad = async ({ platform, request }) => {
	if (!platform?.env?.DB) {
		return { tenant: null };
	}

	const db = getDb(platform.env.DB);

	// Resolve Tenant from Subdomain
	const host = request.headers.get('host') ?? '';
	const subdomain = host.split('.')[0];

	if (subdomain && !PLATFORM_HOSTS.includes(subdomain)) {
		const tenant = await db.query.tenants.findFirst({
			where: eq(tenants.slug, subdomain)
		});

		if (tenant && tenant.isActive) {
			// Convert Dates or DB types to serializable format for page data
			return {
				tenant: {
					id: tenant.id,
					name: tenant.name,
					slug: tenant.slug,
					logoUrl: tenant.logoUrl,
					primaryColour: tenant.primaryColour
				}
			};
		}
	}

	return { tenant: null };
};
