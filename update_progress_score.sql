-- update_progress_score.sql
ALTER TABLE user_progress ADD COLUMN IF NOT EXISTS score INT DEFAULT NULL;
