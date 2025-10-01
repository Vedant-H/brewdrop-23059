import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CoffeeCard } from "@/components/coffee/CoffeeCard";
import { coffeeItems } from "@/data/coffeeData";
import { Button } from "@/components/ui/button";

type CategoryFilter = "all" | "hot" | "cold" | "specialty";

const Menu = () => {
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const filteredItems =
    filter === "all"
      ? coffeeItems
      : coffeeItems.filter((item) => item.category === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4">
          <div className="text-center space-y-3 mb-12">
            <h1 className="text-5xl font-playfair font-bold">Our Menu</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our selection of handcrafted coffee drinks
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All Drinks
            </Button>
            <Button
              variant={filter === "hot" ? "default" : "outline"}
              onClick={() => setFilter("hot")}
            >
              Hot Coffee
            </Button>
            <Button
              variant={filter === "cold" ? "default" : "outline"}
              onClick={() => setFilter("cold")}
            >
              Cold Drinks
            </Button>
            <Button
              variant={filter === "specialty" ? "default" : "outline"}
              onClick={() => setFilter("specialty")}
            >
              Specialty
            </Button>
          </div>

          {/* Coffee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <CoffeeCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
