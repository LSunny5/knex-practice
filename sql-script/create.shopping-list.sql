DROP TYPE IF EXISTS grocery;
CREATE TYPE grocery AS ENUM (
    'Main',
    'Snack',
    'Lunch',
    'Breakfast'
);

CREATE TABLE IF NOT EXISTS shopping_list (
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    price decimal(10, 2) NOT NULL,
    date_added TIMESTAMPTZ DEFAULT now() NOT NULL,
    checked BOOLEAN DEFAULT false NOT NULL,
    category grocery NOT NULL
);