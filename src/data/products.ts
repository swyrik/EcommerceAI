export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    description: "High-fidelity audio with active noise cancellation and 30-hour battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    category: "Electronics"
  },
  {
    id: "2",
    name: "Minimalist Watch",
    price: 149.50,
    description: "Elegant analog watch with a genuine leather strap and sapphire crystal glass.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    category: "Accessories"
  },
  {
    id: "3",
    name: "Ergonomic Office Chair",
    price: 499.00,
    description: "Designed for comfort and productivity with adjustable lumbar support.",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80",
    category: "Furniture"
  },
  {
    id: "4",
    name: "Smart Fitness Tracker",
    price: 89.99,
    description: "Track your health metrics, sleep, and workouts with precision.",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80",
    category: "Electronics"
  },
  {
    id: "5",
    name: "Designer Sunglasses",
    price: 199.00,
    description: "UV protection with a stylish frame that complements any look.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    category: "Accessories"
  },
  {
    id: "6",
    name: "Mechanical Keyboard",
    price: 129.99,
    description: "Tactile switches and customizable RGB lighting for the ultimate typing experience.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b91a91e?w=500&q=80",
    category: "Electronics"
  }
];
