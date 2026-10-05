import { check, group } from "k6";
import { requestManager } from "../../requestManager.ts";
// @ts-ignore
import { randomString, randomIntBetween } from '../../../framework/k6Libs/k6Utils.js';
import { Params, RequestBody } from "k6/http";

export class UpdateUserData {
    execute<T extends object>(stepData: T = {} as T) {
        return group('Update User Data', function () {
            const userName = (stepData as any).foundUserName;
            const password = (stepData as any).foundUserPassword;
            const userId = (stepData as any).foundUserID;
            const updateUserBody = {
                id: userId,
                username: userName,
                firstName: randomString(7),
                lastName: randomString(7),
                email: `${randomString(5)}@example.com`,
                password: password,
                phone: `+1-${randomIntBetween(100, 999)}-${randomIntBetween(100, 999)}-${randomIntBetween(1000, 9999)}`,
                userStatus: 0
            };
            const updateUserParams: Params = {
                headers: { 'accept': 'application/json', 'Content-Type': 'application/json' }
            };
            const resp: any = requestManager.userService.updateUser(userName, updateUserBody as unknown as RequestBody, updateUserParams);
            check(resp, { 'status equals 200 for update user': (r) => r.status === 200 });
            const user = resp.body;
            console.log(`User Details for updated userName ${userName}: ${user}`);
            return { ...stepData };
        });
    }
}
