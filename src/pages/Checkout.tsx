import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod');
  const [loading, setLoading] = useState(false);
  const API_URL = 'http://localhost:5000';

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to checkout");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !phone) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!user) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    // Create order object (status depends on payment method)
    const orderId = Math.random().toString(36).substring(7);
    const order = {
      id: orderId,
      userId: user.id,
      userEmail: user.email,
      items: cartItems,
      total: cartTotal,
      status: paymentMethod === 'cod' ? 'brewing' : 'pending_payment',
      createdAt: new Date().toISOString(),
      address,
      phone,
    };

    // Persist order locally
    const ordersData = localStorage.getItem("orders");
    const orders = ordersData ? JSON.parse(ordersData) : [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("currentOrder", JSON.stringify(order));

    if (paymentMethod === 'cod') {
      // Cash on Delivery: clear cart and navigate to tracking
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/tracking");
      return;
    }

    // Stripe flow: call server route defined in server/index.js
    setLoading(true);
    fetch(`${API_URL}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, userId: user.id, items: cartItems, total: cartTotal, address, phone }),
    })
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        let body: any = null;
        if (contentType.includes('application/json')) {
          body = await res.json().catch(() => null);
        } else {
          body = await res.text().catch(() => null);
        }

        if (!res.ok) {
          const msg = body && (body.details || body.error || JSON.stringify(body))
            ? (body.details || body.error || JSON.stringify(body))
            : 'Failed to create checkout session';
          throw new Error(msg);
        }

        const data = body;
        // Clear cart and redirect to Stripe checkout
        clearCart();
        window.location.href = data.url || `/tracking`;
      })
      .catch((err) => {
        console.error('Stripe session error:', err);
        toast.error(`Payment initialization failed: ${err?.message || err}`);
      })
      .finally(() => setLoading(false));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-playfair font-bold">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground">
                Add some items to your cart before checking out
              </p>
              <Button onClick={() => navigate("/menu")}>Go to Menu</Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4 max-w-4xl">
          <h1 className="text-4xl font-playfair font-bold mb-8">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Form */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Coffee Street, Brew City"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <div className="p-4 bg-secondary rounded-lg space-y-3">
                      <label className="flex items-center gap-3 p-3 bg-white/50 rounded">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Cash on Delivery</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-white/50 rounded">
                        <input
                          type="radio"
                          name="payment"
                          value="stripe"
                          checked={paymentMethod === 'stripe'}
                          onChange={() => setPaymentMethod('stripe')}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Pay with Card (Stripe)</span>
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
                    <CheckCircle2 className="h-5 w-5" />
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span className="text-accent">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">₹{cartTotal.toFixed(2)}</span>
                  </div>
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

export default Checkout;
