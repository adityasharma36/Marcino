const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// Address tests ke liye in-memory MongoDB use kar rahe hain
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../src/app');
const User = require('../src/models/user.model');

describe('🏠 AUTH API - USER ADDRESSES', () => {

    let mongoServer;
    let token;
    let user;

    // Temporary DB start kar rahe hain
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    // Har test ke baad data clean kar rahe hain
    afterEach(async () => {
        await User.deleteMany({});
    });

    // Test ke baad DB close kar rahe hain
    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    // Helper: user aur token create kar rahe hain
    const createUserAndToken = async () => {

        user = await User.create({
            username: 'aditya123',
            email: 'aditya@test.com',
            password: 'hashed',
            fullName: {
                firstName: 'Aditya',
                lastName: 'Sharma'
            },
            addresses: []
        });

        token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );
    };

    // User ke saare addresses fetch hone chahiye
    it('should get all user addresses', async () => {

        await createUserAndToken();

        // Manual address add kar rahe hain
        user.addresses.push({
            street: 'Street 1',
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            pincode: '462001',
            country: 'India',
            phone: '9999999999',
            isDefault: true
        });

        await user.save();

        const res = await request(app)
            .get('/api/auth/users/me/addresses')
            .set('Cookie', [`token=${token}`]);

        expect(res.status).toBe(200);
        expect(res.body.addresses.length).toBe(1);
        expect(res.body.addresses[0].isDefault).toBe(true);
    });

    // Naya address add hona chahiye
    it('should add new address', async () => {

        await createUserAndToken();

        const res = await request(app)
            .post('/api/auth/users/me/addresses')
            .set('Cookie', [`token=${token}`])
            .send({
                street: 'Street 2',
                city: 'Indore',
                state: 'Madhya Pradesh',
                pincode: '452001',
                country: 'India',
                phone: '8888888888',
                isDefault: true
            });

        expect(res.status).toBe(201);
        expect(res.body.address.city).toBe('Indore');
    });

    // Galat pincode par fail hona chahiye
    it('should fail if pincode is invalid', async () => {

        await createUserAndToken();

        const res = await request(app)
            .post('/api/auth/users/me/addresses')
            .set('Cookie', [`token=${token}`])
            .send({
                street: 'Street',
                city: 'City',
                state: 'Madhya Pradesh',
                pincode: '123', // ❌ wrong
                country: 'India',
                phone: '8888888888'
            });

        expect(res.status).toBe(400);
    });

    // Galat phone par fail hona chahiye
    it('should fail if phone is invalid', async () => {

        await createUserAndToken();

        const res = await request(app)
            .post('/api/auth/users/me/addresses')
            .set('Cookie', [`token=${token}`])
            .send({
                street: 'Street',
                city: 'City',
                state: 'Madhya Pradesh',
                pincode: '462001',
                country: 'India',
                phone: '123' // ❌ wrong
            });

        expect(res.status).toBe(400);
    });

    // Address delete hona chahiye
    it('should delete address', async () => {

        await createUserAndToken();

        // Pehle address add kar rahe hain
        user.addresses.push({
            street: 'Street',
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            pincode: '462001',
            country: 'India',
            phone: '9999999999'
        });

        await user.save();

        const addressId = user.addresses[0]._id;

        const res = await request(app)
            .delete(`/api/auth/users/me/addresses/${addressId}`)
            .set('Cookie', [`token=${token}`]);

        expect(res.status).toBe(200);

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.addresses.length).toBe(0);
    });

    // Missing address par 404 aana chahiye
    it('should fail if address not found', async () => {

        await createUserAndToken();

        const fakeId = new mongoose.Types.ObjectId();

        const res = await request(app)
            .delete(`/api/auth/users/me/addresses/${fakeId}`)
            .set('Cookie', [`token=${token}`]);

        expect(res.status).toBe(404);
    });

    // Token na ho to access deny hona chahiye
    it('should fail if no token provided', async () => {

        const res = await request(app)
            .get('/api/auth/users/me/addresses');

        expect(res.status).toBe(401);
    });

});