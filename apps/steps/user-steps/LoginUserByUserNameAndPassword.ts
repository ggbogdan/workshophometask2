import { check, group } from "k6";
import { requestManager } from "../../requestManager.ts";
import { Params } from "k6/http";

export class LoginUserByUserNameAndPassword {
    execute<T extends object>(stepData: T = {} as T) {
        return group('Login User By UserName And Password', function () {
            const userName = (stepData as any).foundUserName;
            const password = (stepData as any).foundUserPassword;
            const loginUserParams: Params = {
                headers: { 'accept': 'application/json' }
            };
            const resp: any = requestManager.userService.loginUser(userName, password, loginUserParams);
            check(resp, { 'status equals 200 for login user': (r) => r.status === 200 });
            const user = resp.body;
            console.log(`User Details for user login: ${user}`);
            return { ...stepData };
        });
    }
}
