import { Product } from './types';

const STORAGE_KEY = 'scanned-products';

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const products = localStorage.getItem(STORAGE_KEY);
  return products ? JSON.parse(products) : [];
};

export const getProductByBarcode = (barcode: string): Product | undefined => {
  const products = getProducts();
  return products.find((product) => product.barcode === barcode);
};

export const saveProduct = (barcode: string, name: string, price: number): void => {
  const products = getProducts();
  const now = new Date().toISOString();
  
  const existingProductIndex = products.findIndex((p) => p.barcode === barcode);
  
  if (existingProductIndex >= 0) {
    products[existingProductIndex] = {
      ...products[existingProductIndex],
      name,
      price,
      updatedAt: now,
    };
  } else {
    products.push({
      barcode,
      name,
      price,
      createdAt: now,
      updatedAt: now,
    });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};