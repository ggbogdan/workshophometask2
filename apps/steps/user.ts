import { check, group } from "k6";
import { requestManager } from "../requestManager.ts";
// @ts-ignore
import { randomString, randomIntBetween } from '../../framework/k6Libs/k6Utils.js';
import { Params, RequestBody } from "k6/http";

export class UserSteps {

postUser<T extends object>(stepData: T = {} as T){

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

    return {...stepData, randomUserName};

  });
}

getUserByUserName<T extends object>(stepData: T = {} as T, userName: string){

    return group('Get User By UserName', function () {

    const getUserParams: Params = {
        headers: { 'accept': 'application/json'}
        };   

    const resp: any = requestManager.userService.findUserByUserName(userName, getUserParams);

    check(resp, { 'status equals 200 for get user': (r) => r.status === 200 });

    const user = JSON.parse(resp.body);
    const foundUserName = user.username;
    const foundUserPassword = user.password;
    const foundUserID = user.id;
    check(user, { 'returned username matches requested username': () => user.username === userName });
    console.log(`User Details for userName ${userName}: ${JSON.stringify(user)}`);

    return {...stepData, foundUserName, foundUserPassword, foundUserID};

  });
}

loginUserByUserNameAndPassword<T extends object>(stepData: T = {} as T, userName: string, password: string){

    return group('Login User By UserName And Password', function () {

    const loginUserParams: Params = {
        headers: { 'accept': 'application/json'}
        };      

    const resp: any = requestManager.userService.loginUser(userName, password, loginUserParams);

    check(resp, { 'status equals 200 for login user': (r) => r.status === 200 });

    const user = resp.body;
    console.log(`User Details for user login: ${user}`);

    return {...stepData};

  });
}

updateUserData<T extends object>(stepData: T = {} as T, userName: string, password: string, userId: number){

    return group('Update User Data', function () {

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
        headers: { 'accept': 'application/json',
                   'Content-Type': 'application/json'}
        };

    const resp: any = requestManager.userService.updateUser(userName, updateUserBody as unknown as RequestBody, updateUserParams);

    check(resp, { 'status equals 200 for update user': (r) => r.status === 200 });

    const user = resp.body;
    
    console.log(`User Details for updated userName ${userName}: ${user}`);
    
    return {...stepData};

  });
}

logoutUser<T extends object>(stepData: T = {} as T){

    return group('Logout User', function () {

    const resp: any = requestManager.userService.logoutUser();

    check(resp, { 'status equals 200 for logout user': (r) => r.status === 200 });

    const user = resp.body;
    console.log(`User Details for user logout: ${user}`);

    return {...stepData};

  });
}
}