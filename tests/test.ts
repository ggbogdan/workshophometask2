import { group, check } from 'k6';
import http from 'k6/http';

// SWAGGER "PET STORE" API - https://petstore.swagger.io/#/

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

    const goldenRetriever = pets.find( (pet: any) => pet.name === 'Golden Retriever');
    console.log(goldenRetriever);
  });
}
