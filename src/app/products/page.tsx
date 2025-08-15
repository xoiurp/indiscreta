import { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';
import { SiteHeader } from '@/components/layout/site-header';

export const metadata: Metadata = {
  title: 'All Products - Indiscreta Shop',
  description: 'Browse our complete collection of premium products.',
};

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const sortKey = resolvedSearchParams.sort === 'price-low-high' ? 'PRICE' : 
                  resolvedSearchParams.sort === 'price-high-low' ? 'PRICE' :
                  resolvedSearchParams.sort === 'newest' ? 'CREATED_AT' :
                  resolvedSearchParams.sort === 'oldest' ? 'CREATED_AT' :
                  resolvedSearchParams.sort === 'title' ? 'TITLE' : 'CREATED_AT';
  
  const reverse = resolvedSearchParams.sort === 'price-high-low' || 
                  resolvedSearchParams.sort === 'oldest' || 
                  resolvedSearchParams.sort === 'title' ? true : false;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground mt-2">
            Discover our complete collection of premium products
          </p>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid sortKey={sortKey} reverse={reverse} />
        </Suspense>
      </main>
    </div>
  );
}