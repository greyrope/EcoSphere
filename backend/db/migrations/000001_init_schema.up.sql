-- Master Data
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    head VARCHAR(255),
    employee_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    department_id INT REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    xp INT DEFAULT 0,
    role VARCHAR(50) DEFAULT 'Employee'
);

CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unlock_rule INT, -- Amount of XP needed
    icon_url VARCHAR(255)
);

CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    points_required INT NOT NULL,
    stock_status INT DEFAULT 0
);

-- Transactional Data (Gamification & Social)
CREATE TABLE csr_activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    xp_value INT NOT NULL
);

CREATE TABLE employee_participation (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    activity_id INT REFERENCES csr_activities(id),
    proof_url TEXT,
    approval_status VARCHAR(50) DEFAULT 'Under Review',
    points_earned INT DEFAULT 0,
    completion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);