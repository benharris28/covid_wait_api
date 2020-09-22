CREATE TABLE wait_times (
    id SERIAL PRIMARY KEY,
    location_id INTEGER,
    wait INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);