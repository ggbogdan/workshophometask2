import { stepsManager } from "../apps/stepsManager.ts";



export const options = {
  vus: 1,
  iterations: 1,
};

export default function() {
    const pendingPets = stepsManager.petSteps.getPendingPets();
    const availablePets = stepsManager.petSteps.getAvailablePets(pendingPets);
    const soldPets = stepsManager.petSteps.getSoldPets(availablePets);
    const soldPetById = stepsManager.petSteps.getPetById(soldPets, soldPets.soldPetID);

    const soldPetById2 = stepsManager.petSteps.getPetById(soldPets, soldPets.pendingPetID);
}