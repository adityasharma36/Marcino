const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../src/app');
const User = require('../src/models/user.model');

describe('🔐 AUTH API - BLACKLIST FLOW', () => {

    let mongoServer;
    let user;
    let token;

    // 🟢 DB start
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    // 🧹 DB clean
    afterEach(async () => {
        await User.deleteMany({});
    });

    // 🔴 DB close
    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    // 🔧 helper: user + login
    const registerAndLogin = async () => {

        // 🟢 register
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'aditya123',
                email: 'aditya@test.com',
                password: 'Password@123',
                fullName: {
                    firstName: 'Aditya',
                    lastName: 'Sharma'
                }
            });

        // 🔥 login
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'aditya@test.com',
                password: 'Password@123'
            });

        // 🍪 token extract from cookie
        const cookie = res.headers['set-cookie'][0];
        token = cookie.split(';')[0].split('=')[1];
    };

    // ✅ 1. ACCESS BEFORE LOGOUT
    it('should allow access before logout', async () => {

        await registerAndLogin();

        const res = await request(app)
            .get('/api/auth/me')
            .set('Cookie', [`token=${token}`]);

        expect(res.status).toBe(200);
    });

    // 🔥 2. LOGOUT + BLOCK ACCESS
    it('should block access after logout (blacklist)', async () => {

        await registerAndLogin();

        // 🔴 logout
        await request(app)
            .post('/api/auth/logout')
            .set('Cookie', [`token=${token}`]);

        // 🚫 ab access try karo
        const res = await request(app)
            .get('/api/auth/me')
            .set('Cookie', [`token=${token}`]);

        // ✔ access deny hona chahiye
        expect(res.status).toBe(401);
        expect(res.body.message).toContain('Token');
    });

    // ❌ 3. INVALID TOKEN
    it('should fail with invalid token', async () => {

        const res = await request(app)
            .get('/api/auth/me')
            .set('Cookie', ['token=invalidtoken']);

        expect(res.status).toBe(401);
    });

    // ❌ 4. NO TOKEN
    it('should fail if no token provided', async () => {

        const res = await request(app)
            .get('/api/auth/me');

        expect(res.status).toBe(401);
    });

});