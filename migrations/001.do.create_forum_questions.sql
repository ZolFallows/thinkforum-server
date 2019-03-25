CREATE TABLE forum_questions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  date_created TIMESTAMP DEFAULT now() NOT NULL
);

