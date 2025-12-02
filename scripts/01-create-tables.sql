-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personality results table
CREATE TABLE IF NOT EXISTS personality_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- 'questionnaire', 'twitter', 'image', 'video'
    source_identifier VARCHAR(255), -- twitter username, image name, video name, etc.
    openness DECIMAL(3, 2) NOT NULL,
    conscientiousness DECIMAL(3, 2) NOT NULL,
    extraversion DECIMAL(3, 2) NOT NULL,
    agreeableness DECIMAL(3, 2) NOT NULL,
    neuroticism DECIMAL(3, 2) NOT NULL,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questionnaire responses table
CREATE TABLE IF NOT EXISTS questionnaire_responses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    result_id INTEGER REFERENCES personality_results(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_personality_results_user_id ON personality_results(user_id);
CREATE INDEX IF NOT EXISTS idx_personality_results_created_at ON personality_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_user_id ON questionnaire_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_result_id ON questionnaire_responses(result_id);
