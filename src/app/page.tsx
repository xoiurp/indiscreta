import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                Welcome to Indiscreta Shop
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Premium Products,
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {' '}Exceptional Quality
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
                Discover our curated collection of premium products. From everyday essentials to luxury items, 
                we bring you the best shopping experience with unmatched quality and service.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg">
                <Link href="/collections">
                  Browse Collections
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mt-2 text-lg font-semibold">5-Star Reviews</p>
                <p className="text-muted-foreground">Over 10,000+ happy customers</p>
              </div>
              <div className="flex flex-col items-center">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <p className="mt-2 text-lg font-semibold">Fast Shipping</p>
                <p className="text-muted-foreground">Free shipping on orders $100+</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-2">
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                </div>
                <p className="mt-2 text-lg font-semibold">Secure Shopping</p>
                <p className="text-muted-foreground">SSL encrypted & safe payments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover our most popular and trending items
          </p>
        </div>

        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <div className="mb-8">
            <ProductGrid first={8} sortKey="BEST_SELLING" />
          </div>
        </Suspense>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Indiscreta Shop?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience the difference with our premium service
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Premium Quality</h3>
                <p className="mt-2 text-muted-foreground">
                  Carefully curated products that meet our high standards for quality and durability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Customer First</h3>
                <p className="mt-2 text-muted-foreground">
                  Exceptional customer service with 24/7 support and hassle-free returns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Fast Delivery</h3>
                <p className="mt-2 text-muted-foreground">
                  Quick and reliable shipping with real-time tracking for all your orders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start Shopping?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of satisfied customers who trust Indiscreta Shop for their shopping needs.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/products">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/collections">
                View Collections
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
