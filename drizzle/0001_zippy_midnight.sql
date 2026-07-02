CREATE TABLE `tenants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`logo_url` text,
	`primary_colour` text,
	`contact_email` text,
	`contact_phone` text,
	`address` text,
	`plan` text DEFAULT 'starter' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_slug_unique` ON `tenants` (`slug`);--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'end_user' NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `tenant_id` text;