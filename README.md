# SupportDesk

SupportDesk is a full-stack customer support ticket management system built to streamline issue tracking, support workflows, and role-based handling for customers, agents, and administrators.

This project is now complete and includes a secure backend, role-based access control, PostgreSQL data storage, and a React-based dashboard for managing support tickets.

## Project Status

Completed and deployed -------- https://supportdesk-client-1fhf.onrender.com/

## Overview

SupportDesk allows:

- Customers to register, sign in, and submit support tickets.
- Agents to review assigned tickets, update their status, and respond through the ticket workflow.
- Admins to manage the ticket queue and assign tickets to agents.
- Teams to track ticket activity, status changes, and issue history.

## Features

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Role-based authorization for customer, agent, and admin users
- Ticket creation with subject, description, category, and priority
- Ticket listing and filtering by role
- Ticket detail view
- Ticket status updates
- Ticket assignment to support agents
- Ticket activity logging
- Message-based ticket communication
- Dashboard analytics for ticket volume and status distribution
- Render deployment configuration
- Health-check endpoint for backend monitoring

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JWT + bcrypt
- Deployment: Render
- Tools: Postman, pgAdmin, Git, GitHub

## Project Structure

```text
Ticket_System/
├── client/                  # React frontend
│   ├── public/
│   └── src/
├── database/
│   └── schema.sql           # Database schema
├── server/
│   ├── src/
│   └── package.json
├── render.yaml              # Render deployment blueprint
├── README.md
└── .gitignore
```

## Database Schema

The PostgreSQL schema includes:

- users
- tickets
- messages
- ticket_activity

The database structure is defined in `database/schema.sql` and is initialized by the backend setup flow.

## API Overview

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Tickets

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/tickets` | Create a support ticket |
| GET | `/api/tickets` | Get tickets based on user role |
| GET | `/api/tickets/my-tickets` | Get the current customer's tickets |
| GET | `/api/tickets/:id` | View a single ticket |
| PATCH | `/api/tickets/:id/status` | Update ticket status |
| PATCH | `/api/tickets/:id/assign` | Assign a ticket to an agent |

### Messages and Activity

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/messages` | Add a message to a ticket |
| GET | `/api/activity` | Fetch ticket activity history |

### System

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Backend home route |
| GET | `/api/health` | Service health check |

## Prerequisites

Before running the project locally, make sure you have:

- Node.js and npm
- PostgreSQL installed and running
- Git
- A code editor such as VS Code

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Ticket_System
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder with values similar to the following:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ticket_system
DB_PASSWORD=your_local_postgres_password
DB_PORT=5432
JWT_SECRET=your_super_secret_key
```

You can also use a single `DATABASE_URL` value if preferred.

### 3. Initialize the database

Create the PostgreSQL database and run the schema:

```bash
createdb ticket_system
psql -d ticket_system -f ../database/schema.sql
```

Or use the backend init script:

```bash
npm run db:init
```

### 4. Start the backend

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

### 5. Set up the frontend

Open a new terminal and run:

```bash
cd client
npm install
npm run dev
```

The frontend will run on the Vite local URL, usually:

```text
http://localhost:5173
```

## Live Demo

Deployed application: https://supportdesk-client-1fhf.onrender.com/

SupportDesk is live and ready to use.

## Security Notes

- Never commit `.env` files to GitHub.
- Store password hashes instead of plain-text passwords.
- Keep JWT secrets and database credentials private.
- Validate authorization checks on all protected routes.

## Usage Flow

1. Sign up or log in.
2. Create a support ticket.
3. View ticket details and update status as needed.
4. Assign tickets to agents if you are an admin.
5. Communicate through ticket messages.
6. Monitor ticket activity and dashboard analytics.

## Author

This project was developed as a full-stack support ticket management application to practice and demonstrate practical work with React, Express, PostgreSQL, authentication, authorization, and deployment workflows.
