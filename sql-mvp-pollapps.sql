-- ==========================================================
-- 1. MEMBERSIHKAN SKEMA (DENGAN URUTAN YANG BENAR)
-- ==========================================================
-- Menghapus tabel dengan CASCADE otomatis menghapus trigger & fungsi yang menempel
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS polls CASCADE;

-- Hapus fungsi secara manual jika diperlukan
DROP FUNCTION IF EXISTS increment_vote CASCADE;
DROP FUNCTION IF EXISTS decrement_vote CASCADE;

-- ==========================================================
-- 2. MEMBUAT TABEL BARU
-- ==========================================================

-- Pastikan extension untuk UUID sudah aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  admin_credential TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  votes_count INT DEFAULT 0
);

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES options(id) ON DELETE CASCADE,
  voter_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- 3. LOGIC & TRIGGERS
-- ==========================================================

CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_options_poll_id ON options(poll_id);

CREATE OR REPLACE FUNCTION increment_vote()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE options SET votes_count = votes_count + 1 WHERE id = NEW.option_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_vote()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE options SET votes_count = votes_count - 1 WHERE id = OLD.option_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger dipasang SETELAH tabel votes dibuat
CREATE TRIGGER tr_increment_vote AFTER INSERT ON votes FOR EACH ROW EXECUTE FUNCTION increment_vote();
CREATE TRIGGER tr_decrement_vote AFTER DELETE ON votes FOR EACH ROW EXECUTE FUNCTION decrement_vote();