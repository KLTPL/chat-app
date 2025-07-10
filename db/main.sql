-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   email TEXT UNIQUE NOT NULL,
--   password_hash TEXT NOT NULL,
--   name TEXT,
--   created_at TIMESTAMP DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- INSERT INTO users (email, password_hash, name)
-- VALUES ('other@emeil.com', 'geiagheagiae', 'Drugie imie');

-- INSERT INTO users (email, password_hash, name)
-- VALUES ('alice@example.com', '$2b$10$abc...hashedpassword...', 'Alice');

-- INSERT INTO users VALUES (1, 'myemail@email.com', 'geiagheagiae', 'Imie', NOW());

-- SELECT * FROM users;

SELECT name, email FROM users
WHERE email LIKE '%@email.com'
ORDER BY email DESC
LIMIT 1;

-- SELECT * FROM users
-- WHERE
-- GROUP BY
-- HAVING 
-- ORDER BY
-- LIMIT ;

