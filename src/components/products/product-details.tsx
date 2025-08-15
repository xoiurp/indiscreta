'use client';

import { useState, useMemo } from 'react';
import { Star, ShoppingCart, Heart, Share, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductGallery } from './product-gallery';
import { useCart } from '@/context/cart-context';
import { formatPrice, getProductVariant } from '@/lib/shopify/services';
import type { ShopifyProduct, ShopifyImage, ShopifyProductVariant } from '@/types/shopify';

interface ProductDetailsProps {
  product: ShopifyProduct;
  images: ShopifyImage[];
  variants: ShopifyProductVariant[];
}

export function ProductDetails({ product, images, variants }: ProductDetailsProps) {
  const { addItem, isItemInCart, getItemQuantity } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get selected variant based on selected options
  const selectedVariant = useMemo(() => {
    if (Object.keys(selectedOptions).length === 0 && variants.length > 0) {
      return variants[0]; // Default to first variant
    }
    return getProductVariant(product, selectedOptions);
  }, [product, selectedOptions, variants]);

  // Initialize selected options with first available variant
  useState(() => {
    if (variants.length > 0 && Object.keys(selectedOptions).length === 0) {
      const firstVariant = variants[0];
      const initialOptions: Record<string, string> = {};
      firstVariant.selectedOptions.forEach(option => {
        initialOptions[option.name] = option.value;
      });
      setSelectedOptions(initialOptions);
    }
  });

  const isInStock = selectedVariant?.availableForSale || false;
  const isInCart = selectedVariant ? isItemInCart(selectedVariant.id) : false;
  const cartQuantity = selectedVariant ? getItemQuantity(selectedVariant.id) : 0;

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAddingToCart(true);
    try {
      await addItem(selectedVariant.id, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const price = selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.priceRange.minVariantPrice);
  const compareAtPrice = selectedVariant?.compareAtPrice?.amount !== '0.0' 
    ? formatPrice(selectedVariant.compareAtPrice!)
    : null;

  const isOnSale = compareAtPrice !== null;
  const savingsAmount = isOnSale && selectedVariant?.compareAtPrice 
    ? parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)
    : 0;
  const savingsPercentage = isOnSale && selectedVariant?.compareAtPrice 
    ? Math.round((savingsAmount / parseFloat(selectedVariant.compareAtPrice.amount)) * 100)
    : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Product Gallery */}
      <div className="lg:sticky lg:top-8">
        <ProductGallery 
          images={images}
          productTitle={product.title}
        />
      </div>

      {/* Product Information */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
              {product.vendor && (
                <p className="text-lg text-muted-foreground mt-1">by {product.vendor}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-3xl font-bold">{price}</span>
            {compareAtPrice && (
              <div className="flex items-center space-x-2">
                <span className="text-xl text-muted-foreground line-through">
                  {compareAtPrice}
                </span>
                <Badge variant="destructive">
                  {savingsPercentage}% OFF
                </Badge>
              </div>
            )}
          </div>

          {isOnSale && (
            <p className="text-sm text-green-600 mt-1">
              You save {formatPrice({ amount: savingsAmount.toString(), currencyCode: selectedVariant?.price.currencyCode || 'USD' })}
            </p>
          )}
        </div>

        {/* Stock Status */}
        <Alert className={isInStock ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={isInStock ? "text-green-800" : "text-red-800"}>
            {isInStock ? (
              <>In stock and ready to ship</>
            ) : (
              <>Currently out of stock</>
            )}
          </AlertDescription>
        </Alert>

        {/* Product Options */}
        {product.options.length > 0 && (
          <div className="space-y-4">
            {product.options.map((option) => (
              <div key={option.id}>
                <Label className="text-base font-medium">{option.name}</Label>
                <RadioGroup
                  value={selectedOptions[option.name] || ''}
                  onValueChange={(value) => handleOptionChange(option.name, value)}
                  className="mt-2"
                >
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const isAvailable = variants.some(variant =>
                        variant.selectedOptions.some(opt => 
                          opt.name === option.name && opt.value === value
                        ) && variant.availableForSale
                      );

                      return (
                        <div key={value} className="flex items-center">
                          <RadioGroupItem
                            value={value}
                            id={`${option.name}-${value}`}
                            disabled={!isAvailable}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`${option.name}-${value}`}
                            className={`
                              cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors
                              ${selectedOptions[option.name] === value
                                ? 'border-primary bg-primary text-primary-foreground'
                                : isAvailable
                                ? 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                                : 'border-input bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                              }
                            `}
                          >
                            {value}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="quantity" className="text-base font-medium">
                Quantity:
              </Label>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 text-center min-w-[50px]">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!isInStock || (selectedVariant && quantity >= selectedVariant.quantityAvailable)}
                >
                  +
                </Button>
              </div>
            </div>

            {selectedVariant && selectedVariant.quantityAvailable <= 10 && (
              <p className="text-sm text-orange-600">
                Only {selectedVariant.quantityAvailable} left in stock!
              </p>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!isInStock || !selectedVariant || isAddingToCart}
            size="lg"
            className="w-full"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isAddingToCart ? 'Adding...' : isInCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
          </Button>
        </div>

        <Separator />

        {/* Product Description */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Description</h3>
          {product.descriptionHtml ? (
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : (
            <p className="text-muted-foreground">{product.description || 'No description available.'}</p>
          )}
        </div>

        {/* Features */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Truck className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium">Free Shipping</p>
              <p className="text-sm text-muted-foreground">On orders over $100</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium">Secure Payment</p>
              <p className="text-sm text-muted-foreground">SSL encrypted</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <RotateCcw className="h-6 w-6 text-orange-600" />
            <div>
              <p className="font-medium">Easy Returns</p>
              <p className="text-sm text-muted-foreground">30 day return policy</p>
            </div>
          </div>
        </div>

        {/* Product Tags */}
        {product.tags.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}