
import { Product } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone Premium",
    description: "Latest model with advanced features and high-resolution display.",
    price: 1299.99,
    imageUrl: "/images/smartphone.jpg",
    category: "Electronics",
    stock: 15,
    featured: true,
    paymentLink: "https://payment.com/smartphone"
  },
  {
    id: "2",
    name: "Wireless Headphones",
    description: "Noise-cancelling headphones with long battery life and premium sound quality.",
    price: 249.99,
    imageUrl: "/images/headphones.jpg",
    category: "Electronics",
    stock: 25,
    featured: true,
    paymentLink: "https://payment.com/headphones"
  },
  {
    id: "3",
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt, available in multiple colors.",
    price: 24.99,
    imageUrl: "/images/tshirt.jpg",
    category: "Clothing",
    stock: 50,
    featured: false,
    paymentLink: "https://payment.com/tshirt"
  },
  {
    id: "4",
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe.",
    price: 89.99,
    imageUrl: "/images/coffeemaker.jpg",
    category: "Home & Kitchen",
    stock: 12,
    featured: true,
    paymentLink: "https://payment.com/coffeemaker"
  },
  {
    id: "5",
    name: "Moisturizing Cream",
    description: "All-day hydration for all skin types.",
    price: 18.99,
    imageUrl: "/images/cream.jpg",
    category: "Beauty",
    stock: 30,
    featured: false,
    paymentLink: "https://payment.com/cream"
  },
  {
    id: "6",
    name: "Yoga Mat",
    description: "Non-slip exercise mat for yoga and fitness.",
    price: 29.99,
    imageUrl: "/images/yogamat.jpg",
    category: "Sports",
    stock: 20,
    featured: false,
    paymentLink: "https://payment.com/yogamat"
  }
];
