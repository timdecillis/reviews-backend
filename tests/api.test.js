const request = require('supertest');

describe('get', function() {
  it('responds with expected JSON structure', function(done) {
    request('https://dog.ceo')
      .get('/api/breeds/image/random')
      .expect(200)
      .expect('Content-Type', 'application/json')
      .expect(/{"message":".*","status":"success"}/, done);
  });
});

