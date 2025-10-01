import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coffee, Package, Truck, CheckCircle2 } from "lucide-react";
import { Order } from "@/types/coffee";

const statusSteps = [
  { key: "brewing", label: "Brewing", icon: Coffee },
  { key: "packed", label: "Packed", icon: Package },
  { key: "delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
] as const;

const OrderTracking = () => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentOrder");
    if (stored) {
      const orderData = JSON.parse(stored);
      setOrder(orderData);

      // Simulate status progression
      const timer = setInterval(() => {
        setOrder((prev) => {
          if (!prev) return null;

          const currentIndex = statusSteps.findIndex(
            (s) => s.key === prev.status
          );
          if (currentIndex < statusSteps.length - 1) {
            return {
              ...prev,
              status: statusSteps[currentIndex + 1].key,
            };
          }
          return prev;
        });
      }, 5000);

      return () => clearInterval(timer);
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-8">
            <h2 className="text-2xl font-playfair font-bold mb-2">
              No Active Order
            </h2>
            <p className="text-muted-foreground">
              You don't have any orders to track right now
            </p>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const currentIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 max-w-3xl">
          <h1 className="text-4xl font-playfair font-bold mb-8">
            Track Your Order
          </h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Delivering to:</span>{" "}
                  {order.address}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {order.phone}
                </p>
                <p className="font-bold text-lg">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardContent className="pt-8">
              <div className="space-y-8">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground scale-110"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`absolute left-6 top-12 w-0.5 h-8 transition-colors ${
                              index < currentIndex
                                ? "bg-primary"
                                : "bg-muted"
                            }`}
                          />
                        )}
                      </div>

                      <div className="flex-1 pt-2">
                        <h3
                          className={`font-semibold ${
                            isCurrent ? "text-primary" : ""
                          }`}
                        >
                          {step.label}
                        </h3>
                        {isCurrent && (
                          <p className="text-sm text-muted-foreground animate-fade-in">
                            In progress...
                          </p>
                        )}
                        {index < currentIndex && (
                          <p className="text-sm text-accent">Completed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
