export type ContainerType = {
  id: string;
};

export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  container: string;
  className?: string;
};

export type DataObj = {
    customerName: string;
    customerPhone: string;
    currentDate: string;
    planningStep1?: ProductType[];
    step1Total?: number;
    planningStep2?: ProductType[];
    step2Total?: number;
    totalSum?: number;
}