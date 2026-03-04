# Car Rental System Backend

A RESTful backend API for a **Car Rental System** built using **Express, PostgreSQL, Prisma, Zod, and JWT authentication**.

The project demonstrates authentication, authorization, database modeling, and clean API design.

---

## Tech Stack

- **Node.js**
- **Express**
- **PostgreSQL**
- **Prisma ORM**
- **Zod** (request validation)
- **JWT** (authentication)

---

## Features

- User signup and login
- JWT based authentication
- Protected booking routes
- Create car bookings
- View bookings (list, single booking, and summary)
- Update booking details or status
- Delete bookings
- Ownership checks (users can only modify their own bookings)
- Input validation using Zod

---

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/iamharshtambe/car-rental-backend.git
cd car-rental-backend
```

### 2. Install dependencies

```bash
bun install (recommended)
```

or

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file:

```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
```

---

### 4. Run database migrations

```bash
bunx --bun prisma migrate dev
```

---

### 5. Start the server

```bash
bun run dev
```

Server runs at:

```
http://localhost:3000
```

---

# API Endpoints

Base URL:

```
/api/v1
```

---

# Auth Routes

### Signup

**POST**

```
/api/v1/auth/signup
```

Request body:

```json
{
  "email": "harsh",
  "password": "password123"
}
```

---

### Login

**POST**

```
/api/v1/auth/login
```

Returns JWT token.

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "token": "JWT_TOKEN"
  }
}
```

---

# Booking Routes

All booking routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Create Booking

**POST**

```
/api/v1/bookings
```

Request body:

```json
{
  "carName": "Honda City",
  "days": 3,
  "rentPerDay": 1500
}
```

Rules:

- `days < 365`
- `rentPerDay <= 2000`
- `status` is automatically set to `"booked"`

---

## Get Bookings

**GET**

```
/api/v1/bookings
```

Returns all bookings for the logged-in user.

---

## Get Single Booking

```
/api/v1/bookings?bookingId=<id>
```

---

## Booking Summary

```
/api/v1/bookings?summary=true
```

Returns:

- total bookings
- total amount spent

Only counts bookings with status:

```
booked
completed
```

---

## Update Booking

**PUT**

```
/api/v1/bookings/:bookingId
```

Update booking details:

```json
{
  "carName": "Verna",
  "days": 4,
  "rentPerDay": 1600
}
```

Update status:

```json
{
  "status": "completed"
}
```

---

## Delete Booking

**DELETE**

```
/api/v1/bookings/:bookingId
```

Deletes a booking owned by the logged-in user.

---

# Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

# Database Schema

### Users

- id
- email
- password
- created_at

### Bookings

- id
- user_id
- car_name
- days
- rent_per_day
- status (`booked | completed | cancelled`)
- created_at

---

# Security

- Passwords hashed before storing
- JWT authentication for protected routes
- Ownership validation for booking updates and deletion
