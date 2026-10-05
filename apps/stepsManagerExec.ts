import { LogoutUser } from "./steps/user-steps/LogoutUser.ts";
import { PostUser } from "./steps/user-steps/PostUser.ts";
import { GetUserByUserName } from "./steps/user-steps/GetUserByUserName.ts";
import { LoginUserByUserNameAndPassword } from "./steps/user-steps/LoginUserByUserNameAndPassword.ts";
import { UpdateUserData } from "./steps/user-steps/UpdateUserData.ts";

class StepsManagerExec {
    logoutUser = new LogoutUser();
    postUser = new PostUser();
    getUserByUserName = new GetUserByUserName();
    loginUserByUserNameAndPassword = new LoginUserByUserNameAndPassword();
    updateUserData = new UpdateUserData();
}

export const stepsManagerExec = new StepsManagerExec();
