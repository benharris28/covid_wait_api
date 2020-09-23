CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name TEXT,
    address TEXT,
    address_link TEXT,
    link TEXT,
    hours TEXT,
    age_restrictions TEXT,
    other_details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()

);