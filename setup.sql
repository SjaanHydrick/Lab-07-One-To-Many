DROP TABLE IF EXISTS superheroes CASCADE;
DROP TABLE IF EXISTS supervillains;

CREATE TABLE superheroes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    alias TEXT NOT NULL,
    name TEXT NOT NULL,
    powers TEXT NOT NULL,
    city TEXT NOT NULL
);

CREATE TABLE supervillains (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    alias TEXT NOT NULL,
    name TEXT NOT NULL,
    powers TEXT NOT NULL,
    superhero_id BIGINT REFERENCES superheroes(id)
);