[README.md](https://github.com/user-attachments/files/24963186/README.md)
<div align="center">

# 🚀 Creeps Company Management System  
### *Modern REST API for Enterprise Management*

<img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js">
<img src="https://img.shields.io/badge/Express-v5-black?style=for-the-badge&logo=express">
<img src="https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=for-the-badge&logo=mongodb">
<img src="https://img.shields.io/badge/JWT-Secure-orange?style=for-the-badge">
<img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge">

</div>

---

## 🎯 About The Project

**GO Company Management System** is a full-featured backend system designed to manage all company operations including:

- Employees  
- Departments  
- Projects  
- Work assignments  
- Authentication & Authorization  
- Advanced Reports & Analytics  

Built with scalability, security, and clean architecture in mind.

---

## ✨ Features

| Feature | Description |
|--------|------------|
| 👥 Employee Management | CRUD with supervisors & cascade deletion |
| 🏢 Department Management | Managers, locations & stats |
| 📦 Project Management | Projects & employee assignments |
| ⏱ Work Tracking | Hours per employee per project |
| 👨‍👩‍👧 Dependents | Validation & relational integrity |
| 🔐 Auth System | JWT + Role-based access |
| 📊 Reporting | Aggregations & analytics |
| 🛡 Data Integrity | Orphan detection & validation |

---

## 🧠 System Architecture

```txt
Client (Postman / Frontend)
        ↓
   Express.js API
        ↓
 Service Layer (Business Logic)
        ↓
  Mongoose ODM
        ↓
    MongoDB
 ```
## 🛠 Tech Stack
| Layer     | Technology         |
| --------- | ------------------ |
| Runtime   | Node.js            |
| Framework | Express.js v5      |
| Database  | MongoDB + Mongoose |
| Auth      | JWT + bcrypt       |
| Email     | Nodemailer         |
| Security  | Role Based Access  |

## ⚙ Installation
```bash
git clone <repository-url>
cd go-company-api
npm install
```

## 🌳 Configure MongoDB Atlas

1. Create a MongoDB Atlas database user and cluster.
2. Add the IP address of the machine running the API to Atlas Network Access.
3. Copy `.env.example` to `.env` and replace the Atlas URI placeholders with your cluster host and database user credentials. URL-encode special characters in the username or password.
4. Keep `.env` private; never commit your database credentials.

The URI should include the database name, for example:

```env
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@<cluster-host>/GO?retryWrites=true&w=majority
```

## 🚀 Run Project
```bash
# 1. Test Database Connection
npm run test:db

# 2. Seed Initial Demo Data (Admin user, departments, projects)
npm run seed

# 3. Run Full-Stack (Backend API on :3000 + Frontend on :5173 concurrently)
npm run dev

# 4. Or Run Separately
# Frontend only (http://localhost:5173)
npm run client

# Development
npm run start:dev

# Production
npm run start:prod
```

## 🔐 Authentication Flow
```txt
Signup → Login → Receive JWT → Access Protected Routes
```
#### Header format
```h
Authorization: Bearer <token>
```
# 📚 API Modules
## 👤 Users
```bash
POST   /users/signup
POST   /users/login
GET    /users/me
PATCH  /users/me
DELETE /users/me
```
## 👥 Employees
```bash
GET    /employees
POST   /employees
PATCH  /employees/:id
DELETE /employees/:id
```
## 🏢 Departments
```bash
GET    /departments
POST   /departments
```
## 📦 Projects
```bash
GET    /projects
POST   /projects
```
## ⏱ Work Assignments
```ruby
GET /works-on/project/:projectId/employees
GET /works-on/employee/:employeeId/projects
```
## 📊 Reports
```bash
GET /reports/departments/stats
GET /reports/projects/hours
GET /reports/employees/top-supervisors
```
## 🔍 Query System (Advanced)
Supports:
- Pagination
- Sorting
- Projection
```bash
/employees?pageNumber=2&pageSize=5&sort=salary,-name&project=name,salary
```
## 🧪 Error Handling
Standard response :
```json
{
  "status": "error",
  "message": "Description"
}
```
| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 500  | Server Error |

## 📂 Project Structure
```txt
├── Controllers/   → Route handlers
├── Services/      → Business logic
├── Models/        → Mongoose schemas
├── Routers/       → API routes
├── Config/        → Environment setup
├── Utilities/     → Helpers
├── App.js         → Express app
└── server.js      → Entry point
```
## 🧩 Design Principles
- MVC Architecture
- Clean Code
- Separation of Concerns
- SOLID Principles
- Scalable & Maintainable

## 👨‍💻 Author
**Abdelrhman Atef KH**

Backend Engineer | Node.js & System Design

<div align="center">
⭐ If you like this project, give it a star!
</div>
