const request = require('supertest');
const app = require('../app');

jest.mock('../middlewares/checkToken', () => ({
  checkToken: (req, res, next) => {
    req.tokenPayLoad = { _id: 'mockUserId', email: 'test@example.com', role: 'user' };
    next();
  }
}));

describe('User Routes', () => {
  it('GET /user/getAllUsers - should return a response with status field', async () => {
    const response = await request(app)
      .get('/user/getAllUsers?userId=mockUserId')
      .set('Authorization', 'Bearer faketoken');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status');
  });
});
