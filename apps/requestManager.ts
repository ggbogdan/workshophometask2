import { PetService } from "./services/pet/pet.ts";
import { StoreService } from "./services/store/store.ts";
import { UserService } from "./services/user/user.ts";

class RequestManager {
    petService: PetService = new PetService();
    storeService: StoreService = new StoreService();
    userService: UserService = new UserService();
}

export const requestManager = new RequestManager();

