import { getProductRecommendations } from '@/lib/shopify/services';
import { ProductCard } from './product-card';

interface ProductRecommendationsProps {
  productId: string;
}

export async function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  try {
    const recommendations = await getProductRecommendations(productId, 'RELATED');

    if (recommendations.length === 0) {
      return null;
    }

    return (
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">You might also like</h2>
          <p className="text-muted-foreground mt-2">
            Products recommended based on this item
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Failed to fetch product recommendations:', error);
    return null;
  }
}