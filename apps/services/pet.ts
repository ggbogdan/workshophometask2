import { BaseRequest } from "./baseRequest.ts";
import { Params } from "k6/http";

export class PetService extends BaseRequest {


    findPetsByStatus(status: 'available' | 'pending' | 'sold', params?: Params) {
        
        return this.GET(`/v2/pet/findByStatus?status=${status}`, params);
    }       


    findPetById(petId: String, params?: Params) {
        return this.GET(`/v2/pet/${petId}`, params);
    }
}


