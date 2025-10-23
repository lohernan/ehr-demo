-- schema.sql
CREATE DATABASE IF NOT EXISTS ehr_demo;
USE ehr_demo;

-- users: simple auth for demo (role: DOCTOR, NURSE, PATIENT, PHARMACIST, ADMIN)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL,
  display_name VARCHAR(100)
);

-- patients
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  dob DATE,
  phone VARCHAR(20)
);

-- vitals (simple history)
CREATE TABLE IF NOT EXISTS vitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  recorded_by INT,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  bp VARCHAR(20),
  heart_rate INT,
  temperature DECIMAL(4,2),
  notes TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  prescribed_by INT,
  drug_name VARCHAR(255),
  dosage VARCHAR(100),
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING / DISPENSED
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- sample data (for demo)
INSERT IGNORE INTO users (username, password, role, display_name) VALUES
  ('doc1','password','DOCTOR','Dr. Laura'),
  ('nurse1','password','NURSE','Nurse Amy'),
  ('pharm1','password','PHARMACIST','Pharm Bob'),
  ('pat1','password','PATIENT','Alice Patient');

INSERT IGNORE INTO patients (first_name, last_name, dob, phone) VALUES
  ('Alice','Patient','1990-05-12','555-1111'),
  ('Bob','Care','1980-03-01','555-2222');

INSERT IGNORE INTO prescriptions (patient_id, prescribed_by, drug_name, dosage, status)
VALUES (1, 1, 'Amoxicillin', '500 mg, 3x/day', 'PENDING');
