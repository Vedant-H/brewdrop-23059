import { useState } from "react";
import { Download, Link as LinkIcon, Code, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CartItem } from "@/types/coffee";
import {
  decodeCartData,
  retrieveCartFromCode,
  SharedCart,
} from "@/utils/cartSharing";
import { toast } from "sonner";

interface ImportCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: CartItem[]) => void;
}

export const ImportCartModal = ({
  isOpen,
  onClose,
  onImport,
}: ImportCartModalProps) => {
  const [linkInput, setLinkInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [previewCart, setPreviewCart] = useState<SharedCart | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePreviewFromLink = () => {
    setError("");
    try {
      const url = new URL(linkInput);
      const sharedCartParam = url.searchParams.get("sharedCart");

      if (!sharedCartParam) {
        setError("Invalid share link. No cart data found.");
        return;
      }

      const cart = decodeCartData(sharedCartParam);
      if (!cart) {
        setError("Failed to decode cart data. The link may be corrupted.");
        return;
      }

      setPreviewCart(cart);
      toast.success("Cart loaded successfully!");
    } catch (err) {
      setError("Invalid URL format. Please check the link and try again.");
    }
  };

  const handlePreviewFromCode = () => {
    setError("");
    setPreviewCart(null);
    setLoading(true);

    retrieveCartFromCode(codeInput)
      .then((cart) => {
        if (!cart) {
          setError("Invalid code. Please check the code and try again.");
          return;
        }

        setPreviewCart(cart);
        toast.success("Cart loaded successfully!");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to retrieve cart. Try again later.");
      })
      .finally(() => setLoading(false));
  };

  const handleImportCart = () => {
    if (!previewCart) return;

    onImport(previewCart.items);
    toast.success(
      `Imported ${previewCart.items.length} item(s) to your cart!`
    );
    handleClose();
  };

  const handleClose = () => {
    setLinkInput("");
    setCodeInput("");
    setPreviewCart(null);
    setError("");
    onClose();
  };

  const getTotalPrice = () => {
    if (!previewCart) return 0;
    return previewCart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    if (!previewCart) return 0;
    return previewCart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Import Shared Cart
          </DialogTitle>
          <DialogDescription>
            Import a cart shared by a friend using a link or code.
          </DialogDescription>
        </DialogHeader>

        {!previewCart ? (
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link">From Link</TabsTrigger>
              <TabsTrigger value="code">From Code</TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-input">Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="link-input"
                    placeholder="Paste the share link here..."
                    value={linkInput}
                    onChange={(e) => {
                      setLinkInput(e.target.value);
                      setError("");
                    }}
                  />
                  <Button onClick={handlePreviewFromLink}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Load
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code-input">Share Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code-input"
                    placeholder="Enter the share code..."
                    value={codeInput}
                    onChange={(e) => {
                      // allow pasting with spaces and trim
                      setCodeInput(e.target.value.replace(/\s+/g, '').toUpperCase());
                      setError("");
                    }}
                    className="text-center text-lg font-mono tracking-wider"
                    maxLength={12}
                  />
                  <Button onClick={handlePreviewFromCode} disabled={loading}>
                    {loading ? 'Loading...' : (
                      <>
                        <Code className="h-4 w-4 mr-2" />
                        Load
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Review the cart items below before importing. This will add{" "}
                {getTotalItems()} item(s) to your current cart.
              </AlertDescription>
            </Alert>

            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-3">
              {previewCart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-secondary/30 rounded-md p-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-sm">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="font-semibold">Total:</span>
              <span className="text-lg font-bold text-primary">
                ₹{getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="gap-2">
          {previewCart ? (
            <>
              <Button variant="outline" onClick={() => setPreviewCart(null)}>
                Back
              </Button>
              <Button onClick={handleImportCart}>Import to My Cart</Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
