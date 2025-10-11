import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Truck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-coffee.jpg";
import { CoffeeCard } from "@/components/coffee/CoffeeCard";
import { coffeeItems } from "@/data/coffeeData";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StaticChatbot } from "@/components/StaticChatbot";
import { useSharedCartLoader } from "@/hooks/useSharedCartLoader";
import { useCart } from "@/contexts/CartContext";
import { useState, useCallback } from "react";
import { CartItem } from "@/types/coffee";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Index = () => {
  const featuredItems = coffeeItems.filter((item) => item.featured);
  const { loadCartItems } = useCart();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [pendingCartItems, setPendingCartItems] = useState<CartItem[]>([]);

  const handleCartReceived = useCallback(
    (items: CartItem[], showPrompt: boolean) => {
      if (showPrompt) {
        setPendingCartItems(items);
        setShowImportDialog(true);
      }
    },
    []
  );

  useSharedCartLoader(handleCartReceived);

  const handleImportConfirm = () => {
    loadCartItems(pendingCartItems);
    toast.success(`Imported ${pendingCartItems.length} item(s) to your cart!`);
    setShowImportDialog(false);
    setPendingCartItems([]);
  };

  const handleImportCancel = () => {
    setShowImportDialog(false);
    setPendingCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>

        <div className="relative z-10 container px-4 text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white leading-tight">
            Fresh Brews,
            <br />
            Delivered to You
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Premium coffee from your favorite café, delivered to your doorstep
            in minutes
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg" className="gap-2 text-lg">
                Order Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
                <Coffee className="h-8 w-8" />
              </div>
              <h3 className="font-playfair font-semibold text-xl">
                Premium Quality
              </h3>
              <p className="text-muted-foreground">
                Handcrafted by expert baristas using the finest beans
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-playfair font-semibold text-xl">
                Fast Delivery
              </h3>
              <p className="text-muted-foreground">
                Get your coffee delivered hot and fresh in 30 minutes or less
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="font-playfair font-semibold text-xl">
                Track Orders
              </h3>
              <p className="text-muted-foreground">
                Real-time tracking so you know exactly when your coffee arrives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Specials */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-4xl font-playfair font-bold">Daily Specials</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Today's featured drinks, crafted with love by our baristas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredItems.map((item) => (
              <CoffeeCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/menu">
              <Button variant="outline" size="lg" className="gap-2">
                View Full Menu <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Shared Cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Someone shared a cart with you containing {pendingCartItems.length}{" "}
              item(s). Would you like to import these items to your cart? This
              will replace your current cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleImportCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleImportConfirm}>
              Import Cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
