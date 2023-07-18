const request = require('supertest');
const baseURL = 'localhost:3000/';

describe('PUT, /reviews', () => {
  let response, currentHelpful;

  beforeAll(async () => {
    response = await request(baseURL).put('reviews/1275918/helpful');
    currentHelpful = await request(baseURL).get('reviews/1275918');
  });
  it('responds with 204 status code', () => {
    expect(response.status).toBe(204);
  });
  it ('should not throw an error', () => {
    expect(response.body.error).toBeUndefined();
  });
});