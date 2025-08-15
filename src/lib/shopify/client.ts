import { GraphQLClient } from 'graphql-request';

// Environment variables
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
const SHOPIFY_API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-10';

if (!SHOPIFY_STORE_DOMAIN) {
  throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is required');
}

if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is required');
}

// Storefront API Client (for public data like products, collections)
export const storefrontClient = new GraphQLClient(
  `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  }
);

// Admin API Client (for management operations)
export const adminClient = new GraphQLClient(
  `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
  {
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  }
);

// Generic request wrapper with error handling
export async function shopifyRequest<T = unknown>(
  client: GraphQLClient,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const data = await client.request<T>(query, variables);
    return data;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw new Error(`Shopify API request failed: ${error}`);
  }
}

// Storefront API request wrapper
export async function storefrontRequest<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return shopifyRequest<T>(storefrontClient, query, variables);
}

// Admin API request wrapper  
export async function adminRequest<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return shopifyRequest<T>(adminClient, query, variables);
}

// Cache configuration for different types of data
export const cacheConfig = {
  products: {
    revalidate: 300, // 5 minutes
    tags: ['products'],
  },
  collections: {
    revalidate: 3600, // 1 hour
    tags: ['collections'],
  },
  cart: {
    revalidate: 0, // No cache for cart data
    tags: ['cart'],
  },
  shop: {
    revalidate: 86400, // 24 hours
    tags: ['shop'],
  },
} as const;

// Helper function to create cache tags
export function createCacheKey(type: keyof typeof cacheConfig, id?: string): string {
  return id ? `${type}:${id}` : type;
}

// Shopify ID helpers
export function getShopifyId(gid: string): string {
  return gid.split('/').pop() || gid;
}

export function createShopifyGid(type: string, id: string): string {
  return `gid://shopify/${type}/${id}`;
}

// Error types
export class ShopifyError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ShopifyError';
  }
}

// Rate limiting helper
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // 100ms between requests

export async function rateLimitedRequest<T>(
  requestFn: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return requestFn();
}