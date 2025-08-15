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
  searchParams: {
    sort?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sortKey = searchParams.sort === 'price-low-high' ? 'PRICE' : 
                  searchParams.sort === 'price-high-low' ? 'PRICE' :
                  searchParams.sort === 'newest' ? 'CREATED_AT' :
                  searchParams.sort === 'oldest' ? 'CREATED_AT' :
                  searchParams.sort === 'title' ? 'TITLE' : 'CREATED_AT';
  
  const reverse = searchParams.sort === 'price-high-low' || 
                  searchParams.sort === 'oldest' || 
                  searchParams.sort === 'title' ? true : false;

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