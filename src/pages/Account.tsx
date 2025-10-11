import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/types/coffee";
import { toast } from "sonner";

const Account = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.error("Please login to view your account");
      navigate("/login");
      return;
    }

    // Get user's orders from localStorage
    const ordersData = localStorage.getItem("orders");
    if (ordersData && user) {
      const allOrders = JSON.parse(ordersData);
      
      // Filter orders for current user only
      const currentUserOrders = allOrders.filter(
        (o: Order & { userId: string }) => o.userId === user.id
      );
      
      // Sort by date (newest first)
      currentUserOrders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setUserOrders(currentUserOrders);
    }
  }, [user, isAuthenticated, navigate]);

  if (!user) {
    return null; // Will redirect to login
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 max-w-4xl">
          <h1 className="text-4xl font-playfair font-bold mb-8">My Account</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl font-playfair bg-primary text-primary-foreground">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-playfair font-bold">
                      {user.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Coffee Enthusiast
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Edit Profile
                  </Button>
                </div>

                <div className="mt-6 space-y-3 pt-6 border-t">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Member since {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order History */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {userOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No orders yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate("/menu")}
                    >
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 rounded-lg border bg-card hover-lift"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <span className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent-foreground capitalize">
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {order.items.map(item => `${item.name} x${item.quantity}`).join(", ")}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="font-bold text-primary">
                            ₹{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
