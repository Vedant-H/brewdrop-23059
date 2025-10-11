import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { decodeCartData } from "@/utils/cartSharing";
import { CartItem } from "@/types/coffee";

export const useSharedCartLoader = (
  onCartReceived: (items: CartItem[], showPrompt: boolean) => void
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const sharedCartParam = searchParams.get("sharedCart");

    if (sharedCartParam) {
      const sharedCart = decodeCartData(sharedCartParam);

      if (sharedCart && sharedCart.items.length > 0) {
        onCartReceived(sharedCart.items, true);

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("sharedCart");
        setSearchParams(newSearchParams, { replace: true });
      }
    }
  }, [searchParams, setSearchParams, onCartReceived]);
};
