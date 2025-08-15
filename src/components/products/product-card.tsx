'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/shopify/services';
import type { ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, isItemInCart, getItemQuantity } = useCart();

  const firstVariant = product.variants.edges[0]?.node;
  const isInStock = product.availableForSale && firstVariant?.availableForSale;
  const isInCart = firstVariant ? isItemInCart(firstVariant.id) : false;
  const cartQuantity = firstVariant ? getItemQuantity(firstVariant.id) : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) return;
    
    try {
      await addItem(firstVariant.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const price = formatPrice(product.priceRange.minVariantPrice);
  const compareAtPrice = product.compareAtPriceRange.minVariantPrice.amount !== '0.0' 
    ? formatPrice(product.compareAtPriceRange.minVariantPrice)
    : null;

  return (
    <Link href={`/products/${product.handle}`}>
      <Card className={`group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg ${className}`}>
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-2">
              {!isInStock && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Out of Stock
                </Badge>
              )}
              {compareAtPrice && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Sale
                </Badge>
              )}
              {product.tags.includes('new') && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  New
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Implement wishlist functionality
                }}
              >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>

            {/* Quick Add to Cart */}
            {isInStock && (
              <div className="absolute bottom-2 left-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  onClick={handleAddToCart}
                  className="w-full"
                  size="sm"
                  disabled={!firstVariant}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isInCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start space-y-2 p-4">
          {/* Product Info */}
          <div className="w-full">
            <h3 className="line-clamp-2 text-sm font-medium leading-tight">
              {product.title}
            </h3>
            
            {product.vendor && (
              <p className="text-xs text-muted-foreground mt-1">
                {product.vendor}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">
              {price}
            </span>
            {compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {compareAtPrice}
              </span>
            )}
          </div>

          {/* Product Type */}
          {product.productType && (
            <Badge variant="outline" className="text-xs">
              {product.productType}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}