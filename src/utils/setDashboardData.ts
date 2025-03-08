import { DataObj, ProductType } from "../types";
import { getFormattedDate } from "./getFormattedDate";

export const setDashboardData = (customerName: string, customerPhone: string, products: ProductType[], step1Total: number, step2Total: number, totalSum: number) => {
    const dataObj: DataObj = {customerName: "", currentDate: Date(), customerPhone: ""};
        
        if (customerName) {
            dataObj.customerName = customerName;
        }
        
        if (customerPhone) {
            dataObj.customerPhone = customerPhone;
        }
        
        dataObj.currentDate = getFormattedDate();
        
        dataObj.planningStep1 = products.filter(obj => obj.container === "chosenProductsContainer_step1");
        
        if (step1Total) {
            dataObj.step1Total = step1Total;
        }

        dataObj.planningStep2 = products.filter(obj => obj.container === "chosenProductsContainer_step2");
        
        if (step2Total) {
            dataObj.step2Total = step2Total;
        }
        
        if (totalSum) {
            dataObj.totalSum = totalSum;
        }
        
        console.log('dataObj:', dataObj)
        return dataObj;
};