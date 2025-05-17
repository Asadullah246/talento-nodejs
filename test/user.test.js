const request = require('supertest');
const app = require('../app');

const { checkToken } = require('../middlewares/checkToken');

jest.mock('../../middlewares/checkToken', () => ({
  checkToken: (req, res, next) => {
    req.tokenPayLoad = { _id: 'mockUserId', email: 'test@example.com', role: 'user' };
    next();
  }
}));


describe('User Routes', () => {
  it('GET /user/getAllUsers - should return 200 and an array', async () => {
    const response = await request(app)
      .get('/user/getAllUsers')
      .set('Authorization', 'Bearer faketoken'); // token ignored due to mock

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Adjust this based on actual response shape
  });
});
