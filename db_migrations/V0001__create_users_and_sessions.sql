CREATE TABLE t_p36031782_avito_clone_developm.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p36031782_avito_clone_developm.sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_p36031782_avito_clone_developm.users(id),
    token VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);
