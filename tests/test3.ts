import { stepsManager } from "../apps/stepsManager.ts";



export const options = {
  vus: 1,
  iterations: 1,
};

export default function() {

    const addOrder = stepsManager.storeSteps.postOrderById();

    const deleteOrder = stepsManager.storeSteps.deleteOrderById(addOrder, addOrder.orderID);

    const getOrder = stepsManager.storeSteps.getOrderById(deleteOrder, addOrder.orderID);
}