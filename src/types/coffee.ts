export interface CoffeeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: "hot" | "cold" | "specialty";
  featured?: boolean;
}

export interface CartItem extends CoffeeItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "brewing" | "packed" | "delivery" | "delivered";
  createdAt: Date;
  address: string;
  phone: string;
}
