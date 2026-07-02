import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const tenants = sqliteTable('tenants', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(), // subdomain
	logoUrl: text('logo_url'),
	primaryColour: text('primary_colour'),
	contactEmail: text('contact_email'),
	contactPhone: text('contact_phone'),
	address: text('address'),
	plan: text('plan').notNull().default('starter'), // starter | professional | enterprise
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull()
});
