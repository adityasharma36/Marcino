# Seller Dashboard Service

Seller Dashboard is a Node.js and Express microservice that powers seller-facing dashboard data for the Marcino backend. It connects to MongoDB, listens to RabbitMQ events, and exposes authenticated APIs for seller metrics, orders, and products.

## What It Does

- Serves seller dashboard data over REST.
- Authenticates requests with JWT tokens.
- Reads and writes dashboard data in MongoDB.
- Subscribes to RabbitMQ events to keep seller-related collections in sync.

## Prerequisites

- Node.js 18 or newer.
- MongoDB instance.
- RabbitMQ instance.

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `seller-dashboard` directory with the required values:

```env
PORT=3010
MONGO_URI=mongodb://localhost:27017/marcino
RABBIT_URL=amqp://localhost
JWT_SECRET=your-secret-key
```

## Run

Start the service in production mode:

```bash
npm start
```

Start the service in development mode:

```bash
npm run dev
```

The service listens on `PORT` and responds to `GET /` with a health message.

## API Endpoints

All dashboard routes are mounted under `/api/seller/dashboard` and require seller authentication.

- `GET /api/seller/dashboard/metrics` - Returns seller sales totals, revenue, and top products.
- `GET /api/seller/dashboard/orders` - Returns orders containing the seller's products.
- `GET /api/seller/dashboard/products` - Returns the seller's products.

Authentication reads the token from either the `token` cookie or the `Authorization: Bearer <token>` header.

## Event Consumers

The service subscribes to the following RabbitMQ queues:

- `AUTH_SELLER_DASHBOARD.USER_CREATED`
- `PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED`
- `ORDER_SELLER_DASHBOARD.ORDER_CREATED`
- `PAYMENT_SELLER_DASHBOARD.PAYMENT_CREATED`
- `PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATE`

These events keep the local seller dashboard collections updated.

## Project Structure

- `app.js` - Express app setup and route mounting.
- `server.js` - Application bootstrap, database connection, and queue listener startup.
- `src/controllers` - Route handlers.
- `src/middlewares` - Authentication middleware.
- `src/models` - Mongoose models.
- `src/routes` - API route definitions.
- `src/broker` - RabbitMQ connection and subscriptions.
- `src/db` - MongoDB connection logic.

## Notes

- The service expects JWT payloads to include seller information used by the dashboard controllers.
- If RabbitMQ or MongoDB is unavailable, the service may start but event syncing or data access will fail until the dependency is restored.