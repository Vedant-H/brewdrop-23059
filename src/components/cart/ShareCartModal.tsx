import { useState } from "react";
import { Copy, Check, Share2, Code } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { CartItem } from "@/types/coffee";
import { generateShareableLink, generateShareCode } from "@/utils/cartSharing";
import { toast } from "sonner";

interface ShareCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

export const ShareCartModal = ({
  isOpen,
  onClose,
  cartItems,
}: ShareCartModalProps) => {
  const [shareLink, setShareLink] = useState("");
  const [shareCode, setShareCode] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);

  const handleGenerateLink = () => {
    const link = generateShareableLink(cartItems);
    setShareLink(link);
    toast.success("Share link generated!");
  };

  const handleGenerateCode = () => {
    setLoadingCode(true);
    generateShareCode(cartItems)
      .then((code) => {
        setShareCode(code);
        toast.success("Share code generated!");
      })
      .catch(() => {
        toast.error("Failed to generate share code");
      })
      .finally(() => setLoadingCode(false));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCodeCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShareLink("");
      setShareCode("");
      setLinkCopied(false);
      setCodeCopied(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Cart
          </DialogTitle>
          <DialogDescription>
            Share your cart with friends so they can view or import your items.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="code">Share Code</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label>Shareable Link</Label>
              <p className="text-sm text-muted-foreground">
                Generate a link that contains your cart data. Anyone with this
                link can view and import your cart.
              </p>
            </div>

            {!shareLink ? (
              <Button onClick={handleGenerateLink} className="w-full">
                Generate Link
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input value={shareLink} readOnly className="flex-1" />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this link with your friends via email, messaging apps,
                  or social media.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="space-y-2">
              <Label>Share Code</Label>
              <p className="text-sm text-muted-foreground">
                Generate a short code that your friends can enter to import your
                cart.
              </p>
            </div>

            {!shareCode ? (
              <Button onClick={handleGenerateCode} className="w-full" disabled={loadingCode}>
                {loadingCode ? 'Generating...' : (
                  <>
                    <Code className="h-4 w-4 mr-2" />
                    Generate Code
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={shareCode}
                    readOnly
                    className="flex-1 text-center text-2xl font-mono font-bold tracking-wider"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyCode}
                  >
                    {codeCopied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your friends can enter this code in the "Import Cart" section
                  to load your cart.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
