const request = require('supertest');
const baseURL = 'localhost:3000/';
const testReview = {
  product_id: 1,
  rating: 5,
  summary: 'test summary',
  body: 'test body',
  recommend: true,
  name: 'foo',
  email: 'foo@bar.com',
  photos: [],
  characteristics: {}
};

describe('POST, /reviews', () => {
  let response;
  beforeAll(async () => {
    response = await request(baseURL).post('reviews/?product_id=10467').send(testReview);
  });
  it('responds with 201 status code', () => {
    expect(response.status).toBe(201);
  });
  it ('should not throw an error', () => {
    expect(response.body.error).toBeUndefined();
  });
});