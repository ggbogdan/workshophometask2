import { PetSteps } from "./steps/pet.ts";
import { StoreSteps } from "./steps/store.ts";
import { UserSteps } from "./steps/user.ts";

class StepsManager {
    petSteps: PetSteps = new PetSteps();
    storeSteps: StoreSteps = new StoreSteps();
    userSteps: UserSteps = new UserSteps();

}   

export const stepsManager = new StepsManager();