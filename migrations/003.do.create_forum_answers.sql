CREATE TABLE forum_answers (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    question_id INTEGER
        REFERENCES forum_questions(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES forum_users(id) ON DELETE CASCADE NOT NULL
);