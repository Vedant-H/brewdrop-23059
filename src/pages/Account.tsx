import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, MapPin, Phone, Mail } from "lucide-react";

// Mock user data and order history
const mockUser = {
  name: "Sarah Johnson",
  email: "sarah.j@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Coffee Street, Brew City, BC 12345",
};

const mockOrders = [
  {
    id: "ORD001",
    date: "2024-01-15",
    items: ["Caramel Latte", "Chocolate Mocha"],
    total: 12.48,
    status: "Delivered",
  },
  {
    id: "ORD002",
    date: "2024-01-14",
    items: ["Cold Brew", "Classic Cappuccino"],
    total: 10.48,
    status: "Delivered",
  },
  {
    id: "ORD003",
    date: "2024-01-12",
    items: ["Double Espresso", "Flat White"],
    total: 9.28,
    status: "Delivered",
  },
];

const Account = () => {
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
                      {mockUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-playfair font-bold">
                      {mockUser.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Coffee Enthusiast
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </div>

                <div className="mt-6 space-y-3 pt-6 border-t">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>{mockUser.email}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>{mockUser.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>{mockUser.address}</span>
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
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-lg border bg-card hover-lift"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Order {order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent-foreground">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {order.items.join(", ")}
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-bold text-primary">
                          ${order.total.toFixed(2)}
                        </span>
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
