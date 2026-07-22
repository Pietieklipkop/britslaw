import type { User, Session } from 'better-auth';
import { createAuth } from '$lib/server/auth';
import type { D1Database, R2Bucket, SendEmail } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
				STORAGE?: R2Bucket;
				SEND_EMAIL?: SendEmail;
			};
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		interface Locals {
			user?: User;
			session?: Session;
			auth: ReturnType<typeof createAuth>;
			tenant?: {
				id: string;
				name: string;
				slug: string;
				logoUrl: string | null;
				primaryColour: string | null;
				isActive: boolean;
			} | null;
		}
	}
}

export {};
