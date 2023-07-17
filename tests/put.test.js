// const request = require('supertest');
// const baseURL = 'localhost:3000/';

// describe('PUT, /reviews', () => {
//   let response;
//   beforeAll(async () => {
//     response = await request(baseURL).put('reviews/1275918/helpful');
//   });
//   it('responds with 204 status code', () => {
//     expect(response.status).toBe(204);
//   });
//   it ('should not throw an error', () => {
//     expect(response.body.error).toBeUndefined();
//   });
//   it ('should successfully update the review entry', async () => {
//     // let query = await request(baseURL).get('reviews/1280253');
//     // console.log(query._body.results);
//     // expect(response._body.helpful).toBe();
//   });
// });