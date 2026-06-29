-- src/lib/server/db/seed.sql

-- Insert Users
INSERT OR IGNORE INTO user (id, name, email, email_verified, created_at, updated_at)
VALUES 
  ('admin-001', 'Admin User', 'admin@britslaw.com', 1, (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer))),
  ('user-001', 'Standard User', 'user@britslaw', 1, (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer)));

-- Insert Accounts (Credentials for Login)
INSERT OR IGNORE INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
VALUES 
  ('acc-admin', 'admin@britslaw.com', 'credential', 'admin-001', '0d5ffb63d6376450c43b057cc2ac18b0:5c53b52f80b677ff9c7d3fbc409823cfb28e0dd7fa225d7ec143e367b6eabb69af795ee8a4b9243760d0fb1d8d5cce97b753f0f3d10b5a686867d89d02714277', (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer))),
  ('acc-user', 'user@britslaw', 'credential', 'user-001', '0d5ffb63d6376450c43b057cc2ac18b0:5c53b52f80b677ff9c7d3fbc409823cfb28e0dd7fa225d7ec143e367b6eabb69af795ee8a4b9243760d0fb1d8d5cce97b753f0f3d10b5a686867d89d02714277', (cast(unixepoch('subsecond') * 1000 as integer)), (cast(unixepoch('subsecond') * 1000 as integer)));
