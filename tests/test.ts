import { group, check } from 'k6';
import http from 'k6/http';

// SWAGGER "PET STORE" API - https://petstore.swagger.io/#/

export const options = {
  vus: 1,
  iterations: 1,
};

export default function() {
  group('Default group', function () {
   
  const resp = http.get('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
    // console.log(resp.body);
    
    // @ts-ignore
    console.log( JSON.parse(resp.body)[0])
  

    check(resp, { 'status equals 200': (r) => r.status === 200 });
  });
}
