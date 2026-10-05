import { stepsManagerExec } from "../apps/stepsManagerExec.ts";

export const options = {
  vus: 1,
  iterations: 1,
};

export default function() {
    const logoutUser = stepsManagerExec.logoutUser.execute();
    const createUser = stepsManagerExec.postUser.execute(logoutUser);
    const getUser = stepsManagerExec.getUserByUserName.execute(createUser);
    const loginUser = stepsManagerExec.loginUserByUserNameAndPassword.execute(getUser);
    const updateUserData = stepsManagerExec.updateUserData.execute(loginUser);
    const getUserAfterUpdate = stepsManagerExec.getUserByUserName.execute(updateUserData);
}