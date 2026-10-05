import { check, group } from "k6";
import { requestManager } from "../../requestManager.ts";

export class LogoutUser {
    execute<T extends object>(stepData: T = {} as T) {
        return group('Logout User', function () {
            const resp: any = requestManager.userService.logoutUser();
            check(resp, { 'status equals 200 for logout user': (r) => r.status === 200 });
            const user = resp.body;
            console.log(`User Details for user logout: ${user}`);
            return { ...stepData };
        });
    }
}
