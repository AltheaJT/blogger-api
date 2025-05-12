const request = require('supertest');
const app = require('../server'); // Import your Express app
const User = require('../models/User');
const { generateRandomString } = require('../utils/helpers');

describe('Auth API Endpoints', () => {
    let testUser;

    beforeAll(async () => {
        // Clear the database before running tests
        await User.deleteMany({});

        // Create a test user
        testUser = {
            first_name: 'Test',
            last_name: 'User',
            email: `test${generateRandomString(8)}@example.com`,
            password: 'password123',
        };

        // Sign up the test user
        await request(app).post('/api/auth/signup').send(testUser);
    });

    it('should sign up a new user', async () => {
        const newUser = {
            first_name: 'New',
            last_name: 'User',
            email: `new${generateRandomString(8)}@example.com`,
            password: 'password123',
        };
        const res = await request(app).post('/api/auth/signup').send(newUser);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should sign in a user', async () => {
        const res = await request(app).post('/api/auth/signin').send({
            email: testUser.email,
            password: testUser.password,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not sign in with invalid credentials', async () => {
        const res = await request(app).post('/api/auth/signin').send({
            email: testUser.email,
            password: 'wrongpassword',
        });
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
});