import { stepsManager } from "../apps/stepsManager.ts";



export const options = {
  vus: 1,
  iterations: 1,
};

export default function() {

    const logoutUser = stepsManager.userSteps.logoutUser();

    const createUser = stepsManager.userSteps.postUser();

    const getUser = stepsManager.userSteps.getUserByUserName(createUser, createUser.userName);

    const loginUser = stepsManager.userSteps.loginUserByUserNameAndPassword(getUser, getUser.foundUserName, getUser.foundUserPassword);

    const updateUserData = stepsManager.userSteps.updateUserData(loginUser, loginUser.foundUserName, loginUser.foundUserPassword);

    const getUserAfterUpdate = stepsManager.userSteps.getUserByUserName(updateUserData, updateUserData.foundUserName);
}