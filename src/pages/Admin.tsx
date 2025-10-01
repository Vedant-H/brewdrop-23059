import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, Users, TrendingUp } from "lucide-react";

const mockStats = [
  { label: "Total Orders", value: "156", icon: Package, trend: "+12%" },
  { label: "Revenue", value: "$2,847", icon: DollarSign, trend: "+8%" },
  { label: "Active Users", value: "89", icon: Users, trend: "+15%" },
  { label: "Growth", value: "23%", icon: TrendingUp, trend: "+5%" },
];

const mockOrders = [
  {
    id: "ORD123",
    customer: "John Doe",
    items: 3,
    total: 18.97,
    status: "brewing",
  },
  {
    id: "ORD124",
    customer: "Jane Smith",
    items: 2,
    total: 11.98,
    status: "delivery",
  },
  {
    id: "ORD125",
    customer: "Mike Johnson",
    items: 1,
    total: 5.99,
    status: "packed",
  },
  {
    id: "ORD126",
    customer: "Sarah Williams",
    items: 4,
    total: 24.96,
    status: "delivered",
  },
];

const Admin = () => {
  const getStatusColor = (status: string) => {
    const colors = {
      brewing: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      packed: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
      delivery: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
      delivered: "bg-green-500/20 text-green-700 dark:text-green-300",
    };
    return colors[status as keyof typeof colors] || "";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-muted/30">
        <div className="container px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-playfair font-bold">
              Admin Dashboard
            </h1>
            <Button>Download Report</Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mockStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                        <p className="text-sm text-accent mt-1">{stat.trend}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(order.status)}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
