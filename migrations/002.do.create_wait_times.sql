CREATE TABLE wait_times (
    id SERIAL PRIMARY KEY,
    location_id INTEGER,
    wait INTEGER,
    date date,
    hour integer,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
