const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/modules/users/user.model');
const Follow = require('../src/modules/social/follow.model');
const jwt = require('jsonwebtoken');

describe('User and Social API Endpoints', () => {
  let token1, token2;
  let user1, user2;

  beforeAll(async () => {
    const uri = 'mongodb://127.0.0.1:27017/vybe_test_social';
    await mongoose.connect(uri);
    user1 = await User.create({
      username: 'user1',
      email: 'user1@test.com',
      password: 'password123'
    });
    user2 = await User.create({
      username: 'user2',
      email: 'user2@test.com',
      password: 'password123'
    });
    token1 = jwt.sign({ id: user1._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    token2 = jwt.sign({ id: user2._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Follow.deleteMany({});
    await mongoose.connection.close();
  });

  it('should retrieve a user profile by username', async () => {
    const res = await request(app).get(`/api/v1/users/${user1.username}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.username).toEqual('user1');
    expect(res.body.data.stats.followers).toEqual(0);
  });

  it('should allow user2 to follow user1', async () => {
    const res = await request(app)
      .post(`/api/v1/social/follow/${user1._id}`)
      .set('Authorization', `Bearer ${token2}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
  });

  it('should reflect follower count in user1 profile', async () => {
    const res = await request(app).get(`/api/v1/users/${user1.username}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.stats.followers).toEqual(1);
  });

  it('should list user1 followers containing user2', async () => {
    const res = await request(app).get(`/api/v1/users/${user1.username}/followers`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toEqual(1);
    expect(res.body.data[0].username).toEqual('user2');
  });

  it('should show isFollowing true when user2 fetches user1', async () => {
    const res = await request(app)
      .get(`/api/v1/users/${user1.username}`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.body.data.isFollowing).toBeTruthy();
  });

  it('should not allow user to follow themselves', async () => {
    const res = await request(app)
      .post(`/api/v1/social/follow/${user1._id}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(res.statusCode).toEqual(400);
  });
});
