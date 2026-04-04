const request = require('supertest'); // API ko hit karne ke liye
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server'); // fake DB

const app = require('../src/app');
const User = require('../src/models/user.model');

describe('🔐 AUTH API - REGISTER', () => {

    let mongoServer;

    // 🟢 Test start hone se pehle fake DB start
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    // 🧹 Har test ke baad DB clean (important)
    afterEach(async () => {
        await User.deleteMany({});
    });

    // 🔴 Sab test ke baad DB band
    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    // ✅ 1. SUCCESS REGISTER
    it('should register user successfully', async () => {

        const payload = {
            username: 'aditya123',
            email: 'aditya@test.com',
            password: 'Password@123', // 🔥 strong password
            fullName: {
                firstName: 'Aditya',
                lastName: 'Sharma'
            }
        };

        // 🔥 API hit
        const res = await request(app)
            .post('/api/auth/register')
            .send(payload);

        // ✔ status check (201 = created)
        expect(res.status).toBe(201);

        // ✔ message check
        expect(res.body.message).toContain('register');

        // ✔ response me email match hona chahiye
        expect(res.body.user.email).toBe(payload.email);

        // 🔍 DB check (user bana ya nahi)
        const user = await User.findOne({ email: payload.email }).select('+password');

        expect(user).not.toBeNull();

        // 🔐 password hashed hai ya nahi check
        const isMatch = await bcrypt.compare(payload.password, user.password);
        expect(isMatch).toBe(true);
    });

    // ❌ 2. WEAK PASSWORD
    it('should fail if password is weak', async () => {

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'weakuser',
                email: 'weak@test.com',
                password: '12345678', // ❌ weak
                fullName: {
                    firstName: 'Weak',
                    lastName: 'User'
                }
            });

        // ✔ 400 = bad request
        expect(res.status).toBe(400);
    });

    // ❌ 3. MISSING FIELDS
    it('should fail if required fields are missing', async () => {

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@test.com'
            });

        expect(res.status).toBe(400);
    });

    // ❌ 4. DUPLICATE USER
    it('should fail if user already exists', async () => {

        // 🟢 pehle ek user insert karo manually
        await User.create({
            username: 'duplicate',
            email: 'duplicate@test.com',
            password: 'hashed',
            fullName: {
                firstName: 'Dup',
                lastName: 'User'
            }
        });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'duplicate',
                email: 'duplicate@test.com',
                password: 'Password@123',
                fullName: {
                    firstName: 'Dup',
                    lastName: 'User'
                }
            });

        // ✔ 409 = conflict
        expect(res.status).toBe(409);
    });

    // 🔥 5. SECURITY TEST (password response me nahi hona chahiye)
    it('should not return password in response', async () => {

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'secureuser',
                email: 'secure@test.com',
                password: 'Password@123',
                fullName: {
                    firstName: 'Secure',
                    lastName: 'User'
                }
            });

        // ✔ password hidden hona chahiye
        expect(res.body.user.password).toBeUndefined();
    });

    // 🍪 6. COOKIE TEST (JWT)
    it('should set token in cookie after register', async () => {

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'cookieuser',
                email: 'cookie@test.com',
                password: 'Password@123',
                fullName: {
                    firstName: 'Cookie',
                    lastName: 'User'
                }
            });

        // 🍪 cookie check
        const cookies = res.headers['set-cookie'];

        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain('token');
    });

});