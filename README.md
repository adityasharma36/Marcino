# Marcino Monorepo

Marcino is split into two main parts:

- `Backend/` - A set of Node.js microservices for auth, cart, orders, products, payments, notifications, seller dashboard, and related backend workflows.
- `Frontend/` - A React application built with Vite.

## Repository Layout

- `Backend/` - Independent backend services, each with its own `package.json` and runtime entrypoint.
- `Frontend/` - The client application.

## Getting Started

### Backend

Each backend service is started from its own folder. For example:

```bash
cd Backend/seller-dashboard
npm install
npm run dev
```

Most services expect environment variables such as MongoDB and RabbitMQ connection strings, plus any service-specific secrets.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Frontend Scripts

- `npm run dev` - Start the Vite development server.
- `npm run build` - Build the production bundle.
- `npm run preview` - Preview the production build locally.
- `npm run lint` - Run ESLint.

## Backend Services

The backend folder contains these services:

- `ai-buddy/`
- `auth/`
- `cart/`
- `notification/`
- `order/`
- `payment/`
- `product/`
- `seller-dashboard/`

Each service can be documented and run independently. The seller dashboard service includes its own README at `Backend/seller-dashboard/README.md`.

## Notes

- Install dependencies inside the service you want to run.
- Check each service's `.env` file and startup scripts before launching it.
- The frontend and backend are decoupled, so you can run only the parts you need during development.