const request = require('supertest');
const baseURL = 'localhost:3000/';
const app = require ('../server/app.js');

describe('GET, /reviews', () => {
  let response;
  beforeAll(async () => {
    response = await request(baseURL).get('reviews/?product_id=10467');
  }, 80000);
  it('should return JSON content type', () => {
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
  it('responds with 200 status code', () => {
    expect(response.status).toBe(200);
  });
  it ('should not throw an error', () => {
    expect(response.body.error).toBeUndefined();
  });
  it ('should return 5 reviews by default', () => {
    expect(response.body.results.length).toBe(5);
  });
});

describe('GET, /reviews/meta', () => {
  let response;
  beforeAll(async () => {
    response = await request(baseURL).get('reviews/meta/?product_id=10467');
  }, 200000);
  it('should return JSON content type', () => {
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
  it('responds with 200 status code', () => {
    expect(response.status).toBe(200);
  });
  it ('should not throw an error', () => {
    expect(response.body.error).toBeUndefined();
  });
  it ('should contain a correct properties ', () => {
    expect(response.body).toHaveProperty('product_id');
    expect(response.body).toHaveProperty('ratings');
    expect(response.body).toHaveProperty('recommend');
  });
});

