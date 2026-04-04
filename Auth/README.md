# Auth API Project Progress (Step by Step)

This README explains what I have done in this project in sequence.

## 1. Project setup
- Initialized Node.js backend project.
- Added dependencies in package.json:
  - express
  - mongoose
  - dotenv
  - bcryptjs
  - jsonwebtoken
  - cookie-parser
  - express-validator
- Added testing dependencies:
  - jest
  - supertest
  - mongodb-memory-server

## 2. Server entry point created
- Created server.js.
- Imported app from src/app.js.
- Imported DB connection from src/db/db.js.
- Connected DB first, then started server on port 3000.

## 3. Database connection module
- Created src/db/db.js.
- Added mongoose connection using MONGOOSE_URL from .env.
- Added basic success/error logs.

## 4. Express app setup
- Created src/app.js.
- Added express.json() middleware.
- Added cookie-parser middleware.
- Loaded env using dotenv.
- Mounted auth routes on base path:
  - /api/auth

## 5. User model created
- Created src/models/user.model.js.
- Added fields:
  - username (required, unique)
  - email (required, unique)
  - password (select:false for security)
  - fullName.firstName
  - fullName.lastName
  - role (default: user, enum: user/seller)
  - address array schema

## 6. Validation middleware created
- Created src/middleware/validator.middleware.js.
- Added registerUserValidator rules:
  - username must be string and min length 6
  - valid email
  - strong password checks:
    - min 8 chars
    - lowercase
    - uppercase
    - number
    - special character
  - fullName.firstName required
  - fullName.lastName required
- Added centralized validation error response (400).

## 7. Auth route created
- Created src/routes/auth.routes.js.
- Added endpoint:
  - POST /register
- Attached middleware + controller:
  - validator.registerUserValidator
  - authController.registerUser

## 8. Register controller logic
- Created src/controllers/auth.controller.js.
- Implemented register flow:
  - Read username, email, password, firstName, lastName from body
  - Check duplicate user by username OR email
  - Return 409 if user already exists
  - Hash password using bcrypt
  - Create user in MongoDB
  - Generate JWT token
  - Set token in httpOnly cookie
  - Return 201 with success message and user data

## 9. Test suite created for register API
- Created tests/auth.register.test.js.
- Used:
  - supertest for API testing
  - mongodb-memory-server for in-memory DB
  - jest test lifecycle hooks (beforeAll, afterEach, afterAll)
- Added test cases for:
  - successful registration
  - weak password
  - missing fields
  - duplicate user
  - invalid email
  - short username
  - cookie set check
  - extra field (role injection) security check

## 10. Debugging and fixes done
- Fixed route path mismatch in tests:
  - from /auth/register
  - to /api/auth/register
- Fixed password compare test issue caused by select:false in user model:
  - used .select('+password') in success test DB query

## 11. Current project status
- Register API is implemented with validation, hashing, JWT cookie, duplicate checks, and tests.
- Test coverage for register flow is added and working with realistic scenarios.

## 12. Available scripts
- Run dev server:
  - npm run dev
- Run tests:
  - npm run test
- Run tests in watch mode:
  - npm run test:watch

## 13. Redis environments
- `NODE_ENV=test` uses an in-memory Redis mock, so tests never connect to a live Redis database.
- `NODE_ENV=development` and `NODE_ENV=production` both use `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD`.
- If those values are missing, the code falls back to `127.0.0.1:6379`.
