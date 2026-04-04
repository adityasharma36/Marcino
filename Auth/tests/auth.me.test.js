const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../src/app');
const User = require('../src/models/user.model');

describe('🔐 AUTH API - GET /me', () => {

    let mongoServer;
    let token;
    let user;

    // 🟢 DB start
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    // 🧹 clean DB
    afterEach(async () => {
        await User.deleteMany({});
    });

    // 🔴 DB close
    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    // 🔧 helper: user + token create karo
    const createUserAndToken = async () => {

        user = await User.create({
            username: 'aditya123',
            email: 'aditya@test.com',
            password: 'hashedpassword',
            fullName: {
                firstName: 'Aditya',
                lastName: 'Sharma'
            }
        });

        // 🔑 JWT token manually generate
        token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
    };

    // ✅ 1. SUCCESS (AUTHORIZED)
    it('should return current user when token is valid', async () => {

        await createUserAndToken();

        const res = await request(app)
            .get('/api/auth/me')
            .set('Cookie', [`token=${token}`]); // 🍪 cookie me token send

        expect(res.status).toBe(200);

        // ✔ user data check
        expect(res.body.user.email).toBe('aditya@test.com');
        expect(res.body.user.username).toBe('aditya123');
    });

    // ❌ 2. NO TOKEN
    it('should fail if token is not provided', async () => {

        const res = await request(app)
            .get('/api/auth/me');

        expect(res.status).toBe(401);
    });

    // ❌ 3. INVALID TOKEN
    it('should fail if token is invalid', async () => {

        const res = await request(app)
            .get('/api/auth/me')
            .set('Cookie', ['token=invalidtoken']);

        expect(res.status).toBe(401);
    });

    // ❌ 4. USER NOT FOUND
    it('should fail if user does not exist', async () => {

        // 🔑 token generate but user DB me nahi
        const fakeToken = jwt.sign(
            { id: new mongoose.Types.ObjectId() },
            process.env.JWT_SECRET
        );

        const res = await request(app)
            .get('/api/auth/me')
            .set('Cookie', [`token=${fakeToken}`]);

        expect(res.status).toBe(404);
    });

    // 🔐 5. PASSWORD SHOULD NOT RETURN
    it('should not return password in response', async () => {

        await createUserAndToken();

        const res = await request(app)
            .get('/api/auth/me')
            .set('Cookie', [`token=${token}`]);

        expect(res.body.user.password).toBeUndefined();
    });

});