[README.md](https://github.com/user-attachments/files/33965858/README.md)
# Customer Support Ticket Management System

## About the Project

This is my internship project, a Customer Support Ticket Management
System. The main goal is to manage customer complaints and support
requests in one place. Customers can create a ticket when they face a
problem, and the system stores the ticket in the database so it can be
tracked later.

The application is being developed with separate roles for customers,
support agents, and admins. I am building it step by step to practise
full-stack development and understand how the frontend, backend,
authentication, and database work together.

## Project Goals

-   Let users register and log in.
-   Store passwords securely using password hashing.
-   Protect APIs using JWT authentication.
-   Allow customers to create support tickets.
-   Save ticket information in PostgreSQL.
-   Let customers view their own tickets.
-   Use separate permissions for customer, agent, and admin roles.
-   Make it easier to track tickets and their status.
-   Provide a simple dashboard for ticket information.

## Technologies Used

**Frontend:** React.js, Vite, Tailwind CSS\
**Backend:** Node.js, Express.js\
**Database:** PostgreSQL\
**Authentication:** JWT and bcrypt\
**Tools:** Visual Studio Code, Postman, pgAdmin, Git, GitHub

## Main Features

### 1. Registration and Login

Users can register and log in. Passwords are hashed before being stored
in the database. JWT tokens are used for protected API requests.

### 2. Role-Based Access

The project includes customer, agent, and admin roles. Access to routes
can be restricted based on the logged-in user's role.

### 3. Create a Ticket

Customers can submit a ticket with a subject, description, category, and
priority. The ticket is saved in PostgreSQL.

### 4. View My Tickets

Customers can request their own tickets through the backend API. The
customer dashboard is being connected to this API to display ticket
data.

### 5. View a Ticket by ID

An API route is being added to fetch a ticket using its ID. Customer
access is checked so that a customer cannot view another customer's
ticket.

### 6. Dashboard

The frontend has role-based dashboard views. The customer dashboard is
being connected to live ticket data from the backend.

## Project Structure

``` text
customer-support-ticket-management-system/
├── client/                 # React frontend
│   └── src/
├── server/                 # Node.js and Express backend
│   └── src/
│       ├── config/          # Database configuration
│       ├── controllers/     # Request handling logic
│       ├── middleware/      # Authentication and role checks
│       └── routes/          # API routes
└── README.md
```

The exact folder structure may change as development continues.

## APIs

  ---------------------------------------------------------------------------
  Method                  Endpoint                    Purpose
  ----------------------- --------------------------- -----------------------
  POST                    `/api/tickets`              Create a ticket
                                                      (customer login
                                                      required)

  GET                     `/api/tickets/my-tickets`   Get the logged-in
                                                      customer's tickets

  GET                     `/api/tickets/:id`          Get a ticket by ID
                                                      (authentication
                                                      required)
  ---------------------------------------------------------------------------

These are the ticket endpoints worked on so far. More endpoints may be
added as the project develops.

## Getting Started

### Requirements

-   Node.js and npm
-   PostgreSQL
-   Git
-   Visual Studio Code or another code editor

### 1. Clone the Repository

``` bash
git clone <your-repository-url>
cd <your-project-folder>
```

Replace the placeholders with your repository URL and folder name.

### 2. Set Up the Backend

``` bash
cd server
npm install
```

Create a `.env` file inside `server` and add the configuration required
by your backend. For example:

``` env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_private_jwt_secret
```

The variable names must match the ones used in your code. Do not upload
real passwords, database credentials, or JWT secrets to GitHub.

Start the backend using the script configured in `server/package.json`.
If a `dev` script is available, run:

``` bash
npm run dev
```

The backend has been using port `5000` during development.

### 3. Set Up the Frontend

Open another terminal:

``` bash
cd client
npm install
npm run dev
```

Vite will show the local frontend URL in the terminal. The frontend has
been running at `http://localhost:5173`.

### 4. Set Up the Database

-   Start PostgreSQL.
-   Create the project database.
-   Add your local database connection details to the backend
    environment file.
-   Create the required tables before testing the APIs.

The project tables include users, tickets, messages, and ticket
activity. Make sure their columns match the SQL queries used in the
current backend code.

## Testing

I have been using Postman to test the backend APIs and pgAdmin to check
whether ticket records are saved in PostgreSQL.

For protected endpoints, add a valid JWT token under **Authorization →
Bearer Token** in Postman.

Example requests:

``` http
GET http://localhost:5000/api/tickets/my-tickets
GET http://localhost:5000/api/tickets/1
```

Use a ticket ID that exists in your database. The response depends on
the logged-in user's permissions and the available data.

## Current Progress

The work completed or worked on so far includes:

-   Frontend and backend setup.
-   PostgreSQL connection.
-   Registration and login functionality.
-   Password hashing and JWT authentication.
-   Role-based authorization middleware.
-   Ticket creation API.
-   API to fetch the logged-in customer's tickets.
-   Testing ticket creation and checking saved records in PostgreSQL.
-   Connecting the customer dashboard to fetch ticket data from the API.
-   Adding the ticket-by-ID route and working through its test.

The display of live tickets on the dashboard still needs to be checked
in the browser. Ticket details, conversations, assignment, status
updates, and activity history are planned for the next stages.

## Planned Improvements

-   Finish and verify the customer ticket list UI.
-   Show complete details when a ticket is opened.
-   Add messages between customers and support agents.
-   Add ticket assignment and status updates.
-   Show ticket activity history.
-   Improve dashboard filters and summary information.
-   Test permissions for all roles.
-   Improve error handling and the user interface.

## Security Notes

-   Store password hashes, not plain-text passwords.
-   Keep the JWT secret and database credentials private.
-   Do not commit `.env` files to GitHub.
-   Verify authentication and permissions on protected APIs.

## Author

This project is being developed by me as part of my internship work. It
helps me practise full-stack web development, API development,
authentication, database handling, and connecting a frontend with a
backend.
