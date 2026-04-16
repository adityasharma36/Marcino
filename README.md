# Rusty-Project

> A Node.js/Express backend monorepo with three microservices: **Auth** (user authentication & address management), **Product** (product creation with image uploads), and **Cart** (user cart management).

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

Rusty-Project is a backend monorepo built with **Node.js** and **Express**. It is split into three independent services:

| Service | Directory | Default Port | Responsibility |
|---------|-----------|--------------|----------------|
| Auth    | `Auth/`   | `3000`       | User registration, login, logout, profile, and address management |
| Product | `Product/`| `3001`       | Product creation with multi-image upload via ImageKit |
| Cart    | `Cart/`   | `3002`       | Manage authenticated user carts, quantities, and stock-aware cart updates |

All services share a common stack: **Express**, **MongoDB** (via Mongoose), and **JWT**-based authentication.

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

### Cart Service
- Add items to the authenticated user's cart
- Update quantity of a cart item by product id
- Fetch current cart with `items` plus computed `totals`
- Validates requested quantities against Product service stock before add/update

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
├── Product/               # Product microservice
│   ├── src/
│   │   ├── app.js
│   │   ├── controller/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   └── package.json
│
└── Cart/                  # Cart microservice
    ├── src/
    │   ├── app.js
    │   ├── controllers/
    │   ├── db/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
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

   # Cart service
   cd ../Cart
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

### `Cart/.env`

```env
MONGO_URL=mongodb://localhost:27017/rusty-cart
JWT_SECRET=your_jwt_secret_here
PRODUCT_SERVICE_URL=http://localhost:3001
PORT=3002
```

> **Notes:**
> - `JWT_SECRET` must be the same value across Auth, Product, and Cart so that tokens issued by Auth can be verified by Cart/Product.
> - `PRODUCT_SERVICE_URL` should point to the Product service base URL because Cart checks product availability before add/update operations.

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

# Cart service (port 3002)
cd Cart
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

# Cart service
cd Cart
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

### Cart Service — `http://localhost:3002`

All Cart endpoints are mounted under `/api/cart` and require an authenticated user token (cookie `token` or `Authorization: Bearer <jwt>`).

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/cart/items` | Yes (`user`) | Add a product to cart or increment quantity if already present |
| `PATCH` | `/api/cart/items/:productId` | Yes (`user`) | Update quantity of an existing cart line item |
| `GET` | `/api/cart` | Yes (`user`) | Fetch current cart items and summary totals |

#### Cart request/response examples

Add item request:

```json
{
  "productId": "507f191e810c19729de860ea",
  "qty": 2
}
```

Typical add/update success response shape:

```json
{
  "message": "item has been added",
  "cart": {
    "user": "507f191e810c19729de860ff",
    "items": [
      {
        "productId": "507f191e810c19729de860ea",
        "quantity": 2
      }
    ]
  }
}
```

Get cart response shape:

```json
{
  "items": [
    {
      "productId": "507f191e810c19729de860ea",
      "quantity": 2
    }
  ],
  "totals": {
    "itemsCount": 1,
    "totalQuantity": 2
  }
}
```

Validation/error notes:
- `productId` must be a valid Mongo ObjectId string.
- `qty` must be a positive integer.
- Cart returns `409` when requested quantity exceeds available stock.

---

## Testing

Tests use **Jest** and **Supertest**. The Auth service uses `mongodb-memory-server` so no live MongoDB is needed during tests.

```bash
# Auth service tests
cd Auth
npm test

# Auth tests in watch mode
npm run test:watch

# Product service tests
cd ../Product
npm test

# Cart service tests
cd ../Cart
npm test
```

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
