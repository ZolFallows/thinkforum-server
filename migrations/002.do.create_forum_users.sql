CREATE TABLE forum_users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  title TEXT,
  location TEXT,
  content TEXT,
  date_created TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE forum_questions
  ADD COLUMN
    user_id INTEGER REFERENCES forum_users(id)
    ON DELETE SET NULL;
