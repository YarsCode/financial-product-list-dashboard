import { DataObj, ProductType } from "../types";
import { getFormattedDate } from "./getFormattedDate";

export const setDashboardData = (customerName: string, customerPhone: string, products: ProductType[], step1Total: number, step2Total: number, step3Total: number, totalSum: number, activeSection: string) => {
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
        
        dataObj.planningStep3 = products.filter(obj => obj.container === "chosenProductsContainer_step3");
        
        if (step3Total) {
            dataObj.step3Total = step3Total;
        }
        
        if (totalSum) {
            // totalSum is only the sum of steps 1 and 2 (one-time fees)
            // step3Total (monthly fees) is not included in totalSum
            dataObj.totalSum = totalSum;
        }
        
        // Store the active section name
        if (activeSection) {
            dataObj.activeSection = activeSection;
        }
        
        // console.log('dataObj:', dataObj)
        return dataObj;
};