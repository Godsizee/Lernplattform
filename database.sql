-- PostgreSQL Schema for Code & Cash

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    streak INT DEFAULT 0,
    bio TEXT DEFAULT '',
    theme VARCHAR(20) DEFAULT 'dark',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_progress (
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dummy Data for Subjects
INSERT INTO subjects (title, color, icon) VALUES 
('Datenbanken (SQL)', '#3b82f6', 'ph-database'),
('BWL', '#10b981', 'ph-chart-bar'),
('SAP ERP', '#f59e0b', 'ph-buildings'),
('Java', '#ef4444', 'ph-coffee');

-- Dummy Data for Lessons
INSERT INTO lessons (subject_id, title, content) VALUES 
(1, 'Einführung in SQL', '<p>SQL steht für Structured Query Language. Mit <code>SELECT</code>-Statements rufen wir Daten aus der Datenbank ab.</p><div class="code-block"><pre><code>SELECT * FROM users;</code></pre></div>'),
(1, 'SQL Joins verstehen', '<p>Ein <code>INNER JOIN</code> kombiniert Datensätze aus zwei Tabellen, wenn die Join-Bedingung in beiden Tabellen erfüllt ist.</p><div class="code-block"><pre><code>SELECT users.name, user_progress.status \nFROM users \nINNER JOIN user_progress ON users.id = user_progress.user_id;</code></pre></div>'),
(2, 'Was ist BWL?', '<p>Die Betriebswirtschaftslehre befasst sich mit wirtschaftlichen Vorgängen im Unternehmen. Ziel ist es, Ressourcen effizient einzusetzen.</p>'),
(3, 'SAP ERP Navigation', '<p>Die SAP GUI ist die Standard-Oberfläche. Wichtige Transaktionen für Administratoren sind z.B. <code>SU01</code> (Benutzerpflege) und <code>SE16N</code> (Tabellenanzeige).</p>'),
(4, 'Java Hello World', '<p>Der klassische Einstieg in die objektorientierte Programmierung mit Java.</p><div class="code-block"><pre><code>public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}</code></pre></div>');
