const http = require('k6/http');
const { check, sleep } = require('k6');
const baseURL = 'http://localhost:3000/';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 500,
      maxVUs: 800,
    },
  },
};

export default () => {
  const res = http.get(`${baseURL}reviews/?product_id=900500`);
  check(res, {'status was 200': (r) => r.status === 200});
  sleep(1);
};