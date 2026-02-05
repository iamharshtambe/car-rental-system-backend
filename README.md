# 🚗 Car Rental System Backend

A backend API for a simple car rental system built using Node.js, TypeScript, Express, PostgreSQL (NeonDB), and Drizzle ORM. The project implements JWT-based authentication, ownership-based authorization, and full CRUD operations for bookings.

## ✨ Features

### 🔐 Authentication

- User signup with hashed passwords
- User login with JWT token generation
- JWT-based route protection
- Logout (client-side token removal)

### 🚘 Bookings Management

- Create a booking
- Fetch all bookings for logged-in user
- Fetch a single booking by ID
- Get bookings summary
- Update booking details
- Update booking status (`booked`, `completed`, `cancelled`)
- Delete a booking
- Strict ownership enforcement (users can access only their own bookings)

## 🛠️ Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL (NeonDB)
- Drizzle ORM
- JWT (jsonwebtoken)
- bcryptjs

## 📂 Project Structure

```
src/
├─ auth/
│  ├─ auth.routes.ts
│  └─ auth.middleware.ts
│
├─ bookings/
│  └─ bookings.routes.ts
│
├─ db/
│  ├─ schema.ts
│  └─ db.ts
│
├─ types/
│  └─ express.d.ts
│
├─ utils/
│  └─ jwt.ts
│
└─ index.ts
```

## 🗄️ Database Schema

### Users

- `id` (UUID, primary key)
- `username` (unique, not null)
- `password` (hashed)
- `created_at`

### Bookings

- `id` (UUID, primary key)
- `user_id` (foreign key → users.id)
- `car_name`
- `days`
- `rent_per_day`
- `status` (`booked | completed | cancelled`)
- `created_at`

## 🔑 Authentication Flow

1. **Signup**
   - User registers with username and password
   - Password is hashed before storing
   - No JWT is issued

2. **Login**
   - Username and password are verified
   - JWT token is issued

3. **Protected Routes**
   - JWT is sent via `Authorization: Bearer <token>`
   - Middleware verifies token and attaches `req.user`

## 📌 API Endpoints

### Auth Routes

**Signup**

```
POST /auth/signup
```

**Login**

```
POST /auth/login
```

**Logout**

```
POST /auth/logout
```

### Booking Routes (Protected)

**Create Booking**

```
POST /bookings
```

**Get All Bookings**

```
GET /bookings
```

**Get Single Booking**

```
GET /bookings?bookingId=<id>
```

**Get Booking Summary**

```
GET /bookings?summary=true
```

**Update Booking**

```
PUT /bookings/:bookingId
```

**Delete Booking**

```
DELETE /bookings/:bookingId
```

## 📊 Booking Summary Logic

- Counts only `booked` and `completed` bookings
- Ignores `cancelled` bookings
- Calculates total cost dynamically

## 🛡️ Security & Validation

- Password hashing using bcrypt
- JWT verification for protected routes
- Ownership checks on all booking operations
- Input validation on create and update routes
- Proper HTTP status codes (`400`, `401`, `403`, `404`, `500`)

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/iamharshtambe/car-rental-system-backend
cd car-rental-backend
```

### 2️⃣ Install Dependencies

```bash
pnpm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_neon_db_url
JWT_SECRET=your_secret_key
PORT=3000
```

### 4️⃣ Run Migrations

```bash
pnpm db:generate
pnpm db:generate
```

### 5️⃣ Start Server

```bash
pnpm run dev
```

Server will run at:

```
http://localhost:3000
```

## 🧠 Key Learnings

- Implemented JWT authentication correctly
- Enforced authorization using ownership checks
- Designed clean REST APIs
- Used Drizzle ORM with PostgreSQL effectively
- Gained hands-on experience with real backend patterns

## ✅ Status

✔ All required routes implemented  
✔ Fully functional and tested
