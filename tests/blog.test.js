const request = require('supertest');
const app = require('../server');  // Import your Express app

describe('Blog API Endpoints', () => {
  let token;
  let blogId;

  // Set token for the user to be authenticated
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });
    
    token = res.body.token;
  });

  // Test Create Blog
  it('should create a new blog (draft)', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Blog',
        description: 'This is a test blog.',
        body: 'This is the body of the blog.',
        tags: ['test', 'blog'],
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Blog');
    expect(res.body.state).toBe('draft');
    blogId = res.body._id;
  });

  // Test Get All Blogs (Paginated)
  it('should get a list of blogs', async () => {
    const res = await request(app).get('/api/blogs');
    
    expect(res.status).toBe(200);
    expect(res.body.docs.length).toBeGreaterThan(0);
  });

  // Test Get Single Blog
  it('should get a single blog and increase read count', async () => {
    const res = await request(app).get(`/api/blogs/${blogId}`);
    
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(blogId);
    expect(res.body.read_count).toBe(1);  // Check that the read count increased
  });

  // Test Update Blog State (from draft to published)
  it('should update blog state to published', async () => {
    const res = await request(app)
      .put(`/api/blogs/${blogId}/publish`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.state).toBe('published');
  });

  // Test Edit Blog
  it('should edit the blog content', async () => {
    const res = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Blog',
        body: 'Updated body content of the blog.',
      });
    
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Blog');
  });

  // Test Delete Blog
  it('should delete the blog', async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Blog deleted successfully');
  });
});
