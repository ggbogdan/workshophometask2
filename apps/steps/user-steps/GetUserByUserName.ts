import { check, group } from "k6";
import { requestManager } from "../../requestManager.ts";
import { Params } from "k6/http";

export class GetUserByUserName {
    execute<T extends object>(stepData: T = {} as T) {
        return group('Get User By UserName', function () {
            const userName = (stepData as any).foundUserName || (stepData as any).randomUserName;
            const getUserParams: Params = {
                headers: { 'accept': 'application/json' }
            };
            const resp: any = requestManager.userService.findUserByUserName(userName, getUserParams);
            check(resp, { 'status equals 200 for get user': (r) => r.status === 200 });
            const user = JSON.parse(resp.body);
            const foundUserName = user.username;
            const foundUserPassword = user.password;
            const foundUserID = user.id;
            check(user, { 'returned username matches requested username': () => user.username === userName });
            console.log(`User Details for userName ${userName}: ${JSON.stringify(user)}`);
            return { ...stepData, foundUserName, foundUserPassword, foundUserID };
        });
    }
}
