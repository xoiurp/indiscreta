'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/shopify/services';
import { ProductCard } from './product-card';
import { ProductSortFilter } from './product-sort-filter';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import type { ProductSortKey, ShopifyProduct } from '@/types/shopify';

interface ProductGridProps {
  sortKey?: ProductSortKey['key'];
  reverse?: boolean;
  first?: number;
}

export function ProductGrid({ 
  sortKey = 'BEST_SELLING', 
  reverse = true, 
  first = 24 
}: ProductGridProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getProducts({
          first,
          sortKey,
          reverse,
        });

        const productsData = response.products.edges.map(edge => edge.node);
        setProducts(productsData);
        setHasNextPage(response.products.pageInfo.hasNextPage);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [first, sortKey, reverse]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold text-destructive">
          Failed to load products
        </h3>
        <p className="mt-2 text-muted-foreground">
          There was an error loading the products. Please try refreshing the page.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No products found</h3>
        <p className="mt-2 text-muted-foreground">
          We couldn&apos;t find any products at the moment. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Filter */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} products
        </p>
        <ProductSortFilter />
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More Button (if there are more products) */}
      {hasNextPage && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
}