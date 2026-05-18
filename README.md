# Smart Leads Dashboard

## Project Description

Smart Leads Dashboard is a full-stack Lead Management Dashboard built using the MERN stack with TypeScript. It provides authentication, role-based access control (RBAC), lead CRUD operations, filtering, sorting, debounced search, backend pagination, CSV export, and Docker support. The UI is responsive and includes loading/error states and form validation.

Purpose: enable teams (admin, sales) to manage leads efficiently with fast search, filters, and role-based permissions.

## Features

- **Authentication:** JWT authentication, register, login, protected routes, password hashing with bcrypt.
- **Lead Management:** Create, read, update, delete leads; view single lead details.
- **Listing & Search:** Lead listing with filtering (status, source), search by name/email, sorting, debounced client search.
- **Pagination:** Backend pagination with page metadata and frontend controls.
- **Role-Based Access Control:** Admin and Sales roles with appropriate permissions.
- **CSV Export:** Export leads as CSV.
- **UX:** Responsive UI, loading and error states, client-side form validation.
- **Docker:** Docker Compose support for running frontend + backend + database.

## Pending / Future Improvements

- Dark Mode support (planned).

## Tech Stack

Frontend:

- React
- TypeScript
- TailwindCSS
- Axios
- React Router

Backend:

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt

## Folder Structure (high level)

frontend/
├── src/
backend/
├── src/

(See the repository for the full structure.)

## Environment Variables

An example `.env.example` is included. Typical variables:

- `PORT=`
- `MONGO_URI=`
- `JWT_SECRET=`
- `CLIENT_URL=`
- `NODE_ENV=`

## Installation & Setup

1. Clone repository

```
git clone <repo-url>
```

2. Frontend

```
cd frontend
npm install
npm run dev
```

3. Backend

```
cd backend
npm install
npm run dev
```

4. Docker (optional)

```
docker-compose up --build
```

## API Endpoints 

- `POST /api/auth/register` — register new user
- `POST /api/auth/login` — user login
- `GET /api/leads` — list leads (supports query params for search, filter, sort, and pagination)
- `GET /api/leads/:id` — get single lead
- `POST /api/leads` — create lead
- `PUT /api/leads/:id` — update lead
- `DELETE /api/leads/:id` — delete lead

Refer to the backend routes in `backend/src/routes` for full details.

## Demo Credentials

- **admin**: admin@gmail.com / 1234
- **sales**: test3@gmail.com / 1234

## Usage

- Start backend and frontend (or use Docker). Open the client in the browser and login with demo credentials to explore features.

##  Deployment Link

- https://lms-pi-lake.vercel.app/


