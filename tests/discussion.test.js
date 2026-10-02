const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const Discussion = require('../src/modules/discussions/discussion.model');
const jwt = require('jsonwebtoken');

describe('Discussion API Endpoints', () => {
  let token;
  let user;

  beforeAll(async () => {
    const uri = 'mongodb://127.0.0.1:27017/vybe_test_discussion';
    await mongoose.connect(uri);
    user = await User.create({
      username: 'discussionuser',
      email: 'discussionuser@test.com',
      password: 'password123'
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Discussion.deleteMany({});
    await mongoose.connection.close();
  });

  let discussionId;

  it('should create a new discussion', async () => {
    const res = await request(app)
      .post('/api/v1/discussions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        movieId: '12345',
        title: 'Test Discussion',
        body: 'This is a test discussion body',
        tags: ['Test', 'Review'],
        hasSpoiler: true
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.title).toEqual('Test Discussion');
    expect(res.body.data.author.username).toEqual('discussionuser');
    
    discussionId = res.body.data.id;
  });

  it('should get discussions by movie', async () => {
    const res = await request(app).get('/api/v1/discussions/movie/12345');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].title).toEqual('Test Discussion');
  });

  it('should toggle like on a discussion', async () => {
    const res = await request(app)
      .post(`/api/v1/discussions/${discussionId}/like`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.isLiked).toBeTruthy();
    expect(res.body.data.likes).toEqual(1);
  });

  it('should add a reply to a discussion', async () => {
    const res = await request(app)
      .post(`/api/v1/discussions/${discussionId}/replies`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'This is a reply' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.body).toEqual('This is a reply');
  });
});
