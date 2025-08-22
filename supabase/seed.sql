-- Seed data for development

-- Insert test user_subscriptions (needed for wholesaler foreign key)
INSERT INTO user_subscriptions (id, email, name, plan_name, has_access)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test User', 'FREE', true)
ON CONFLICT (email) DO NOTHING;

-- Insert test wholesaler (keeping only this entry)
INSERT INTO wholesaler (first_name, last_name, email, user_id, alias, email_authorized)
VALUES
  ('John', 'Doe', 'john@example.com', '00000000-0000-0000-0000-000000000001', 'johndoe', true)
ON CONFLICT (user_id) DO NOTHING;
