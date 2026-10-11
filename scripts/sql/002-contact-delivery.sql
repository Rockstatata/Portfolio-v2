ALTER TABLE messages ADD COLUMN IF NOT EXISTS delivery_status text NOT NULL DEFAULT 'pending';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS delivery_error text NOT NULL DEFAULT '';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS delivered_at timestamptz;
