import { check, group } from "k6";
import { requestManager } from "../../requestManager.ts";
// @ts-ignore
import { randomString } from '../../../framework/k6Libs/k6Utils.js';
import { Params, RequestBody } from "k6/http";

export class PostUser {
    execute<T extends object>(stepData: T = {} as T) {
        return group('Post User', function () {
            const randomUserName = randomString(7);
            const postUserBody = {
                id: 100000,
                username: randomUserName,
                firstName: "string",
                lastName: "string",
                email: "string",
                password: "password",
                phone: "string",
                userStatus: 0
            };
            const postUserParams: Params = {
                headers: { 'Content-Type': 'application/json', 'accept': 'application/json' }
            };
            const resp: any = requestManager.userService.createUser(postUserBody as unknown as RequestBody, postUserParams);
            check(resp, { 'status equals 200 for post user': (r) => r.status === 200 });
            const user = JSON.parse(resp.body);
            check(user, { 'user creation response code is 200': (u) => u.code === 200 });
            console.log(`User Details for created userName ${randomUserName}: ${JSON.stringify(user)}`);
            return { ...stepData, randomUserName };
        });
    }
}
