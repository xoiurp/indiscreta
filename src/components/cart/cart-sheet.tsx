'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, ExternalLink } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/shopify/services';

export function CartSheet() {
  const {
    cart,
    isOpen,
    closeCart,
    isLoading,
    updateItem,
    removeItem,
    getItemCount,
    getSubtotal,
  } = useCart();

  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(lineId);
    } else {
      await updateItem(lineId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0 
              ? "Your cart is empty"
              : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`
            }
          </SheetDescription>
        </SheetHeader>

        {itemCount === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start shopping to add items to your cart.
              </p>
              <Button asChild className="mt-4" onClick={closeCart}>
                <Link href="/products">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4">
                {cart?.lines.edges.map(({ node: line }) => {
                  const merchandise = line.merchandise;
                  const product = 'product' in merchandise ? merchandise.product : null;
                  
                  return (
                    <div key={line.id} className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        {merchandise.image ? (
                          <Image
                            src={merchandise.image.url}
                            alt={merchandise.image.altText || merchandise.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-muted">
                            <span className="text-xs text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-medium line-clamp-2">
                            {product?.title || merchandise.title}
                          </h4>
                          
                          {merchandise.selectedOptions.length > 0 && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              {merchandise.selectedOptions
                                .map(option => `${option.name}: ${option.value}`)
                                .join(', ')}
                            </div>
                          )}

                          <div className="mt-2 text-sm font-semibold">
                            {formatPrice(line.cost.totalAmount)}
                            {line.quantity > 1 && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({formatPrice(merchandise.price)} each)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(line.id, line.quantity - 1)}
                              disabled={isLoading}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            
                            <span className="text-sm font-medium w-8 text-center">
                              {line.quantity}
                            </span>
                            
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => handleQuantityChange(line.id, line.quantity + 1)}
                              disabled={isLoading}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(line.id)}
                            disabled={isLoading}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Cart Summary */}
            <div className="border-t px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{subtotal}</span>
                </div>

                {cart?.cost.totalTaxAmount && cart.cost.totalTaxAmount.amount !== '0.0' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(cart.cost.totalTaxAmount)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-lg font-bold">
                    {cart?.cost.totalAmount ? formatPrice(cart.cost.totalAmount) : subtotal}
                  </span>
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                    disabled={!cart?.checkoutUrl || isLoading}
                  >
                    Checkout
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    asChild 
                    className="w-full"
                    onClick={closeCart}
                  >
                    <Link href="/products">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}