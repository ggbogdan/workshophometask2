import { group, check } from 'k6';
import http from 'k6/http';

// SWAGGER "PET STORE" API - https://petstore.swagger.io/#/

// npm install 
// npm run test - to run this test with npm script
// k6 run tests\test.ts - to run this test with k6 command

// @ts-ignore  - for disabling TypeScript error

export const options = {
  vus: 1,
  iterations: 1,
};

export default function() {
  group('Default group', function () {
   
  const resp: any = http.get('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
  check(resp, { 'status equals 200': (r) => r.status === 200 });
      // console.log(resp.body);
    

    const pets = JSON.parse(resp.body);

    console.log(pets[0])

    const goldenRetriever = pets.find( (pet: any) => pet.name === 'Golden Retriever') ?? 'goldenRetriever_NOT_FOUND';
    console.log(goldenRetriever);
  });
}
