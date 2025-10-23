# EHR Demo Application

[![Node.js](https://img.shields.io/badge/Node.js-v18-blue)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-v8.0-orange)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A simple **Electronic Health Records (EHR) demo** application with **role-based login** for doctors, nurses, pharmacists, and patients. Users can manage patients, record vitals, add prescriptions, and view patient history.

---

## Features

- Role-based login and dashboard redirection
- **Doctor:** View patients, add prescriptions
- **Nurse:** Record patient vitals
- **Pharmacist:** View and dispense pending prescriptions
- **Patient:** View personal history
- Simple frontend using HTML, CSS, and JavaScript
- MySQL database with sample data

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MySQL (mysql2)
- **Frontend:** HTML, CSS, JS
- **Other:** dotenv, cors

---

## Prerequisites

- [Node.js](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/)
- npm

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ehr-demo.git
cd ehr-demo/node-backend
