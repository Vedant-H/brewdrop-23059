import { CoffeeItem } from "@/types/coffee";
import latteImg from "@/assets/coffee-latte.jpg";
import cappuccinoImg from "@/assets/coffee-cappuccino.jpg";
import espressoImg from "@/assets/coffee-espresso.jpg";
import coldBrewImg from "@/assets/coffee-coldbrew.jpg";
import mochaImg from "@/assets/coffee-mocha.jpg";
import flatWhiteImg from "@/assets/coffee-flatwhite.jpg";
import icedAmericanoImg from "@/assets/coffee-icedamericano.jpg";

export const coffeeItems: CoffeeItem[] = [
  {
    id: "1",
    name: "Caramel Latte",
    description: "Smooth espresso with steamed milk and caramel drizzle",
    price: 499,
    rating: 4.8,
    image: latteImg,
    category: "hot",
    featured: true,
  },
  {
    id: "2",
    name: "Classic Cappuccino",
    description: "Rich espresso topped with velvety foam",
    price: 459,
    rating: 4.7,
    image: cappuccinoImg,
    category: "hot",
    featured: true,
  },
  {
    id: "3",
    name: "Double Espresso",
    description: "Bold and intense double shot of espresso",
    price: 429,
    rating: 4.9,
    image: espressoImg,
    category: "hot",
  },
  {
    id: "4",
    name: "Cold Brew",
    description: "Smooth, refreshing cold brew steeped for 24 hours",
    price: 469,
    rating: 4.6,
    image: coldBrewImg,
    category: "cold",
    featured: true,
  },
  {
    id: "5",
    name: "Chocolate Mocha",
    description: "Espresso with chocolate and whipped cream",
    price: 519,
    rating: 4.8,
    image: mochaImg,
    category: "specialty",
  },
  {
    id: "6",
    name: "Flat White",
    description: "Velvety microfoam over a double shot of espresso",
    price: 479,
    rating: 4.7,
    image: flatWhiteImg,
    category: "hot",
  },
  {
    id: "7",
    name: "Iced Americano",
    description: "Espresso shots over ice with cold water",
    price: 439,
    rating: 4.5,
    image: icedAmericanoImg,
    category: "cold",
  },
];
