import { check, group } from "k6";
import { requestManager } from "../requestManager.ts";
// @ts-ignore
import {randomIntBetween} from '../../framework/k6Libs/k6Utils.js';
import { Params, RequestBody } from "k6/http";

export class StoreSteps {

postOrderById<T extends object>(stepData: T = {} as T){

    return group('Post Order By ID', function () {

      const postOrderByIdBody: RequestBody = JSON.stringify({
       id: randomIntBetween(1000, 9999),
       petId: 1,
       quantity: 1,
       shipDate: "2026-06-07T22:12:00.149Z",
       status: "placed",
       complete: true
      });

      const postOrderByIdParams: Params = {
        headers: { 'Content-Type': 'application/json' }
      };

    const resp: any = requestManager.storeService.addOrderById(postOrderByIdBody, postOrderByIdParams);

    check(resp, { 'status equals 200 for post order': (r) => r.status === 200 });


    const order = JSON.parse(resp.body);
    const orderID = order.id;

    console.log(`Order Details for creating orderID ${orderID}: ${JSON.stringify(order)}`);
    // console.log(`Order ID: ${orderID}`);

    return {...stepData, orderID};

  });
}

deleteOrderById<T extends object>(stepData: T = {} as T, orderID: string){

    return group('Delete Order By ID', function () {

    const resp: any = requestManager.storeService.deleteOrderById(orderID);

    check(resp, { 'status equals 200 for delete order': (r) => r.status === 200 });

    const order = JSON.parse(resp.body);
    console.log(`Order Details when deleting orderID ${orderID}: ${JSON.stringify(order)}`);

    return {...stepData};

  });
}

getOrderById<T extends object>(stepData: T = {} as T, orderID: string){

    return group('Get Order By ID', function () {

    const resp: any = requestManager.storeService.findOrderById(orderID);

    check(resp, { 'status equals 404 for get order': (r) => r.status === 404 });

    const order = JSON.parse(resp.body);
    console.log(`Order Details to check if orderID ${orderID} is deleted: ${JSON.stringify(order)}`);

    return {...stepData};

  });
}

}