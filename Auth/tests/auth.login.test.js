const request = require('supertest'); // API hit karne ke liye
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server'); // fake DB

const app = require('../src/app');
const User = require('../src/models/user.model');

describe('🔐 AUTH API - LOGIN (FAST + SAFE)', () => {

    let mongoServer;

    // 🟢 Test start hone se pehle DB start
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    // 🧹 Har test ke baad DB clean
    afterEach(async () => {
        await User.deleteMany({});
    });

    // 🔴 Test khatam hone ke baad DB band
    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    // 🔧 Helper: user create karne ke liye
    const createUser = async () => {
        const hashedPassword = await bcrypt.hash('Password@123', 10);

        return await User.create({
            username: 'aditya123',
            email: 'aditya@test.com',
            password: hashedPassword,
            fullName: {
                firstName: 'Aditya',
                lastName: 'Sharma'
            }
        });
    };

    // ✅ 1. LOGIN WITH EMAIL
    it('should login using email', async () => {

        await createUser();

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'aditya@test.com', // 📧 email
                password: 'Password@123'
            });

        expect(res.status).toBe(200);
        expect(res.body.message).toContain('Login');

        // 🍪 cookie check
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain('token');
    });

    // ✅ 2. LOGIN WITH USERNAME
    it('should login using username', async () => {

        await createUser();

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'aditya123', // 👤 username
                password: 'Password@123'
            });

        expect(res.status).toBe(200);
    });

    // ❌ 3. WRONG PASSWORD
    it('should fail for wrong password', async () => {

        await createUser();

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'aditya@test.com',
                password: 'Wrong@123'
            });

        expect(res.status).toBe(401);
        expect(res.body.message).toContain('Invalid');
    });

    // ❌ 4. USER NOT FOUND
    it('should fail if user does not exist', async () => {

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'nouser@test.com',
                password: 'Password@123'
            });

        expect(res.status).toBe(401); // 🔥 safe version me always 401
    });

    // ❌ 5. MISSING FIELDS
    it('should fail when identifier or password missing', async () => {

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'test@test.com'
            });

        expect(res.status).toBe(400);
    });

    // 🔐 6. PASSWORD SHOULD NOT RETURN
    it('should not return password in response', async () => {

        await createUser();

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'aditya@test.com',
                password: 'Password@123'
            });

        expect(res.body.user.password).toBeUndefined();
    });

    // 🍪 7. COOKIE SECURITY CHECK
    it('should set secure cookie', async () => {

        await createUser();

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'aditya@test.com',
                password: 'Password@123'
            });

        const cookie = res.headers['set-cookie'][0];

        expect(cookie).toContain('HttpOnly'); // 🔐 JS access nahi
    });

});