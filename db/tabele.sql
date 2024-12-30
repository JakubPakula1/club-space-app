-- Tworzenie tabeli 'users'
CREATE TABLE users (
    id SERIAL PRIMARY KEY,     -- Auto-increment id (unikalny identyfikator)
    name VARCHAR(255) NOT NULL, -- Imię użytkownika
    password VARCHAR(255) NOT NULL -- Hasło użytkownika
);

-- Tworzenie tabeli 'groups'
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,     -- Auto-increment id (unikalny identyfikator)
    name VARCHAR(255) NOT NULL, -- Nazwa grupy
    description TEXT,          -- Opis grupy
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Data utworzenia grupy
);

-- Możesz dodać kolejne tabele w przyszłości, jeśli potrzebujesz
