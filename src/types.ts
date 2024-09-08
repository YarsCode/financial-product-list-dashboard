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