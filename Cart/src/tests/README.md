# Cart API tests

These Jest tests define the contract for the Cart service endpoints.

## Assumptions (used by tests)

- Your Express app instance is exported from `src/app.js` (tests import it directly, no server listen).
- The Cart service calls the Product Service over HTTP using `process.env.PRODUCT_SERVICE_URL`.
- The Product Service provides `GET /products/:id` returning:

```json
{ "id": "p1", "priceCents": 1500, "availableQty": 10 }
```

The test suite spins up a local stub Product Service that implements that endpoint.

## Run

- `npm test`
- `npm run test:watch`
