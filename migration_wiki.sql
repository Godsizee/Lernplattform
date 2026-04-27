-- Migration: Wiki-Feature hinzufügen
-- Ausführen auf bestehender Datenbank

-- Neue Spalten für die Wiki-Funktionalität
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS author_id INT DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS content_raw TEXT DEFAULT '';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Constraint für Status-Werte (nur wenn noch nicht vorhanden)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'lessons_status_check'
    ) THEN
        ALTER TABLE lessons ADD CONSTRAINT lessons_status_check CHECK (status IN ('draft', 'published'));
    END IF;
END $$;
