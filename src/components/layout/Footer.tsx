import { Coffee } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-primary" />
              <span className="text-lg font-playfair font-bold text-primary">
                BrewDrop
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Fresh brews, delivered to you. Premium coffee at your doorstep.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="text-muted-foreground hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-muted-foreground hover:text-primary transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">FAQ</li>
              <li className="text-muted-foreground">Contact Us</li>
              <li className="text-muted-foreground">Delivery Info</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Hours</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Mon-Fri: 7am - 8pm</li>
              <li>Sat-Sun: 8am - 9pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 BrewDrop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
