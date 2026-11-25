CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age BETWEEN 0 AND 120),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    ward VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    doctor VARCHAR(100) NOT NULL,
    admission_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Admitted'
        CHECK (status IN ('Admitted', 'Discharged')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

