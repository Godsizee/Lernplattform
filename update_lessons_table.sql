-- Spalte "type" hinzufügen
ALTER TABLE lessons 
ADD COLUMN type VARCHAR(20) DEFAULT 'article' CHECK (type IN ('article', 'quiz'));

-- Aktualisieren der existierenden Lektionen
UPDATE lessons SET type = 'article' WHERE type IS NULL;
