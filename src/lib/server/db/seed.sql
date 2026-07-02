-- src/lib/server/db/seed.sql

-- Insert Tenants
INSERT OR IGNORE INTO tenants (id, name, slug, logo_url, primary_colour, contact_email, contact_phone, address, plan, is_active, created_at, updated_at)
VALUES 
  ('tenant-smith', 'Smith & Partners Attorneys', 'smith-partners', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5bhzW1vhe3zy457ZwBTb55us06cyApcS846iA0f9B3iRgG0wxSgm5CAuFyuhwfc6GK2UbCh2ROL0JAsejrTdmFulmQeiak17ec9YSgwxBiLvy4pMDvBkFdJcvt9jOs2D5k7-XfYwnOhzh2TMXgiBoxQaofPo1XmoJe7sdKzDWvLONvandVMSbQgca0e4bZ5KPmhQPg2IDlqBBSARvLKCJoy_9m_OG-wZm73ckRyxEPkwvhvkyGUkGIJ2V_JSY0llBJwlR0un8J_U', '#5B6CF9', 'info@smithandpartners.co.za', '+27 21 555 0100', '10 Legal Street, Cape Town', 'professional', 1, (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer)));

-- Insert Users
-- Roles: platform_admin | firm_admin | firm_editor | end_user
INSERT OR IGNORE INTO user (id, name, email, email_verified, role, tenant_id, created_at, updated_at)
VALUES 
  ('superadmin-001', 'Platform Super Admin', 'superadmin@legalforge.co.za', 1, 'platform_admin', NULL, (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer))),
  ('firmadmin-001', 'Smith Admin', 'firm_admin@test.com', 1, 'firm_admin', 'tenant-smith', (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer))),
  ('client-001', 'Test Client', 'client@test.com', 1, 'end_user', 'tenant-smith', (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer)));

-- Insert Accounts (Credentials for Login)
-- The password is "password" hashed with Better Auth default credential hashing structure:
-- "pbkdf2:5c53b52f80b677ff9c7d3fbc409823cfb28e0dd7fa225d7ec143e367b6eabb69af795ee8a4b9243760d0fb1d8d5cce97b753f0f3d10b5a686867d89d02714277" 
INSERT OR IGNORE INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
VALUES 
  ('acc-super', 'superadmin@legalforge.co.za', 'credential', 'superadmin-001', '0d5ffb63d6376450c43b057cc2ac18b0:5c53b52f80b677ff9c7d3fbc409823cfb28e0dd7fa225d7ec143e367b6eabb69af795ee8a4b9243760d0fb1d8d5cce97b753f0f3d10b5a686867d89d02714277', (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer))),
  ('acc-firm', 'firm_admin@test.com', 'credential', 'firmadmin-001', '0d5ffb63d6376450c43b057cc2ac18b0:5c53b52f80b677ff9c7d3fbc409823cfb28e0dd7fa225d7ec143e367b6eabb69af795ee8a4b9243760d0fb1d8d5cce97b753f0f3d10b5a686867d89d02714277', (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer))),
  ('acc-client', 'client@test.com', 'credential', 'client-001', '0d5ffb63d6376450c43b057cc2ac18b0:5c53b52f80b677ff9c7d3fbc409823cfb28e0dd7fa225d7ec143e367b6eabb69af795ee8a4b9243760d0fb1d8d5cce97b753f0f3d10b5a686867d89d02714277', (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer)));

