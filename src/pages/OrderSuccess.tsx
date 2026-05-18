import { useParams, Link } from "react-router-dom";
import { useOrder } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/woocommerce/helpers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, MapPin, CreditCard, Loader2 } from "lucide-react";

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading } = useOrder(orderId ? Number(orderId) : undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-16 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Order Confirmed!
          </h1>
          <p className="font-body text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          {order && (
            <div className="mt-4 inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full text-sm font-body">
              <span className="text-muted-foreground">Order #</span>
              <span className="font-bold text-foreground">{order.number}</span>
            </div>
          )}
        </div>

        {order && (
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Details
              </h2>
              <div className="space-y-3">
                {order.line_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.image?.src && (
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0">
                        <img src={item.image.src} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-body text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="font-body text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-body text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border space-y-2 font-body text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shipping_total)}</span>
                </div>
                {parseFloat(order.discount_total) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount_total)}</span>
                  </div>
                )}
                <div className="flex justify-between font-display font-bold text-base text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Delivery Address
                </h3>
                <div className="font-body text-sm text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">{order.billing.first_name} {order.billing.last_name}</p>
                  <p>{order.billing.address_1}</p>
                  <p>{order.billing.city}, {order.billing.state}</p>
                  <p>{order.billing.phone}</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Payment Method
                </h3>
                <div className="font-body text-sm text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground">{order.payment_method_title}</p>
                  <span className={`inline-block text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                    order.status === "processing" ? "bg-blue-100 text-blue-700"
                    : order.status === "completed" ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link to="/products" className="flex-1">
            <Button className="w-full h-12 font-body font-semibold tracking-wide">
              CONTINUE SHOPPING
            </Button>
          </Link>
          <Link to="/profile" className="flex-1">
            <Button variant="outline" className="w-full h-12 font-body font-semibold tracking-wide">
              VIEW MY ORDERS
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
