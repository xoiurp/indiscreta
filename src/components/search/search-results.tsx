import { searchProducts } from '@/lib/shopify/services';
import { ProductCard } from '@/components/products/product-card';
import { AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SearchResultsProps {
  query: string;
  page?: number;
}

export async function SearchResults({ query, page = 1 }: SearchResultsProps) {
  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No search query provided</h3>
        <p className="mt-2 text-muted-foreground">
          Please enter a search term to find products.
        </p>
        <Button asChild className="mt-4">
          <Link href="/products">Browse All Products</Link>
        </Button>
      </div>
    );
  }

  try {
    const response = await searchProducts({
      query: query.trim(),
      first: 24,
    });

    if (response.products.length === 0) {
      return (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No products found</h3>
          <p className="mt-2 text-muted-foreground">
            We couldn't find any products matching "{query}". Try using different keywords or browse our categories.
          </p>
          <div className="mt-6 space-x-4">
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/collections">View Collections</Link>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Found {response.products.length} product{response.products.length !== 1 ? 's' : ''} for "{query}"
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {response.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {response.pageInfo.hasNextPage && (
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Results
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Search failed:', error);
    
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold text-destructive">
          Search failed
        </h3>
        <p className="mt-2 text-muted-foreground">
          There was an error performing the search. Please try again.
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
}