import { BaseRequest } from "../baseRequest.ts";
import { Params, RequestBody } from "k6/http";

export class UserService extends BaseRequest {

    createUser(body: RequestBody | null, params?: Params) {
        return this.POST(`/v2/user`, body, params);
    }

    findUserByUserName(userName: String, params?: Params) {
        return this.GET(`/v2/user/${userName}`, params);
    }

    loginUser(userName: string, password: string, params?: Params) {
        return this.GET(`/v2/user/login?username=${userName}&password=${password}`, params);
    }

    updateUser(userName: string, body: RequestBody | null, params?: Params) {
        return this.PUT(`/v2/user/${userName}`, body, params);
    }    

    logoutUser(params?: Params) {
        return this.GET(`/v2/user/logout`, params);
    }
}


