import { Suspense } from 'react';
import { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import { CollectionGrid } from '@/components/collections/collection-grid';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Collections - Indiscreta Shop',
  description: 'Browse our product collections and categories',
};

function CollectionGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground mt-2">
            Browse our curated product collections
          </p>
        </div>

        <Suspense fallback={<CollectionGridSkeleton />}>
          <CollectionGrid />
        </Suspense>
      </main>
    </div>
  );
}