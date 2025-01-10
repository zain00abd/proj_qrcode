export interface Product {
  barcode: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  price: number;
}