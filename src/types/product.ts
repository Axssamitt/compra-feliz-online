
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  featured: boolean;
  paymentLink?: string;
  stock?: number; // Make stock optional
}

export type ProductFormData = Omit<Product, 'id'>;

export const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Books",
  "Toys",
  "Other"
];
