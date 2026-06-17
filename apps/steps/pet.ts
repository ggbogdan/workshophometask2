import { check, group } from "k6";
import { requestManager } from "../requestManager.ts";
// @ts-ignore
import {randomItem} from '../../framework/k6Libs/k6Utils.js';

export class PetSteps {
getPendingPets<T extends object >(stepData: T = {} as T) {
  
    return group('Get Pending Pets', function () {
   
  // const resp: any = http.get('https://petstore.swagger.io/v2/pet/findByStatus?status=available');

    const resp: any = requestManager.petService.findPetsByStatus('pending');
  
    check(resp, { 'status equals 200': (r) => r.status === 200 });
        // console.log(`response Body: ${resp.body}`);
    

    const pets = JSON.parse(resp.body);
    const randomPet = randomItem(pets);
    const pendingPetID = randomPet.id;

    console.log(`Random Pet: ${JSON.stringify(randomPet)}`);
    console.log(`Random Pet Name: ${randomPet.name}`);
    console.log(`Pending Pet ID: ${pendingPetID}`);
    
    return {...stepData, pendingPetID};

    const foundPet = pets.find( (pet: any) => pet.name === randomPet.name) ?? 'somePet_NOT_FOUND';
    console.log(`Found Pet by Name: ${JSON.stringify(foundPet)}`);
    console.log(`Found Pet ID: ${foundPet.id}`);
  });
}

getAvailablePets<T extends object >(stepData: T = {} as T){
  
    return group('Get Available Pets', function () {
   
    const resp: any = requestManager.petService.findPetsByStatus('available');
  
    check(resp, { 'status equals 200': (r) => r.status === 200 });
        // console.log(`response Body: ${resp.body}`);
    

    const pets = JSON.parse(resp.body);
    const randomPet = randomItem(pets);
    const availablePetID = randomPet.id;

    console.log(`Random Pet: ${JSON.stringify(randomPet)}`);
    console.log(`Random Pet Name: ${randomPet.name}`);
    console.log(`Available Pet ID: ${availablePetID}`);
    
    return {...stepData, availablePetID};

    const foundPet = pets.find( (pet: any) => pet.name === randomPet.name) ?? 'somePet_NOT_FOUND';
    console.log(`Found Pet by Name: ${JSON.stringify(foundPet)}`);
    console.log(`Found Pet ID: ${foundPet.id}`);
  });
}

// getSoldPets(){  
  getSoldPets<T extends object >(stepData: T = {} as T) {

    return group('Get Sold Pets', function () {
   
    const resp: any = requestManager.petService.findPetsByStatus('sold');
  
    check(resp, { 'status equals 200': (r) => r.status === 200 });
        // console.log(`response Body: ${resp.body}`);
    

    const pets = JSON.parse(resp.body);
    const randomPet = randomItem(pets);
    const soldPetID = randomPet.id;
    const soldPetName = randomPet.name;

    console.log(`Random Pet: ${JSON.stringify(randomPet)}`);
    console.log(`Random Pet Name: ${randomPet.name}`);
    console.log(`Sold Pet ID: ${soldPetID}`);
   
    return {...stepData, soldPetID, soldPetName};

    const foundPet = pets.find( (pet: any) => pet.name === randomPet.name) ?? 'somePet_NOT_FOUND';
    console.log(`Found Pet by Name: ${JSON.stringify(foundPet)}`);
    console.log(`Found Pet ID: ${foundPet.id}`);
  });
}

getPetById<T extends object>(stepData: T = {} as T, petId: String){

    return group('Get Pet By ID', function () {

    const resp: any = requestManager.petService.findPetById(petId);

    check(resp, { 'status equals 200': (r) => r.status === 200 });


    const pet = JSON.parse(resp.body);
    const soldPetID = pet.id;

    console.log(`Pet Details: ${JSON.stringify(pet)}`);
    console.log(`Sold Pet ID: ${soldPetID}`);

    return {...stepData, soldPetID};

  });
}


}