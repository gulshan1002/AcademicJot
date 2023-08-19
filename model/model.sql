create database toddle;
/c toddle

CREATE TABLE teacher (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE journal (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    attachment TEXT,
    fileType VARCHAR(10) DEFAULT 'image' CHECK (fileType IN ('image', 'video', 'url', 'pdf')),
    publishedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    teacher INTEGER REFERENCES teacher(id)
);

CREATE TABLE student_journal (
    id SERIAL PRIMARY KEY,
    studentId INTEGER REFERENCES student(id),
    journalId INTEGER REFERENCES journal(id)
);