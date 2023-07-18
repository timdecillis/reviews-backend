const http = require('k6/http');
const { check, sleep } = require('k6');
const baseURL = 'http://localhost:3000/';

export const options = {
  vus: 100,
  duration: '30s',
};

export default () => {
  const res = http.get(`${baseURL}reviews/?product_id=234`);
  check(res, {'status was 200': (r) => r.status === 200});
  sleep(1);
};