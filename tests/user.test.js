const request = require('supertest');
const app = require('../server');  // Import your Express app

describe('User Authentication', () => {
  let token;

  // Test User Signup
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });
    
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('john.doe@example.com');
  });

  // Test User Signin
  it('should signin an existing user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should fail signin with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
