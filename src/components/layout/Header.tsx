import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { Cart } from "@/components/cart/Cart";

export const Header = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <Coffee className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="text-xl font-playfair font-bold text-primary">
              BrewDrop
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/menu") ? "text-primary" : "text-foreground/60"
              }`}
            >
              Menu
            </Link>
            <Link
              to="/tracking"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/tracking") ? "text-primary" : "text-foreground/60"
              }`}
            >
              Track Order
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Link to="/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
