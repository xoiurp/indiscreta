import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify/services';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export async function CollectionGrid() {
  try {
    const response = await getCollections({ first: 12 });
    const collections = response.collections.edges.map(edge => edge.node);

    if (collections.length === 0) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No collections found</h3>
          <p className="mt-2 text-muted-foreground">
            We couldn&apos;t find any collections at the moment.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.handle}`}>
            <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText || collection.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  
                  {/* Overlay with collection title */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      View Collection
                    </Badge>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6">
                <div className="w-full">
                  <h3 className="text-xl font-semibold mb-2">{collection.title}</h3>
                  {collection.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold text-destructive">
          Failed to load collections
        </h3>
        <p className="mt-2 text-muted-foreground">
          There was an error loading the collections. Please try again.
        </p>
      </div>
    );
  }
}