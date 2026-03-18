import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border bg-background">
        <SheetHeader className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Cart ({cartItems.length})
            </SheetTitle>
          </div>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2 text-foreground">Your cart is empty</h3>
            <p className="font-body text-sm text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button 
              variant="default" 
              className="font-body font-semibold tracking-wide"
              onClick={() => setIsCartOpen(false)}
            >
              START SHOPPING
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-24 h-24 bg-muted overflow-hidden shrink-0 border border-border">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between gap-2">
                          <h4 className="font-display text-sm font-semibold text-foreground line-clamp-2">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.size && (
                          <p className="font-body text-xs text-muted-foreground mt-1">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="font-body text-sm font-bold text-primary mt-2">
                          ৳{item.price}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-border mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center font-body text-xs font-semibold text-foreground border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-body text-sm font-bold text-foreground">
                          ৳{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="mt-auto border-t border-border p-6 bg-muted/30">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                  <span className="font-display text-lg font-bold text-foreground">৳{totalPrice}</span>
                </div>
                <p className="font-body text-xs text-muted-foreground italic">
                  Taxes and shipping calculated at checkout
                </p>
                <Button 
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/checkout");
                  }}
                  className="w-full h-12 bg-primary text-primary-foreground font-body text-sm font-bold tracking-widest hover:opacity-90 transition-opacity"
                >
                  CHECKOUT NOW
                </Button>
                <div className="flex justify-center">
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="font-body text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
