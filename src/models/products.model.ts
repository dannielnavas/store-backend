export interface Product {
  id?: string;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  createAt: Date;
  updateAt: Date;
}
