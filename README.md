# backend

To install dependencies:

```bash
bun install
    "bcrypt": "^6.0.0",
    "cookie": "^1.1.1",
    "cookie-parser": "^1.4.7",
    "crypto": "^1.0.1",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mailgen": "^2.0.32",
    "mongoose": "^9.3.3",
    "nodemailer": "^8.0.4",
    "cors": "^2.8.5",
    
```

To run:

```bash
bun run dev
```

#  Finance Dashboard Backend API

A scalable backend system for a **Finance Dashboard Application** built using a **monolithic architecture with layered design**.
This project implements **Role-Based Access Control (RBAC)** and provides powerful APIs for managing financial data and generating analytics.

---

##  Introduction

This backend system is designed to:

* Provide structured APIs for managing financial records
* Implement **Role-Based Access Control (RBAC)**
* Separate concerns using a **layered architecture**
* Generate **dynamic dashboard analytics** from stored data

---

##  Key Features

###  1. User & Role Management

* Create and manage users
* Assign roles: `Viewer`, `Analyst`, `Admin`
* Control user status (Active / Inactive)
* Restrict actions based on roles

---

###  2. Financial Records Management

####  Fields

* Amount
* Type (`income` / `expense`)
* Category
* Date
* Notes

####  Operations

* Create records
* View records
* Update records
* Delete records
* Filter by date, category, or type

---

###  3. Dashboard Summary APIs

* Total income
* Total expenses
* Net balance
* Category-wise totals
* Recent activity
* Monthly / weekly trends

---

###  4. Access Control Logic

* **Viewer** → Read-only access
* **Analyst** → Read + analytics
* **Admin** → Full control

---

##  Database Schema

###  User Schema

```id="u1x1"
user {
  name
  email
  password
  role: User | Analyst | Admin
  status: Active | Inactive
  isEmailVerified
  refreshToken
  forgotPasswordToken
  forgotPasswordExpiry
  emailVerificationToken
  emailVerificationExpiry
}
```

---

###  Record Schema

```id="u1x2"
record {
  amount
  type: [income, expense]
  category
  date
  note
  isDeleted
}
```

---

##  Setup & Installation

```id="u1x3"
git clone < https://github.com/sam00008/Zorvyn-Project.git>
cd backend
bun add
```

###  Environment Variables

Create `.env` file:

```id="u1x4"
PORT=8000
MONGO_URI=mongodb+srv://zorvyn:samee786@cluster0.wjwp9p2.mongodb.net/zorvyn
```

###  Run Server

```id="u1x5"
npm run dev
```

---

##  API Endpoints

### 🔐 Authentication Routes

Base URL:

```id="u1x6"
http://localhost:8000/api/v1/auth
```

####  Admin Login

```id="u1x7"
POST /login
```

####  Create User (Admin Only)

```id="u1x8"
POST /users
```

####  Admin Update

```id="u1x9"
POST /admin
```

####  Logout

```id="u1x10"
POST /logout
```

---

###  User Routes

```id="u1x11"
http://localhost:8000/api/v1/user
```

* `POST /login`
* `PUT /users`  ####(Admin Only)
* `POST /logout`

---

###  Records Routes

```id="u1x12"
http://localhost:8000/api/v1/records
```

| Method | Endpoint  | Description     |
| ------ | --------- | --------------- |
| POST   | /         | Create record   |
| GET    | /         | Get all records |
| PUT    | /:id      | Update record   |
| DELETE | /:id      | Delete record   |
| GET    | /summary  | Get summary     |
| GET    | /category | Category totals |
| GET    | /monthly  | Monthly trends  |
| GET    | /recent   | Recent activity |

---

##  Example API Response

###  Recent Records

```id="u1x13"
GET /api/v1/records/recent
```

```id="u1x14"
{
  "statusCode": 200,
  "data": [...],
  "message": "Recent Activity fetched Successfully"
}
```

---

##  Authentication

All protected routes require:

```id="u1x15"
Authorization: Bearer <access_token>
```

---

##  Architecture

* Monolithic architecture
* Middleware-based authentication
* Aggregation pipelines for analytics

---

##  Author

**Samee**

---

##  Support

If you found this project useful, give it a ⭐ on GitHub!

