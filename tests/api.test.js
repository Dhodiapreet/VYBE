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

  it('should fallback to local movies for TMDB trending if API key is missing', async () => {
    const originalApiKey = process.env.TMDB_API_KEY;
    delete process.env.TMDB_API_KEY;

    const res = await request(app).get('/api/v1/movies/tmdb/trending');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Fallback to local movies');

    process.env.TMDB_API_KEY = originalApiKey;
  });

  it('should return mock 200 for TMDB trending if fetch is mocked', async () => {
    const originalApiKey = process.env.TMDB_API_KEY;
    process.env.TMDB_API_KEY = 'mocked_key';
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 1, title: 'Mock Movie', overview: 'desc' }] }),
      })
    );

    const res = await request(app).get('/api/v1/movies/tmdb/trending');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    // Since it syncs to DB, it might add an _id
    expect(res.body.data.results[0].title).toBe('Mock Movie');

    global.fetch = originalFetch;
    process.env.TMDB_API_KEY = originalApiKey;
  });

  it('should return mock 200 for TMDB search', async () => {
    const originalApiKey = process.env.TMDB_API_KEY;
    process.env.TMDB_API_KEY = 'mocked_key';
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 2, title: 'Mock Search', overview: 'desc' }] }),
      })
    );

    const res = await request(app).get('/api/v1/movies/tmdb/search?q=test');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.results[0].title).toBe('Mock Search');

    global.fetch = originalFetch;
    process.env.TMDB_API_KEY = originalApiKey;
  });

  it('should return mock 200 for TMDB discover', async () => {
    const originalApiKey = process.env.TMDB_API_KEY;
    process.env.TMDB_API_KEY = 'mocked_key';
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 3, title: 'Mock Discover', overview: 'desc' }] }),
      })
    );

    const res = await request(app).get('/api/v1/movies/tmdb/discover?sort_by=popularity.desc');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.results[0].title).toBe('Mock Discover');

    global.fetch = originalFetch;
    process.env.TMDB_API_KEY = originalApiKey;
  });

  it('should fallback to local movies on TMDB fetch errors', async () => {
    const originalApiKey = process.env.TMDB_API_KEY;
    process.env.TMDB_API_KEY = 'mocked_key';
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ status_message: 'Invalid API key' }),
      })
    );

    const res = await request(app).get('/api/v1/movies/tmdb/trending');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Fallback to local movies');

    global.fetch = originalFetch;
    process.env.TMDB_API_KEY = originalApiKey;
  });
});

describe('Search API', () => {
  it('should return 200 when searching', async () => {
    const res = await request(app).get('/api/v1/search?q=test');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
