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
import { useEffect, useState } from "react";
import {
  getAllOrders,
  approveOrder,
  Order,
} from "@/data/orderStorage";
// Remove order utility (disapprove = mark as rejected, only if pending)
function disapproveOrder(orderId: string) {
  const orders = getAllOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return false;
  // Only allow rejecting if not approved
  if (orders[idx].approved) return false;
  orders[idx].rejected = true;
  orders[idx].approved = false;
  orders[idx].status = "rejected";
  localStorage.setItem("orders", JSON.stringify(orders));
  return true;
}
import { useAuth } from "@/contexts/AuthContext";


function getUserCount() {
  const usersData = localStorage.getItem("users");
  if (!usersData) return 0;
  const users = JSON.parse(usersData);
  // Exclude admin from active users
  return users.filter((u: any) => !u.isAdmin).length;
}

function getOrderStats(orders) {
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => o.approved ? sum + o.total : sum, 0);
  const activeUsers = Array.from(new Set(orders.map((o) => o.userId))).length;
  // Only count rejected orders that were never approved
  const rejectedOrders = orders.filter((o) => o.rejected && !o.approved).length;
  // Growth is a placeholder: percent of orders approved this week vs last week
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(now.getDate() - 14);
  const ordersThisWeek = orders.filter((o) => new Date(o.createdAt) >= weekAgo && o.approved).length;
  const ordersLastWeek = orders.filter((o) => new Date(o.createdAt) < weekAgo && new Date(o.createdAt) >= twoWeeksAgo && o.approved).length;
  let growth = 0;
  if (ordersLastWeek > 0) {
    growth = ((ordersThisWeek - ordersLastWeek) / ordersLastWeek) * 100;
  } else if (ordersThisWeek > 0) {
    growth = 100;
  }
  return {
    totalOrders,
    revenue,
    activeUsers,
    growth: Math.round(growth),
    rejectedOrders,
  };
}

const Admin = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0,
    growth: 0,
    rejectedOrders: 0,
  });

  useEffect(() => {
    const allOrders = getAllOrders();
    setOrders(allOrders);
    setStats({
      ...getOrderStats(allOrders),
      activeUsers: getUserCount(),
    });
    setLoading(false);
  }, []);

  const handleApprove = (orderId: string) => {
    approveOrder(orderId);
    const updatedOrders = getAllOrders();
    setOrders(updatedOrders);
    setStats({
      ...getOrderStats(updatedOrders),
      activeUsers: getUserCount(),
    });
  };

  const handleDisapprove = (orderId: string) => {
    disapproveOrder(orderId);
    const updatedOrders = getAllOrders();
    setOrders(updatedOrders);
    setStats({
      ...getOrderStats(updatedOrders),
      activeUsers: getUserCount(),
    });
  };


  const getStatusColor = (order: Order) => {
    if (!order.approved) return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300";
    if (order.status === "delivered") return "bg-green-500/20 text-green-700 dark:text-green-300";
    if (order.status === "approved") return "bg-blue-500/20 text-blue-700 dark:text-blue-300";
    return "bg-gray-400/20 text-gray-700 dark:text-gray-300";
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2">You must be an admin to view this page.</p>
      </div>
    );
  }

  // Split orders into pending and approved
  const pendingOrders = orders.filter((o) => !o.approved && !o.rejected);
  const approvedOrders = orders.filter((o) => o.approved);
  // Only show rejected orders that were never approved
  const rejectedOrders = orders.filter((o) => o.rejected && !o.approved);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
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
                    <p className="text-3xl font-bold mt-2">₹{stats.revenue.toFixed(2)}</p>
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
                    <p className="text-3xl font-bold mt-2">{stats.activeUsers}</p>
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
                    <p className="text-sm text-muted-foreground">Growth</p>
                    <p className="text-3xl font-bold mt-2">{stats.growth}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected Orders</p>
                    <p className="text-3xl font-bold mt-2">{stats.rejectedOrders}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="h-6 w-6 text-primary">❌</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

                    {/* Pending Orders */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingOrders.length === 0 ? (
                <p className="text-muted-foreground">No pending orders.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>User ID</TableHead>
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
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>
                          {order.items.map((item, idx) => (
                            <span key={idx} className="block">
                              {item.name} x{item.quantity}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>₹{order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(order)}>
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right flex gap-2 justify-end">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(order.id)}
                          >
                            <CheckCircle2 className="inline w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDisapprove(order.id)}
                          >
                            Disapprove
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
                <p className="text-muted-foreground">No approved orders yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>
                          {order.items.map((item, idx) => (
                            <span key={idx} className="block">
                              {item.name} x{item.quantity}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>₹{order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(order)}>
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {/* Disapprove button only for pending orders, not approved */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          <br/>
          {/* Rejected Orders Table (optional) */}
          {rejectedOrders.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Rejected Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>
                          {order.items.map((item, idx) => (
                            <span key={idx} className="block">
                              {item.name} x{item.quantity}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>₹{order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-500/20 text-red-700 dark:text-red-300">
                            Rejected
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}


        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
