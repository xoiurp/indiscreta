# Indiscreta Shop - Next.js E-commerce with Shopify Headless

A modern, production-ready e-commerce platform built with Next.js 14, TypeScript, shadcn/ui, and Shopify's Headless APIs.

## 🚀 Features

### Core E-commerce Features
- **Product Catalog**: Browse products with advanced filtering and sorting
- **Product Details**: Rich product pages with image galleries and variant selection
- **Shopping Cart**: Persistent cart with real-time updates
- **Search**: Powerful search functionality with autocomplete
- **Collections**: Organized product categories and collections
- **Responsive Design**: Mobile-first, fully responsive UI

### Technical Features
- **Next.js 14**: App Router, Server Components, and modern React patterns
- **TypeScript**: Full type safety throughout the application
- **shadcn/ui**: Beautiful, accessible component library
- **Shopify Integration**: Storefront and Admin APIs with GraphQL
- **Cart Persistence**: Local storage with global state management
- **Loading States**: Skeleton components and suspense boundaries
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **SEO Optimized**: Meta tags, structured data, and performance optimization

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **E-commerce**: Shopify Storefront API & Admin API
- **GraphQL**: graphql-request
- **State Management**: React Context + useReducer
- **Icons**: Lucide React
- **Notifications**: Sonner (toast notifications)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── products/                 # Product listing and detail pages
│   ├── collections/              # Collection pages
│   ├── search/                   # Search results
│   └── layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── layout/                  # Layout components (header, footer)
│   ├── products/                # Product-related components
│   ├── cart/                    # Cart components
│   ├── search/                  # Search components
│   └── collections/             # Collection components
├── context/                     # React Context providers
│   └── cart-context.tsx        # Global cart state
├── hooks/                       # Custom React hooks
│   └── use-debounce.ts         # Debounce hook
├── lib/                        # Utility functions and configs
│   ├── shopify/                # Shopify API integration
│   │   ├── client.ts           # GraphQL clients
│   │   ├── queries.ts          # GraphQL queries/mutations
│   │   └── services.ts         # Service functions
│   └── utils.ts                # General utilities
└── types/                      # TypeScript type definitions
    └── shopify.ts              # Shopify API types
```

## 🏗 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Shopify store with Storefront API access
- Basic knowledge of Next.js and React

### 1. Install Dependencies

```bash
cd ecommerce
npm install
```

### 2. Environment Configuration

The project uses these Shopify credentials (already configured in `.env.local`):

```env
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_access_token
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
NEXT_PUBLIC_SHOPIFY_PUBLIC_URL=https://your-store.shop
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-10
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎨 Key Components

### Product Components
- **ProductCard**: Displays product information with add-to-cart functionality
- **ProductGrid**: Grid layout for product listings with sorting and filtering
- **ProductDetails**: Detailed product view with variant selection
- **ProductGallery**: Image carousel with thumbnails and navigation

### Cart Components  
- **CartSheet**: Slide-out cart panel with item management
- **CartProvider**: Global cart state management with persistence

### Search Components
- **SearchDialog**: Modal search interface with autocomplete
- **SearchResults**: Search results page with pagination

### Layout Components
- **SiteHeader**: Main navigation with cart, search, and mobile menu
- **Navigation**: Responsive navigation menus

## 🔧 Shopify Integration

### API Clients
- **Storefront API**: Public product data, cart operations
- **Admin API**: Management operations (optional)
- **GraphQL**: Type-safe queries with full TypeScript support

### Key Services
- `getProducts()` - Fetch product listings
- `getProduct(handle)` - Get single product details  
- `searchProducts(query)` - Search functionality
- `createCart()` - Initialize shopping cart
- `addToCart()` - Add items to cart
- `updateCartLines()` - Update cart quantities
- `removeFromCart()` - Remove cart items

### Cart Management
- Persistent cart using localStorage
- Real-time updates with optimistic UI
- Global state management with React Context
- Toast notifications for user feedback

## 🎯 Features Breakdown

### 1. Product Browsing
- Grid/list view toggle
- Sort by price, date, popularity
- Filter by categories, tags, price range
- Infinite scroll or pagination
- Quick add to cart from listings

### 2. Product Details
- High-resolution image gallery
- Variant selection (size, color, etc.)
- Real-time inventory checking
- Related product recommendations
- Social sharing buttons

### 3. Shopping Cart
- Persistent across sessions
- Real-time price calculations
- Quantity adjustments
- Remove items functionality
- Checkout redirect to Shopify

### 4. Search & Discovery
- Instant search with autocomplete
- Search suggestions and history
- Advanced filtering options
- Collection browsing
- Responsive mobile experience

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
The project supports deployment on any platform that supports Next.js:
- Netlify
- Railway  
- AWS Amplify
- Self-hosted with Docker

## 🔒 Security

- Environment variables for sensitive API keys
- Client-side API tokens (public Storefront API only)
- Input sanitization and validation
- HTTPS enforcement in production
- Rate limiting on API requests

## 🎨 Customization

### Styling
- Tailwind CSS for utility-first styling
- CSS variables for theme customization
- shadcn/ui components fully customizable
- Dark/light mode support built-in

### Components
- All components built with composition in mind
- Easy to extend and customize
- Consistent design system
- Accessible by default

## 📊 Performance

- Next.js App Router for optimal performance
- Server-side rendering for SEO
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Caching strategies for API requests

## 🧪 Development

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Git hooks for pre-commit checks

### Testing (Recommended additions)
- Jest for unit testing
- Playwright for E2E testing
- Storybook for component development
- Cypress for integration testing

## 📈 Analytics & Monitoring (Recommended additions)

- Google Analytics 4 integration
- Shopify Analytics
- Performance monitoring with Vercel Analytics
- Error tracking with Sentry

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Shopify](https://shopify.dev/) for the powerful e-commerce APIs
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling
- [Lucide](https://lucide.dev/) for the icon library

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using Next.js, TypeScript, and shadcn/ui.