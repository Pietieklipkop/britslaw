import { defineConfig } from 'drizzle-kit';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || 'dummy';
const databaseId = process.env.CLOUDFLARE_DATABASE_ID || 'dummy';
const token = process.env.CLOUDFLARE_D1_TOKEN || 'dummy';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	driver: 'd1-http',
	dbCredentials: {
		accountId,
		databaseId,
		token
	},
	verbose: true,
	strict: true
});
