import { Suspense } from 'react';
import { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import { SearchResults } from '@/components/search/search-results';
import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';

export const metadata: Metadata = {
  title: 'Search Results - Indiscreta Shop',
  description: 'Search results for products at Indiscreta Shop',
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const page = parseInt(resolvedSearchParams.page || '1', 10);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Search Results
          </h1>
          {query && (
            <p className="text-muted-foreground mt-2">
              Results for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <SearchResults query={query} page={page} />
        </Suspense>
      </main>
    </div>
  );
}