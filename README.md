# GO Company Management System

A comprehensive REST API for managing company operations including employees, departments, projects, and work assignments.

## Features

- **Employee Management**: CRUD operations with supervisor relationships and cascade deletion
- **Department Management**: Track departments, managers, and locations
- **Project Management**: Manage projects and employee assignments
- **Work Assignments**: Track employee hours on projects
- **Dependents**: Manage employee dependents with validation
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Reporting**: Advanced analytics and aggregations
- **Data Integrity**: Automated orphaned data detection and validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & bcrypt
- **Email**: Nodemailer

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd go-company-api
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## Environment Variables

Required:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT (min 32 characters)

Optional:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `JWT_EXPIRES_IN` - Token expiry (default: 7d)
- `BCRYPT_ROUNDS` - Password hash rounds (default: 10)
- Email configuration (for password reset)

## API Endpoints

### Authentication
- `POST /users/signup` - Register new user
- `POST /users/login` - User login
- `POST /users/forgot-password` - Request password reset
- `PATCH /users/reset-password/:token` - Reset password
- `PATCH /users/update-password` - Update password (authenticated)

### Employees
- `GET /employees` - Get all employees (with pagination, sorting, projection)
- `GET /employees/:id` - Get employee by ID
- `POST /employees` - Create employee (admin only)
- `PATCH /employees/:id` - Update employee (admin only)
- `DELETE /employees/:id` - Delete employee (admin only, supports `?cascade=true`)

### Departments
- `GET /departments` - Get all departments
- `GET /departments/:id` - Get department by ID
- `POST /departments` - Create department (admin only)
- `PATCH /departments/:id` - Update department (admin only)
- `DELETE /departments/:id` - Delete department (admin only)

### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create project (admin only)
- `PATCH /projects/:id` - Update project (admin only)
- `DELETE /projects/:id` - Delete project (admin only)

### Work Assignments
- `GET /works-on` - Get all assignments
- `GET /works-on/:id` - Get assignment by ID
- `POST /works-on` - Assign employee to project (admin only)
- `PATCH /works-on/:id` - Update assignment (admin only)
- `DELETE /works-on/:id` - Delete assignment (admin only)
- `GET /works-on/project/:projectId/employees` - Get employees on project
- `GET /works-on/employee/:employeeId/projects` - Get employee's projects

### Dependents
- `GET /dependents` - Get all dependents
- `GET /dependents/:id` - Get dependent by ID
- `POST /dependents` - Create dependent (admin only)
- `PATCH /dependents/:id` - Update dependent (admin only)
- `DELETE /dependents/:id` - Delete dependent (admin only)

### Reports
- `GET /reports/departments/stats` - Employee statistics by department
- `GET /reports/departments/:id/summary` - Department summary
- `GET /reports/projects/hours` - Total hours per project
- `GET /reports/projects/unstaffed` - Projects without employees
- `GET /reports/employees/hours` - Total hours per employee
- `GET /reports/employees/without-supervisor` - Employees without supervisor
- `GET /reports/employees/top-supervisors` - Top supervisors by subordinate count

### Admin
- `GET /admin/check-integrity` - Check and report orphaned data

### User Management (Admin Only)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Current User
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update current user profile
- `DELETE /users/me` - Deactivate current user account

## Query Parameters

All GET endpoints support:
- `pageNumber` - Page number for pagination (default: 1)
- `pageSize` - Items per page (default: 5)
- `sort` - Sort fields (comma-separated, e.g., `salary,-name`)
- `project` - Fields to include (comma-separated, e.g., `name,salary`)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API uses consistent error responses:
```json
{
  "status": "error",
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Project Structure

```
├── Controllers/       # Request handlers
├── Models/           # MongoDB schemas
├── Routers/          # Route definitions
├── Services/         # Business logic
├── Config/           # Configuration files
├── utilities/        # Helper functions
├── App.js           # Express app setup
└── server.js        # Server entry point
```

## License

ISC

## Author
ABDELRHMAN ATEF KH
