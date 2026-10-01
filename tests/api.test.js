const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');


beforeAll(async () => {
  const uri = 'mongodb://127.0.0.1:27017/vybe_test';
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('API Health Check', () => {
  it('should return 200 and health status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('API is healthy');
  });
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject invalid registration', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'te', // too short
        email: 'test', // invalid email
        password: 'pass' // too short
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Movies API', () => {
  it('should fetch movies', async () => {
    const res = await request(app).get('/api/v1/movies');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Search API', () => {
  it('should return 200 when searching', async () => {
    const res = await request(app).get('/api/v1/search?q=test');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
