// const request = require('supertest');
// const baseURL = 'localhost:3000/';
// const testReview = {};

// describe('POST, /reviews', () => {
//   let response;
//   beforeAll(async () => {
//     response = await request(baseURL).post('reviews/?product_id=10467').send(testReview);
//   }, 80000);
//   it('responds with 201 status code', () => {
//     expect(response.status).toBe(201);
//   });
//   it ('should not throw an error', () => {
//     expect(response.body.error).toBeUndefined();
//   });
//   it ('should successfully post a review to the database', () => {
//   });
// });