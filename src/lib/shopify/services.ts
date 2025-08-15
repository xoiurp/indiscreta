import { storefrontRequest } from './client';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  GET_CART_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  UPDATE_CART_BUYER_IDENTITY_MUTATION,
  APPLY_DISCOUNT_CODE_MUTATION,
  GET_SHOP_INFO_QUERY,
} from './queries';
import type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
  ProductsResponse,
  ProductResponse,
  CollectionsResponse,
  CollectionResponse,
  CartResponse,
  CreateCartResponse,
  AddToCartResponse,
  UpdateCartResponse,
  RemoveFromCartResponse,
  CartLineInput,
  CartLineUpdateInput,
  ProductSortKey,
  PageInfo,
} from '@/types/shopify';

// Product Services
export async function getProducts(options: {
  first?: number;
  after?: string;
  query?: string;
  sortKey?: ProductSortKey['key'];
  reverse?: boolean;
} = {}): Promise<ProductsResponse> {
  const {
    first = 20,
    after,
    query,
    sortKey = 'BEST_SELLING',
    reverse = true,
  } = options;

  return storefrontRequest<ProductsResponse>(GET_PRODUCTS_QUERY, {
    first,
    after,
    query,
    sortKey,
    reverse,
  });
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const response = await storefrontRequest<ProductResponse>(GET_PRODUCT_QUERY, {
    handle,
  });
  return response.product;
}

export async function getProductRecommendations(
  productId: string,
  intent: 'RELATED' | 'COMPLEMENTARY' = 'RELATED'
): Promise<ShopifyProduct[]> {
  const response = await storefrontRequest<{ productRecommendations: ShopifyProduct[] }>(
    GET_PRODUCT_RECOMMENDATIONS_QUERY,
    {
      productId,
      intent,
    }
  );
  return response.productRecommendations || [];
}

export async function searchProducts(options: {
  query: string;
  first?: number;
  after?: string;
  sortKey?: ProductSortKey['key'];
  reverse?: boolean;
}): Promise<{ products: ShopifyProduct[]; pageInfo: PageInfo }> {
  const {
    query,
    first = 20,
    after,
    sortKey = 'RELEVANCE',
    reverse = false,
  } = options;

  const response = await storefrontRequest<{
    search: {
      edges: { node: ShopifyProduct }[];
      pageInfo: PageInfo;
    };
  }>(SEARCH_PRODUCTS_QUERY, {
    query,
    first,
    after,
    sortKey,
    reverse,
  });

  return {
    products: response.search.edges.map(edge => edge.node),
    pageInfo: response.search.pageInfo,
  };
}

// Collection Services
export async function getCollections(options: {
  first?: number;
  after?: string;
} = {}): Promise<CollectionsResponse> {
  const { first = 20, after } = options;

  return storefrontRequest<CollectionsResponse>(GET_COLLECTIONS_QUERY, {
    first,
    after,
  });
}

export async function getCollection(handle: string): Promise<ShopifyCollection | null> {
  const response = await storefrontRequest<CollectionResponse>(GET_COLLECTION_QUERY, {
    handle,
  });
  return response.collection;
}

export async function getCollectionProducts(options: {
  handle: string;
  first?: number;
  after?: string;
  sortKey?: 'CREATED' | 'UPDATED' | 'TITLE' | 'PRICE' | 'BEST_SELLING';
  reverse?: boolean;
}): Promise<{ collection: ShopifyCollection | null }> {
  const {
    handle,
    first = 20,
    after,
    sortKey = 'CREATED',
    reverse = true,
  } = options;

  return storefrontRequest<{ collection: ShopifyCollection | null }>(
    GET_COLLECTION_PRODUCTS_QUERY,
    {
      handle,
      first,
      after,
      sortKey,
      reverse,
    }
  );
}

// Cart Services
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const response = await storefrontRequest<CartResponse>(GET_CART_QUERY, {
    id: cartId,
  });
  return response.cart;
}

export async function createCart(input: {
  lines?: CartLineInput[];
  attributes?: { key: string; value: string }[];
  buyerIdentity?: {
    countryCode?: string;
    email?: string;
    phone?: string;
  };
} = {}): Promise<ShopifyCart | null> {
  const response = await storefrontRequest<CreateCartResponse>(CREATE_CART_MUTATION, {
    input,
  });

  if (response.cartCreate.userErrors.length > 0) {
    throw new Error(
      `Cart creation failed: ${response.cartCreate.userErrors
        .map(error => error.message)
        .join(', ')}`
    );
  }

  return response.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  lines: CartLineInput[]
): Promise<ShopifyCart | null> {
  const response = await storefrontRequest<AddToCartResponse>(ADD_TO_CART_MUTATION, {
    cartId,
    lines,
  });

  if (response.cartLinesAdd.userErrors.length > 0) {
    throw new Error(
      `Add to cart failed: ${response.cartLinesAdd.userErrors
        .map(error => error.message)
        .join(', ')}`
    );
  }

  return response.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<ShopifyCart | null> {
  const response = await storefrontRequest<UpdateCartResponse>(UPDATE_CART_MUTATION, {
    cartId,
    lines,
  });

  if (response.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(
      `Cart update failed: ${response.cartLinesUpdate.userErrors
        .map(error => error.message)
        .join(', ')}`
    );
  }

  return response.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart | null> {
  const response = await storefrontRequest<RemoveFromCartResponse>(REMOVE_FROM_CART_MUTATION, {
    cartId,
    lineIds,
  });

  if (response.cartLinesRemove.userErrors.length > 0) {
    throw new Error(
      `Remove from cart failed: ${response.cartLinesRemove.userErrors
        .map(error => error.message)
        .join(', ')}`
    );
  }

  return response.cartLinesRemove.cart;
}

export async function updateCartBuyerIdentity(
  cartId: string,
  buyerIdentity: {
    countryCode?: string;
    email?: string;
    phone?: string;
    deliveryAddressPreferences?: unknown[];
  }
): Promise<ShopifyCart | null> {
  const response = await storefrontRequest<{
    cartBuyerIdentityUpdate: {
      cart: ShopifyCart | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(UPDATE_CART_BUYER_IDENTITY_MUTATION, {
    cartId,
    buyerIdentity,
  });

  if (response.cartBuyerIdentityUpdate.userErrors.length > 0) {
    throw new Error(
      `Buyer identity update failed: ${response.cartBuyerIdentityUpdate.userErrors
        .map(error => error.message)
        .join(', ')}`
    );
  }

  return response.cartBuyerIdentityUpdate.cart;
}

export async function applyDiscountCode(
  cartId: string,
  discountCodes: string[]
): Promise<ShopifyCart | null> {
  const response = await storefrontRequest<{
    cartDiscountCodesUpdate: {
      cart: ShopifyCart | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(APPLY_DISCOUNT_CODE_MUTATION, {
    cartId,
    discountCodes,
  });

  if (response.cartDiscountCodesUpdate.userErrors.length > 0) {
    throw new Error(
      `Discount code application failed: ${response.cartDiscountCodesUpdate.userErrors
        .map(error => error.message)
        .join(', ')}`
    );
  }

  return response.cartDiscountCodesUpdate.cart;
}

// Shop Services
export async function getShopInfo(): Promise<{
  shop: {
    name: string;
    description: string;
    primaryDomain: { url: string; host: string };
    brand?: unknown;
    paymentSettings?: unknown;
  };
}> {
  return storefrontRequest<{
    shop: {
      name: string;
      description: string;
      primaryDomain: { url: string; host: string };
      brand?: unknown;
      paymentSettings?: unknown;
    };
  }>(GET_SHOP_INFO_QUERY);
}

// Utility functions
export function formatPrice(money: { amount: string; currencyCode: string }): string {
  const amount = parseFloat(money.amount);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
  });
  return formatter.format(amount);
}

export function buildProductUrl(handle: string): string {
  return `/products/${handle}`;
}

export function buildCollectionUrl(handle: string): string {
  return `/collections/${handle}`;
}

export function getProductVariant(
  product: ShopifyProduct,
  selectedOptions: Record<string, string>
): ShopifyProduct['variants']['edges'][0]['node'] | null {
  const variant = product.variants.edges.find(({ node }) =>
    node.selectedOptions.every(
      option => selectedOptions[option.name] === option.value
    )
  );
  return variant?.node || null;
}

export function getProductFirstAvailableVariant(
  product: ShopifyProduct
): ShopifyProduct['variants']['edges'][0]['node'] | null {
  const variant = product.variants.edges.find(({ node }) => node.availableForSale);
  return variant?.node || null;
}

export function isProductInStock(product: ShopifyProduct): boolean {
  return product.availableForSale && product.variants.edges.some(({ node }) => 
    node.availableForSale && node.quantityAvailable > 0
  );
}

export function getTotalCartItems(cart: ShopifyCart | null): number {
  return cart?.totalQuantity || 0;
}

export function getCartTotal(cart: ShopifyCart | null): string {
  if (!cart) return '$0.00';
  return formatPrice(cart.cost.totalAmount);
}

// Local storage helpers for cart persistence
export function getStoredCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('shopify-cart-id');
}

export function setStoredCartId(cartId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('shopify-cart-id', cartId);
}

export function removeStoredCartId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('shopify-cart-id');
}