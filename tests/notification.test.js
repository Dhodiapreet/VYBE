const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Notification = require('../src/modules/notifications/notification.model');

let token1, token2;
let user1Id, user2Id;
let discussionId;

beforeAll(async () => {
  const uri = 'mongodb://127.0.0.1:27017/vybe_test_notifs_' + Date.now();
  await mongoose.connect(uri);

  // create users
  const res1 = await request(app).post('/api/v1/auth/register').send({
    username: 'notifuser1',
    email: 'n1@test.com',
    password: 'password123'
  });
  token1 = res1.body.data.token;
  user1Id = res1.body.data.user._id;

  const res2 = await request(app).post('/api/v1/auth/register').send({
    username: 'notifuser2',
    email: 'n2@test.com',
    password: 'password123'
  });
  token2 = res2.body.data.token;
  user2Id = res2.body.data.user._id;

  const mRes = await request(app).post('/api/v1/movies').send({
    title: 'Notif Movie',
    description: 'abc',
    tmdbId: 100,
    genres: ['Action']
  });

  const dRes = await request(app)
    .post('/api/v1/discussions')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      movieId: '100',
      title: 'Discuss 1',
      body: 'Body 1',
      tags: []
    });
  if (!dRes.body.data) {
    throw new Error('Discussion creation failed: ' + JSON.stringify(dRes.body));
  }
  discussionId = dRes.body.data.id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Notifications API', () => {
  it('should deny access without auth', async () => {
    const res = await request(app).get('/api/v1/notifications');
    expect(res.statusCode).toEqual(401);
  });

  it('should create notification on follow', async () => {
    await request(app)
      .post(`/api/v1/social/follow/${user1Id}`)
      .set('Authorization', `Bearer ${token2}`);

    const notifs = await Notification.find({ recipient: user1Id });
    expect(notifs.length).toBe(1);
    expect(notifs[0].type).toBe('follow');
    expect(notifs[0].actor.toString()).toBe(user2Id.toString());
  });

  it('should create notification on discussion like', async () => {
    await request(app)
      .post(`/api/v1/discussions/${discussionId}/like`)
      .set('Authorization', `Bearer ${token2}`);

    const notifs = await Notification.find({ recipient: user1Id, type: 'like' });
    expect(notifs.length).toBe(1);
    expect(notifs[0].action).toBe('liked your discussion on');
  });

  let notifId;

  it('should get notifications and unread count', async () => {
    const countRes = await request(app)
      .get('/api/v1/notifications/unread-count')
      .set('Authorization', `Bearer ${token1}`);
    expect(countRes.body.data.count).toBe(2);

    const listRes = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${token1}`);
    
    expect(listRes.body.data.length).toBe(2);
    expect(listRes.body.data[0].type).toBeDefined();
    
    notifId = listRes.body.data[0].id;
  });

  it('should mark a notification as read', async () => {
    const res = await request(app)
      .patch(`/api/v1/notifications/${notifId}/read`)
      .set('Authorization', `Bearer ${token1}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.data.isRead).toBe(true);

    const countRes = await request(app)
      .get('/api/v1/notifications/unread-count')
      .set('Authorization', `Bearer ${token1}`);
    expect(countRes.body.data.count).toBe(1);
  });

  it('should mark all notifications as read', async () => {
    const res = await request(app)
      .patch('/api/v1/notifications/read-all')
      .set('Authorization', `Bearer ${token1}`);
    
    expect(res.statusCode).toBe(200);

    const countRes = await request(app)
      .get('/api/v1/notifications/unread-count')
      .set('Authorization', `Bearer ${token1}`);
    expect(countRes.body.data.count).toBe(0);
  });

  it('should delete a notification', async () => {
    const res = await request(app)
      .delete(`/api/v1/notifications/${notifId}`)
      .set('Authorization', `Bearer ${token1}`);
    
    expect(res.statusCode).toBe(200);

    const listRes = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${token1}`);
    
    expect(listRes.body.data.length).toBe(1);
  });
});
