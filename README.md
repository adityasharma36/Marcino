# Rusty-Project

> A Node.js/Express backend monorepo with two microservices: **Auth** (user authentication & address management) and **Product** (product creation with image uploads).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Services](#running-the-services)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Rusty-Project is a backend monorepo built with **Node.js** and **Express**. It is split into two independent services:

| Service | Directory | Default Port | Responsibility |
|---------|-----------|--------------|----------------|
| Auth    | `Auth/`   | `3000`       | User registration, login, logout, profile, and address management |
| Product | `Product/`| `3001`       | Product creation with multi-image upload via ImageKit |

Both services share a common stack: **Express**, **MongoDB** (via Mongoose), and **JWT**-based authentication.

---

## Features

### Auth Service
- User registration with strong-password validation
- Secure login returning an `httpOnly` JWT cookie
- Token blacklisting on logout (Redis)
- Protected `GET /me` endpoint to fetch the current user
- Address management: add, list, and remove user addresses

### Product Service
- Create products with up to 5 images (uploaded to **ImageKit** CDN)
- Role-based access control — only `admin` or `seller` roles may create products
- Multer-powered in-memory file handling before CDN upload

---

## Prerequisites

| Requirement | Version  | Notes |
|-------------|----------|-------|
| Node.js     | ≥ 18.x   | [nodejs.org](https://nodejs.org) |
| npm         | ≥ 9.x    | bundled with Node.js |
| MongoDB     | ≥ 6.x    | local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) |
| Redis       | ≥ 7.x    | required by the Auth service for token blacklisting |

---

## Project Structure

```
Rusty-Project/
├── Auth/                  # Authentication microservice
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── tests/
│   ├── server.js
│   └── package.json
│
└── Product/               # Product microservice
    ├── src/
    │   ├── app.js
    │   ├── controller/
    │   ├── db/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   └── services/
    ├── server.js
    └── package.json
```

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/adityasharma36/Rusty-Project.git
   cd Rusty-Project
   ```

2. **Install dependencies for each service**

   ```bash
   # Auth service
   cd Auth
   npm install

   # Product service
   cd ../Product
   npm install
   ```

---

## Configuration

Each service reads its configuration from a `.env` file placed in its own directory. Create the files before starting the servers.

### `Auth/.env`

```env
MONGOOSE_URL=mongodb://localhost:27017/rusty-auth
JWT_SECRET=your_jwt_secret_here
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
NODE_ENV=development
```

### `Product/.env`

```env
MONGOOSE_URL=mongodb://localhost:27017/rusty-product
JWT_SECRET=your_jwt_secret_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
PORT=3001
```

> **Note:** `JWT_SECRET` must be the same value in both services so that tokens issued by Auth can be verified by Product.

---

## Running the Services

Each service is started independently from its own directory.

### Development (with auto-reload via nodemon)

```bash
# Auth service (port 3000)
cd Auth
npm run dev

# Product service (port 3001)
cd Product
npm run dev
```

### Production

```bash
# Auth service
cd Auth
node server.js

# Product service
cd Product
node server.js
```

---

## API Reference

### Auth Service — `http://localhost:3000`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/auth/register` | No | Register a new user |
| `POST` | `/api/auth/login` | No | Login and receive a JWT cookie |
| `GET`  | `/api/auth/me` | Yes | Get current authenticated user |
| `POST` | `/api/auth/logout` | No | Logout and blacklist the token |
| `GET`  | `/api/auth/users/me/addresses` | Yes | List addresses of current user |
| `POST` | `/api/auth/users/me/addresses` | Yes | Add a new address |
| `DELETE` | `/api/auth/users/me/addresses/:addressId` | Yes | Remove an address |

### Product Service — `http://localhost:3001`

| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| `POST` | `/api/products` | Yes | `admin` or `seller` | Create a product (up to 5 images via `multipart/form-data`) |

---

## Testing

Tests use **Jest** and **Supertest**. The Auth service uses `mongodb-memory-server` so no live MongoDB is needed during tests.

```bash
# Auth service tests
cd Auth
npm test

# Auth tests in watch mode
npm run test:watch
```

> The Product service test setup is TBD.

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with clear messages.
4. Open a pull request describing your changes.

Please keep pull requests focused and include tests where appropriate.

---

## License

No license has been specified for this project yet. All rights are reserved by the author until a license is added.