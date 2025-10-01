import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { coffeeItems } from "@/data/coffeeData";
import { addOrder } from "@/data/orderStorage";

const staticAnswers: Record<string, string> = {
  "hello": "Hello! How can I help you today?",
  "hi": "Hi there! What can I do for you?",
  "order": "To place an order, click on the 'Order Now' button or visit our menu.",
  "menu": "You can view our menu by clicking the 'View Full Menu' button.",
  "track": "To track your order, go to the 'Track Orders' section in your account.",
  "specials": "Check out our Daily Specials section for today's featured drinks!",
  "contact": "You can contact us via the support email on our website.",
  "bye": "Goodbye! Have a great day!",
};


export function StaticChatbot() {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm BrewBot. Ask me anything about our coffee shop!" },
  ]);
  // For deferred order after login
  const pendingOrderRef = useRef<{ itemName: string; quantity: number } | null>(null);

  // Helper: Try to extract coffee item and quantity from user input
  function parseOrderIntent(text: string): { itemName: string; quantity: number } | null {
    // Look for coffee item name in input
    const lower = text.toLowerCase();
    for (const item of coffeeItems) {
      if (lower.includes(item.name.toLowerCase())) {
        // Try to extract quantity (e.g. "2 caramel latte")
        const qtyMatch = lower.match(new RegExp(`(\\d+)\\s*${item.name.toLowerCase()}`));
        const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 1;
        return { itemName: item.name, quantity };
      }
    }
    // Also match generic 'order' or 'coffee' intent
    if (lower.includes("order") || lower.includes("coffee")) {
      return { itemName: "", quantity: 1 };
    }
    return null;
  }

  // Place order for user
  function placeOrder(itemName: string, quantity: number) {
    let item = coffeeItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    if (!item && itemName === "") item = coffeeItems[0]; // fallback to first item
    if (!item) return false;
    const order = {
      id: Math.random().toString(36).substring(2, 10),
      userId: user?.id || "",
      items: [{ name: item.name, quantity, price: item.price }],
      total: item.price * quantity,
      status: "pending",
      createdAt: new Date().toISOString(),
      approved: false,
    };
    addOrder(order);
    return true;
  }

  // On mount or login, check if a pending order should be placed
  useEffect(() => {
    if (isAuthenticated && pendingOrderRef.current) {
      const { itemName, quantity } = pendingOrderRef.current;
      const success = placeOrder(itemName, quantity);
      setMessages(msgs => [
        ...msgs,
        { from: "bot", text: success ? `Order placed for ${quantity} ${itemName || coffeeItems[0].name}!` : "Sorry, could not place your order." }
      ]);
      pendingOrderRef.current = null;
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    // Check for order intent
    const orderIntent = parseOrderIntent(input);
    if (orderIntent) {
      if (!isAuthenticated) {
        // Save intent and direct to login
        pendingOrderRef.current = orderIntent;
        setMessages(msgs => [
          ...msgs,
          userMsg,
          { from: "bot", text: "Please login to place your order. Redirecting you to login..." }
        ]);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1200);
        setInput("");
        return;
      } else {
        // Place order immediately
        const success = placeOrder(orderIntent.itemName, orderIntent.quantity);
        setMessages(msgs => [
          ...msgs,
          userMsg,
          { from: "bot", text: success ? `Order placed for ${orderIntent.quantity} ${orderIntent.itemName || coffeeItems[0].name}!` : "Sorry, could not place your order." }
        ]);
        setInput("");
        return;
      }
    }
    // Check for menu intent
    if (/\b(menu|show.*menu|what.*menu|see.*menu)\b/i.test(input)) {
      setMessages(msgs => [
        ...msgs,
        userMsg,
        { from: "bot", text: "Taking you to the menu page..." }
      ]);
      setTimeout(() => {
        window.location.href = "/menu";
      }, 1200);
      setInput("");
      return;
    }
    // Fallback to static answers
    let answer = "Sorry, I don't understand. Try asking about menu, order, or tracking.";
    for (const key in staticAnswers) {
      if (input.toLowerCase().includes(key)) {
        answer = staticAnswers[key];
        break;
      }
    }
    setMessages((msgs) => [...msgs, userMsg, { from: "bot", text: answer }]);
    setInput("");
  }

  return (
    <div>
      <div
        className="fixed bottom-6 right-6 z-50"
        style={{ pointerEvents: open ? "auto" : "all" }}
      >
        {!open && (
          <button
            className="bg-primary text-white rounded-full shadow-lg p-4 hover:scale-105 transition-transform"
            onClick={() => setOpen(true)}
            title="Chat with BrewBot"
          >
            <span role="img" aria-label="chatbot">🤖</span>
          </button>
        )}
        {open && (
          <div className="w-80 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
            <div className="bg-primary text-white px-4 py-2 flex items-center justify-between">
              <span>BrewBot</span>
              <button onClick={() => setOpen(false)} className="text-white">✕</button>
            </div>
            <div className="flex-1 p-3 space-y-2 overflow-y-auto" style={{ maxHeight: 300 }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.from === "bot"
                      ? "text-left text-sm bg-gray-100 rounded-lg p-2 mb-1"
                      : "text-right text-sm bg-primary/10 rounded-lg p-2 mb-1"
                  }
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="flex border-t">
              <input
                className="flex-1 px-3 py-2 outline-none"
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="px-4 text-primary font-bold">Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
