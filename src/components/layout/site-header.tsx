'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useCart } from '@/context/cart-context';
import { SearchDialog } from '@/components/search/search-dialog';
import { CartSheet } from '@/components/cart/cart-sheet';
import { useState } from 'react';

const navigation = {
  categories: [
    {
      name: 'New Arrivals',
      href: '/collections/new-arrivals',
      featured: [
        { name: 'Latest Products', href: '/collections/latest' },
        { name: 'Trending Now', href: '/collections/trending' },
      ],
    },
    {
      name: 'Categories',
      href: '/collections',
      featured: [
        { name: 'All Collections', href: '/collections' },
        { name: 'Best Sellers', href: '/collections/best-sellers' },
      ],
    },
  ],
  pages: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
};

export function SiteHeader() {
  const { getItemCount, toggleCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="font-bold text-xl">Indiscreta</span>
                </Link>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Link
                  href="/products"
                  className="block px-2 py-1 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                {navigation.categories.map((category) => (
                  <div key={category.name} className="flex flex-col space-y-2">
                    <Link
                      href={category.href}
                      className="block px-2 py-1 text-lg font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.featured.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-1 text-sm text-muted-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ))}
                {navigation.pages.map((page) => (
                  <Link
                    key={page.name}
                    href={page.href}
                    className="block px-2 py-1 text-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Indiscreta</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/products" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  All Products
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            {navigation.categories.map((category) => (
              <NavigationMenuItem key={category.name}>
                <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="grid gap-1">
                      <h3 className="font-medium leading-none">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Explore our {category.name.toLowerCase()}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      {category.featured.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            {navigation.pages.map((page) => (
              <NavigationMenuItem key={page.name}>
                <Link href={page.href} legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    {page.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Account */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-6 w-6 p-0 flex items-center justify-center text-xs"
              >
                {cartItemCount}
              </Badge>
            )}
            <span className="sr-only">Cart ({cartItemCount})</span>
          </Button>
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      
      {/* Cart Sheet */}
      <CartSheet />
    </header>
  );
}