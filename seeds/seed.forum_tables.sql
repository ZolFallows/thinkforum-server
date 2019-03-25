BEGIN;

TRUNCATE
  forum_answers,
  forum_questions,
  forum_users
  RESTART IDENTITY CASCADE;

INSERT INTO forum_users (user_name, full_name, password)
VALUES
  ('jones', 'John Jones', '$2a$10$Natlvnm84WWQxDRWwoZTxuftXsYsexzK5KdFs.T/2RYOMCa9Q/sF.'),
  ('b.deboop', 'Bodeep Deboop', '$2a$10$WJxMETI3CN3uNqzIq7/RO.S5sOuVbIqwaXGv6H/OK/6JTEDkEEcbi'),
  ('c.bloggs', 'Charlie Bloggs', '$2a$10$Oqv0ctjxFJpUTTdquS97cOSqAgFBL5/AAvrV1qnbvPLQ9Pqtf3ajm'),
  ('s.smith', 'Sam Smith', '$2a$10$YeAqezbIcwHJz8l3JrQks.tW3lhjrKzEE7tq7Vlw0PZvsjoG.EY6K'),
  ('lexlor', 'Alex Taylor', '$2a$10$EMSzTFsGAq0dUQWn29H4le.IkZxvjL/7rcG1igUz8r/NuelsMiLp6'),
  ('wippy', 'Ping Won In', '$2a$10$22En08QtaFTEJiqW/Pg9Oer6AmRXqO.ARdBsfmgNRFR7YFbsTL58m');

INSERT INTO forum_questions (title, user_id, tags, content)
VALUES
  ('A discussion', 1, ARRAY['javascript', 'react'], 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.'),
  ('Another discussion', 2, ARRAY['javascript', 'react'], 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias.'),
  ('Another discussion', 3, ARRAY['interview', 'react'], 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.'),
  ('Another discussion', 4, ARRAY['javascript', 'react'], 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.'),
  ('Another discussion', 5, ARRAY['javascript'], 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.'),
  ('Another discussion', 6, ARRAY['general'], 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa.'),
  ('Another discussion', 1, ARRAY['react'], 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.'),
  ('Another discussion', 2, ARRAY['javascript', 'react'], 'Alanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.'),
  ('Another discussion', 3, ARRAY['node', 'express'], 'Hducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.'),
  ('Another discussion', 4, ARRAY['javascript', 'react'], 'Qlanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.');

INSERT INTO forum_answers (
  text,
  question_id,
  user_id
) VALUES 
    (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    2,
    3
  ),
  (
    'Ewtenetur a sapiente delectus, ut aut reiciendis .',
    4,
    6
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    4,
    4
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    10,
    3
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    10,
    5
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    7,
    1
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    7,
    2
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    7,
    3
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    7,
    4
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    9,
    6
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    6,
    5
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    6,
    1
  ),
  (
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    8,
    2
  );

COMMIT;
