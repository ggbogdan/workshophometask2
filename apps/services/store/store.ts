import { BaseRequest } from "../baseRequest.ts";
import { Params, RequestBody } from "k6/http";

export class StoreService extends BaseRequest {

    addOrderById(body: RequestBody | null, params?: Params) {
        return this.POST(`/v2/store/order`, body, params);
    }

    deleteOrderById(orderId: string, params?: Params) {
        return this.DELETE(`/v2/store/order/${orderId}`, null, params);
    }

    findOrderById(orderId: string, params?: Params) {
        return this.GET(`/v2/store/order/${orderId}`, params);
    }
}


