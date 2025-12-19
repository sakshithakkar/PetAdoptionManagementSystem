# Pet Adoption Management System

A full-stack MERN application for managing pet adoptions. Users can browse pets, apply for adoption, and admins can manage pets and adoption requests.

---

## Table of Contents

* [Overview](#overview)
* [User Roles](#user-roles)
* [Features](#features)
* [Technical Requirements](#technical-requirements)
* [Database Setup](#database-setup)
* [Env File Example](#env-file-example)
* [Installation](#installation)
* [Usage](#usage)
* [Folder Structure](#folder-structure)
* [API Endpoints](#api-endpoints)
* [Technologies](#technologies)
* [License](#license)

---

## Overview

The Pet Adoption Management System allows visitors to browse pets available for adoption, registered users to apply for adoption, and admins to manage pets and adoption applications. The system supports role-based access, authentication, and real-time status updates for adoption requests.

---

## User Roles

* **Visitor**: Browse pets, view pet details.
* **User**: Register/login, apply to adopt pets, view adoption status.
* **Admin**: Manage pets (CRUD), view and approve/reject adoption applications, update pet status.

---

## Features

### Visitor

* View list of available pets.
* Search pets by name or breed.
* Filter pets by species, breed, and age.
* View pet details.
* Pagination on pet list.

### User

* Register/Login.
* Apply to adopt available pets.
* View own adoption applications and their statuses.

### Admin

* Add/Edit/Delete pets.
* View all adoption applications.
* Approve or reject applications.
* Update pet status automatically or manually.

---

## Technical Requirements

### Backend

* Node.js and Express.
* JWT authentication with role-based authorization.
* REST APIs for CRUD and adoption workflow.
* Validation to prevent invalid applications.
* File upload for pet photos (or image URLs).

### Frontend

* React with Axios for API requests.
* Public pet listing with search, filters, and pagination.
* User dashboard to view applications.
* Admin dashboard for pet management and application approvals.

### Database

* MySQL (or PostgreSQL)
* Sample SQL schema provided below.

---

## Database Setup

```sql
-- Create database
CREATE DATABASE pet_adoption;

USE pet_adoption;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('USER','ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pets table
CREATE TABLE pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  species VARCHAR(50),
  breed VARCHAR(50),
  age INT,
  description TEXT,
  status ENUM('AVAILABLE','ADOPTED','PENDING') DEFAULT 'AVAILABLE',
  image VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adoption applications table
CREATE TABLE adoptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  pet_id INT,
  status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (pet_id) REFERENCES pets(id),
  UNIQUE(user_id, pet_id)
);
```

---

## Env File Example

Create a `.env` file in the backend root folder with:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_db_password
DB_NAME=pet_adoption
JWT_SECRET=your_jwt_secret
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/sakshithakkar/PetAdoptionManagementSystem.git
cd pet-adoption-system
```

2. **Backend Setup**

```bash
cd backend
npm install
```

* Create the `.env` file as above.
* Start the backend server:

```bash
npm run dev
```

3. **Frontend Setup**

```bash
cd frontend
npm install
npm start
```

---

## Usage

* Access the app at `http://localhost:5000`.
* Visitors can browse pets and view details.
* Users can register/login and apply for adoption.
* Admins can manage pets and adoption applications.

---

## Folder Structure

```
pet-adoption-system/
│
├─ backend/
│   ├─ controllers/
│   ├─ config/
│   ├─ routes/
│   ├─ middleware/
│   ├─ uploads/
│   └─ server.js
|   ├─ app.js
│
├─ frontend/
│   ├─ src/
│   │   ├─ components/
│   │   ├─ pages/
│   │   ├─ context/
│   │   ├─ api/
│   │   └─ App.js
│   |   |─ App.css
│   │   └─ main.jsx
|   ├── .env
|   └── vite.config.js
│
└─ README.md
```

---

## API Endpoints (Summary)

### Auth

* `POST /auth/register` - Register new user
* `POST /auth/login` - Login user

### Pets

* `GET /pets` - List all pets
* `GET /pets/:id` - Pet details
* `POST /pets` - Add new pet (Admin)
* `PUT /pets/:id` - Update pet (Admin)
* `DELETE /pets/:id` - Delete pet (Admin)

### Adoption

* `GET /adoptions/me` - User's applications
* `POST /adoptions/:petId` - Apply for adoption (User)
* `GET /adoptions` - List all applications (Admin)
* `PUT /adoptions/:id` - Approve/Reject application (Admin)

---

## Technologies

* **Frontend**: React, Axios, Bootstrap
* **Backend**: Node.js, Express
* **Database**: MySQL
* **Authentication**: JWT

---

