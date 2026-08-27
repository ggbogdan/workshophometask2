import { check, group } from "k6";
import { requestManager } from "../requestManager.ts";
// @ts-ignore
import { randomItem } from '../../framework/k6Libs/k6Utils.js';

export class PetSteps {
 getPendingPets<T extends object >(stepData: T = {} as T) {
  
    return group('Get Pending Pets', function () {
   
    const resp: any = requestManager.petService.findPetsByStatus('pending');
  
    check(resp, { 'status equals 200': (r) => r.status === 200 });

    const pets = JSON.parse(resp.body);
    check(pets, { 'all pets have pending status': (p) => p.every((pet: any) => pet.status === 'pending') });
    const randomPet = randomItem(pets);
    if (!randomPet) return stepData;
    const pendingPetID = randomPet.id;

    console.log(`Random Pet: ${JSON.stringify(randomPet)}`);
    console.log(`Random Pet Name: ${randomPet.name}`);
    console.log(`Pending Pet ID: ${pendingPetID}`);
    
    return {...stepData, pendingPetID};
  });
 }

 getAvailablePets<T extends object >(stepData: T = {} as T){
  
    return group('Get Available Pets', function () {
   
    const resp: any = requestManager.petService.findPetsByStatus('available');
  
    check(resp, { 'status equals 200': (r) => r.status === 200 });

    const pets = JSON.parse(resp.body);
    check(pets, { 'all pets have available status': (p) => p.every((pet: any) => pet.status === 'available') });
    const randomPet = randomItem(pets);
    if (!randomPet) return stepData;
    const availablePetID = randomPet.id;

    console.log(`Random Pet: ${JSON.stringify(randomPet)}`);
    console.log(`Random Pet Name: ${randomPet.name}`);
    console.log(`Available Pet ID: ${availablePetID}`);
    
    return {...stepData, availablePetID};
  });
 }

 getSoldPets<T extends object >(stepData: T = {} as T) {

    return group('Get Sold Pets', function () {
   
    const resp: any = requestManager.petService.findPetsByStatus('sold');
  
    check(resp, { 'status equals 200': (r) => r.status === 200 });

    const pets = JSON.parse(resp.body);
    check(pets, { 'all pets have sold status': (p) => p.every((pet: any) => pet.status === 'sold') });
    const randomPet = randomItem(pets);
    if (!randomPet) return stepData;
    const soldPetID = randomPet.id;
    const soldPetName = randomPet.name;

    console.log(`Random Pet: ${JSON.stringify(randomPet)}`);
    console.log(`Random Pet Name: ${soldPetName}`);
    console.log(`Sold Pet ID: ${soldPetID}`);
   
    return {...stepData, soldPetID, soldPetName};
  });
 }

 getPetById<T extends object>(stepData: T = {} as T, petId: string){

    return group('Get Pet By ID', function () {

    const resp: any = requestManager.petService.findPetById(petId);

    check(resp, { 'status equals 200': (r) => r.status === 200 });

    const pet = JSON.parse(resp.body);
    check(pet, { 'returned pet ID matches requested ID': () => String(pet.id) === String(petId) });

    console.log(`Pet Details: ${JSON.stringify(pet)}`);
    console.log(`Pet ID: ${pet.id}`);

    return {...stepData, foundPetData: pet};
  });
 }
}