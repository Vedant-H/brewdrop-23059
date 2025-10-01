import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Package, DollarSign, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { Order } from "@/types/coffee";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [approvedOrders, setApprovedOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Redirect to login if not authenticated or not admin
    if (!isAuthenticated || !user?.isAdmin) {
      toast.error("Access denied. Admin only.");
      navigate("/login");
      return;
    }

    loadOrders();
  }, [isAuthenticated, user, navigate]);

  const loadOrders = () => {
    const ordersData = localStorage.getItem("orders");
    if (ordersData) {
      const orders: Order[] = JSON.parse(ordersData);
      setAllOrders(orders);
      setPendingOrders(orders.filter((o) => !o.approved));
      setApprovedOrders(orders.filter((o) => o.approved));
    }
  };

  const handleApproveOrder = (orderId: string) => {
    const ordersData = localStorage.getItem("orders");
    if (!ordersData) return;

    const orders: Order[] = JSON.parse(ordersData);
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, approved: true } : order
    );

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    loadOrders();
    toast.success("Order approved successfully!");
  };

  const getStatusColor = (status: string) => {
    const colors = {
      brewing: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      packed: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
      delivery: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
      delivered: "bg-green-500/20 text-green-700 dark:text-green-300",
    };
    return colors[status as keyof typeof colors] || "";
  };

  if (!user?.isAdmin) {
    return null;
  }

  const totalRevenue = approvedOrders.reduce((sum, order) => sum + order.total, 0);
  const uniqueUsers = new Set(approvedOrders.map((o) => o.userId)).size;

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
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold mt-2">{allOrders.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-3xl font-bold mt-2">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-3xl font-bold mt-2">{uniqueUsers}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold mt-2">{pendingOrders.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Orders */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pending Orders (Awaiting Approval)</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingOrders.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No pending orders
                </p>
              ) : (
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
                    {pendingOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.userEmail}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
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
                          <Button
                            size="sm"
                            onClick={() => handleApproveOrder(order.id)}
                            className="gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Approved Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Approved Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {approvedOrders.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No approved orders yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.userEmail}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(order.status)}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
