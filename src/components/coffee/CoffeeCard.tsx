import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CoffeeItem } from "@/types/coffee";
import { useCart } from "@/contexts/CartContext";

interface CoffeeCardProps {
  item: CoffeeItem;
}

export const CoffeeCard = ({ item }: CoffeeCardProps) => {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden hover-lift group">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-playfair font-semibold text-lg">{item.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-sm font-medium">{item.rating}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            ₹{item.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => addToCart(item)}
          >
            <Plus className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
