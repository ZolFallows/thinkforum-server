ALTER TABLE forum_questions
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS forum_users;