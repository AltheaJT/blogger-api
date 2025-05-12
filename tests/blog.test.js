const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Blog = require('../models/Blog');
const { generateRandomString } = require('../utils/helpers');

describe('Blog API Endpoints', () => {
    let testUser;
    let token;
    let testBlog;

    beforeAll(async () => {
        // Clear the database
        await User.deleteMany({});
        await Blog.deleteMany({});

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

        // Create a test blog
        testBlog = {
            title: 'Test Blog',
            body: 'This is a test blog post.',
            state: 'draft',
        };
    });

    it('should create a new blog', async () => {
        const res = await request(app)
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('title', 'Test Blog');
        expect(res.body).toHaveProperty('state', 'draft');
        testBlog.id = res.body._id; //store the id.
    });

    it('should get a list of published blogs', async () => {
        const res = await request(app).get('/api/blogs');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.blogs)).toBe(true);
    });

    it('should get a blog by id', async () => {
        const res = await request(app).get(`/api/blogs/${testBlog.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('title', 'Test Blog');
    });
    it('should update a blog', async () => {
        const updatedBlogData = {
            title: 'Updated Test Blog',
            body: 'This is an updated test blog post.',
        };
        const res = await request(app)
            .put(`/api/blogs/${testBlog.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBlogData);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('title', 'Updated Test Blog');
        expect(res.body).toHaveProperty('body', 'This is an updated test blog post.');
    });

    it('should delete a blog', async () => {
        const res = await request(app)
            .delete(`/api/blogs/${testBlog.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(204);
    });
});