# Talk Proposal App

A full-stack web application for managing conference talk proposals with role-based access control.

Speakers can submit proposals, reviewers can evaluate them with ratings and comments, and administrators can manage the entire review process.

You fast start this app with reading  " Testing the Application " part
---

# Tech Stack

## Backend
- Node.js with Express
- PostgreSQL database
- Prisma ORM
- JWT authentication with refresh tokens
- Socket.io for real-time notifications
- Express Validator for request validation
- Multer for file uploads
- bcrypt for password hashing

Dependencies:
- express - Web framework
- prisma - ORM for database
- jsonwebtoken - JWT authentication
- bcrypt - Password hashing
- socket.io - Real-time WebSocket
- multer - File upload handling
- express-validator - Input validation
- cors - Cross-origin resource sharing
- helmet - Security headers
- dotenv - Environment variables

## Frontend
- React 18
- React Query for data fetching and caching
- React Router for navigation
- Tailwind CSS for styling
- Socket.io Client for real-time updates
- Axios for API requests
- Context API for authentication state management

Dependencies:
- react-router-dom - Navigation 
- @tanstack/react-query - Data fetching and state management
- axios - HTTP client and 
- socket.io-client - WebSocket client
- tailwindcss - Styling
---

# Authentication & Authorization

The application implements a secure authentication system with role-based access control.

Features include:

- User registration with role selection (Speaker, Reviewer, Admin)
- Login using JWT tokens
- Refresh token mechanism for seamless authentication
- Protected routes based on user roles

---

# Project Structure

```
talk-proposal-app/
├── server/ Backend application
│ ├── src/
│ │ ├── controllers/ Request handlers
│ │ ├── services/ Business logic
│ │ ├── repositories/ Database operations
│ │ ├── routes/ API endpoints
│ │ ├── middleware/ Auth, validation, rate limiting
│ │ │ ├── auth/ JWT authentication
│ │ │ └── validation.js Input validation
│ │ ├── utils/ Helper functions
│ │ │ ├── tokenUtils.js JWT token generation
│ │ │ └── prisma.js Database client
│ │ └── socket/ WebSocket setup
│ ├── prisma/
│ │ ├── schema.prisma Database schema
│ │ └── migrations/ Migration history
│ ├── uploads/ Uploaded PDF files
│ ├── .env
│ └── package.json
│
├── client/ Frontend application
│ ├── src/
│ │ ├── components/ React components
│ │ │ ├── dashboard/ Role-specific dashboards
│ │ │ │ ├── Speaker/
│ │ │ │ ├── Reviewer/
│ │ │ │ └── Admin/
│ │ │ ├── common/ Reusable components
│ │ │ └── Login & Register components
│ │ ├── hooks/ Custom React hooks
│ │ │ └── useProposals.js
│ │ ├── context/ Context providers
│ │ │ ├── AuthContext.js
│ │ │ └── SocketContext.js
│ │ ├── services/ API communication
│ │ │ └── api.js Axios configuration
│ │ ├── utils/
│ │ │ └── validation.js
│ │ └── App.js
│ ├── public/
│ |
│ └── package.json
│
└── README.md
```

---

# Prerequisites

Before running the project, make sure you have installed:

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm 
- pg admin
- Also for connection make sure database is created
---

# Installation

## 1. Clone the Repository


git clone https://github.com/MiroBabakhanlu/proposal-app.git

---

## 2. Install Backend Dependencies


cd server
npm install


---

## 3. Configure Environment Variables

I've included the .env file directly in the repository for convenience. The database connection uses pgAdmin format:

env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE_NAME"
JWT_SECRET=mysecretkey123
REFRESH_TOKEN_SECRET=myrefreshsecret123
PORT=8080
REQ_ORIGIN=http://localhost:3000
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7
Note:

This uses the pgAdmin connection format postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME

Create the database "sigma-db"  in pgAdmin before running migrations

Default PostgreSQL username is usually postgres


---

## 4. Generate Prisma Client


npx prisma generate


(Optional) Run migrations:


npx prisma migrate dev


---

## 5. Install Frontend Dependencies


cd ../client
npm install


---

## 6. Run the Application

Start backend:


cd server
npm start or npm run dev


Start frontend:


cd client
npm start


Application will run at:


Frontend: http://localhost:3000

Backend: http://localhost:8080


---

# Testing the Application (!!!IMPORTANT!!!)
this "Instructions" have been tested multiple times so its guaranteed to see the site live!
After running the seed script, the following test accounts are available:

| Role     | Email                | Password    |
| -------- | -------------------- | ----------- |
| Speaker  | speaker@example.com  | password123 |
| Reviewer | reviewer@example.com | password123 |
| Admin    | admin@example.com    | password123 |

NOTE: 
in order to connect to the db successfully  , first database must exist so create the db then pass the "db-name" to the connection url which is in .env (pg admin was used so pass the credentials with correct format, I have left my own url as an example)

/cd server 
then npx prisma db push,
then npx prisma generate
then npm run seed
then npm start or npm run dev

for client:
/cd client
npm install
npm start

---

# API Documentation

## Authentication Endpoints

| Method | Endpoint                 | Description          | Access        |
| ------ | ------------------------ | -------------------- | ------------- |
| POST   | /api/users/register      | Register new user    | Public        |
| POST   | /api/users/login         | Login user           | Public        |
| POST   | /api/users/refresh-token | Get new access token | Public        |
| POST   | /api/users/logout        | Logout user          | Authenticated |
| GET    | /api/users/me            | Get current user     | Authenticated |

---

## Proposal Endpoints

| Method | Endpoint                  | Description                | Access          |
| ------ | ------------------------- | -------------------------- | --------------- |
| GET    | /api/proposals            | Get proposals with filters | Reviewer, Admin |
| GET    | /api/proposals/my         | Get user's proposals       | Speaker         |
| GET    | /api/proposals/:id        | Get single proposal        | Authenticated   |
| POST   | /api/proposals            | Create proposal            | Speaker, Admin  |
| PATCH  | /api/proposals/:id/status | Update proposal status     | Admin           |

---

## Review Endpoints

| Method | Endpoint                   | Description          | Access          |
| ------ | -------------------------- | -------------------- | --------------- |
| GET    | /api/proposals/:id/reviews | Get proposal reviews | Authenticated   |
| POST   | /api/proposals/:id/reviews | Submit review        | Reviewer, Admin |
| GET    | /api/reviews/my-reviews    | Get user's reviews   | Reviewer        |

---

## Tag Endpoints

| Method | Endpoint  | Description    | Access        |
| ------ | --------- | -------------- | ------------- |
| GET    | /api/tags | Get all tags   | Authenticated |
| POST   | /api/tags | Create new tag | Authenticated |

---

# Database Schema

can be viewd in sever/schema.prisma
---


# Deployment

## Backend Deployment (Render)

1. Push code to GitHub
2. Create a new **Web Service** on Render
3. Connect your repository
4. Configure:

Build Command


npm install && npx prisma generate


Start Command


npm start

5. Add environment variables
6. Deploy

---

## Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory:


/client


4. Add environment variable:


REACT_APP_API_URL=your_backend_url


5. Deploy

---

# Author

Miro Babakhanloo

Email:  
mirobabakhanlu@gmail.com