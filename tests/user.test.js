const request = require('supertest');
const app = require('../server'); // Import your Express app
const User = require('../models/User');
const { generateRandomString } = require('../utils/helpers');

describe('User API Endpoints', () => {
    let testUser;
    let token;

    beforeAll(async () => {
        // Clear the database before running tests
        await User.deleteMany({});

        // Create a test user and sign them in to get a token
        testUser = {
            first_name: 'Test',
            last_name: 'User',
            email: `test${generateRandomString(8)}@example.com`,
            password: 'password123',
        };
        await request(app).post('/api/auth/signup').send(testUser);
        const signInRes = await request(app).post('/api/auth/signin').send({
            email: testUser.email,
            password: testUser.password,
        });
        token = signInRes.body.token;
    });

    it('should get user profile', async () => {
        const res = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('first_name', testUser.first_name);
        expect(res.body).toHaveProperty('last_name', testUser.last_name);
        expect(res.body).toHaveProperty('email', testUser.email);
    });
});
