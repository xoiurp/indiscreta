'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/products/product-card';
import { searchProducts } from '@/lib/shopify/services';
import type { ShopifyProduct } from '@/types/shopify';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchProducts({
        query: searchQuery,
        first: 8,
      });
      setResults(response.products);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search products');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to trigger search
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery]);

  // Popular/trending search terms (you can fetch these from your backend)
  const popularSearches = [
    'New arrivals',
    'Sale',
    'Best sellers',
    'Featured',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onOpenChange(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  const handleProductClick = () => {
    onOpenChange(false);
    setQuery('');
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setError(null);
    }
  }, [open]);

  const hasResults = results.length > 0;
  const showSuggestions = !query.trim() && !isLoading;
  const showNoResults = debouncedQuery.trim() && !isLoading && !hasResults && !error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
          <DialogDescription>
            Find what you're looking for in our store
          </DialogDescription>
        </DialogHeader>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="pl-10"
              autoFocus
            />
          </div>
          <Button type="submit" disabled={!query.trim() || isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Search'
            )}
          </Button>
        </form>

        <div className="flex-1 overflow-hidden">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Searching...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-sm text-destructive">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => performSearch(debouncedQuery)}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Popular Searches */}
          {showSuggestions && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Start typing to search for products</p>
              </div>
            </div>
          )}

          {/* No Results */}
          {showNoResults && (
            <div className="text-center py-8">
              <Search className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          )}

          {/* Search Results */}
          {hasResults && (
            <ScrollArea className="h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    Found {results.length} product{results.length !== 1 ? 's' : ''}
                  </h3>
                  {results.length === 8 && (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                        onOpenChange(false);
                        setQuery('');
                      }}
                    >
                      View all results
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {results.map((product) => (
                    <div key={product.id} onClick={handleProductClick}>
                      <ProductCard
                        product={product}
                        className="h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Search Tips */}
        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">Enter</kbd> to search all products, or click on a result to view details
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}