import { CartItem } from "@/types/coffee";

export interface SharedCart {
  items: CartItem[];
  sharedAt: number;
  sharedBy?: string;
}

const encodeCartData = (cartItems: CartItem[]): string => {
  const sharedCart: SharedCart = {
    items: cartItems,
    sharedAt: Date.now(),
  };

  const jsonString = JSON.stringify(sharedCart);
  // use encodeURIComponent to preserve unicode
  const encoded = btoa(encodeURIComponent(jsonString));

  return encoded;
};

const decodeCartData = (encoded: string): SharedCart | null => {
  try {
    const jsonString = decodeURIComponent(atob(encoded));
    const sharedCart: SharedCart = JSON.parse(jsonString);

    if (!sharedCart.items || !Array.isArray(sharedCart.items)) {
      return null;
    }

    return sharedCart;
  } catch (error) {
    console.error("Failed to decode cart data:", error);
    return null;
  }
};

const API_BASE = (typeof window !== 'undefined' && (window as any).API_BASE) || '/api';

export const generateShareableLink = (cartItems: CartItem[]): string => {
  const encoded = encodeCartData(cartItems);
  const baseUrl = window.location.origin;
  return `${baseUrl}?sharedCart=${encoded}`;
};

// Try to store encoded cart on the server and return a short code. If server fails, fall back to localStorage-based code.
export const generateShareCode = async (cartItems: CartItem[]): Promise<string> => {
  const encoded = encodeCartData(cartItems);

  // Attempt server save
  try {
    const res = await fetch(`${API_BASE}/shared-cart/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encoded }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.code;
    }
  } catch (err) {
    // ignore and fallback
    console.warn('Failed to save shared cart to server, falling back to localStorage', err);
  }

  // Local fallback
  const shortCode = encoded.slice(0, 12).toUpperCase();
  localStorage.setItem(`cart_share_${shortCode}`, encoded);
  return shortCode;
};

// Retrieve from server first, then localStorage fallback
export const retrieveCartFromCode = async (code: string): Promise<SharedCart | null> => {
  const key = `cart_share_${code.toUpperCase()}`;

  try {
    const res = await fetch(`${API_BASE}/shared-cart/${code}`);
    if (res.ok) {
      const data = await res.json();
      const decoded = decodeCartData(data.encoded);
      if (decoded) return decoded;
    }
  } catch (err) {
    console.warn('Failed to fetch shared cart from server, trying localStorage', err);
  }

  const encoded = localStorage.getItem(key);
  if (!encoded) return null;
  return decodeCartData(encoded);
};

export const CART_SYNC_EVENT = "cart-sync";

export const syncCartAcrossTabs = (cartItems: CartItem[]) => {
  const encoded = encodeCartData(cartItems);
  localStorage.setItem("current_cart_sync", encoded);

  // Note: don't dispatch synthetic storage events. Setting localStorage here
  // will trigger a native 'storage' event in other tabs/windows. The current
  // window does not receive a 'storage' event for its own changes, which is
  // desired to prevent self-rehydration loops.
};

export const listenForCartSync = (callback: (cartItems: CartItem[]) => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "current_cart_sync" && e.newValue) {
      const sharedCart = decodeCartData(e.newValue);
      if (sharedCart) {
        callback(sharedCart.items);
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};

export { decodeCartData };
