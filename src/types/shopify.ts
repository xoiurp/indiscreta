// Shopify Storefront API Types

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ShopifyImage;
  quantityAvailable: number;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  vendor: string;
  productType: string;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  featuredImage?: ShopifyImage;
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  seo: {
    title?: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  availableForSale: boolean;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image?: ShopifyImage;
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
  };
  seo: {
    title?: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: ShopifyProductVariant;
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
    compareAtAmountPerQuantity?: ShopifyMoney;
  };
  attributes: {
    key: string;
    value: string;
  }[];
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney;
    totalDutyAmount?: ShopifyMoney;
  };
  buyerIdentity: {
    countryCode?: string;
    customer?: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
    };
    email?: string;
    phone?: string;
    deliveryAddressPreferences?: any[];
  };
  attributes: {
    key: string;
    value: string;
  }[];
  discountCodes: {
    code: string;
    applicable: boolean;
  }[];
  estimatedCost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
    totalTaxAmount?: ShopifyMoney;
    totalDutyAmount?: ShopifyMoney;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  acceptsMarketing: boolean;
  createdAt: string;
  updatedAt: string;
  defaultAddress?: ShopifyAddress;
  addresses: {
    edges: {
      node: ShopifyAddress;
    }[];
  };
  orders: {
    edges: {
      node: ShopifyOrder;
    }[];
  };
}

export interface ShopifyAddress {
  id: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
  provinceCode?: string;
  countryCodeV2?: string;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  email?: string;
  phone?: string;
  processedAt: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  statusUrl: string;
  totalPrice: ShopifyMoney;
  totalRefunded: ShopifyMoney;
  totalShippingPrice: ShopifyMoney;
  subtotalPrice: ShopifyMoney;
  totalTax: ShopifyMoney;
  currencyCode: string;
  lineItems: {
    edges: {
      node: {
        id: string;
        title: string;
        quantity: number;
        variant?: ShopifyProductVariant;
        originalTotalPrice: ShopifyMoney;
        discountedTotalPrice: ShopifyMoney;
      };
    }[];
  };
  shippingAddress?: ShopifyAddress;
  billingAddress?: ShopifyAddress;
}

// GraphQL Query/Mutation Response Types
export interface ProductsResponse {
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

export interface ProductResponse {
  product: ShopifyProduct | null;
}

export interface CollectionsResponse {
  collections: {
    edges: {
      node: ShopifyCollection;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
  };
}

export interface CollectionResponse {
  collection: ShopifyCollection | null;
}

export interface CartResponse {
  cart: ShopifyCart | null;
}

export interface CreateCartResponse {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface AddToCartResponse {
  cartLinesAdd: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface UpdateCartResponse {
  cartLinesUpdate: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

export interface RemoveFromCartResponse {
  cartLinesRemove: {
    cart: ShopifyCart | null;
    userErrors: {
      field: string[];
      message: string;
    }[];
  };
}

// Cart Line Input Types
export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: {
    key: string;
    value: string;
  }[];
}

export interface CartLineUpdateInput {
  id: string;
  quantity: number;
  attributes?: {
    key: string;
    value: string;
  }[];
}

// Search and Filter Types
export interface ProductFilter {
  available?: boolean;
  price?: {
    min?: number;
    max?: number;
  };
  productType?: string;
  vendor?: string;
  variantOption?: {
    name: string;
    value: string;
  };
  tag?: string;
  productIds?: string[];
}

export interface ProductSortKey {
  key: 'CREATED_AT' | 'UPDATED_AT' | 'TITLE' | 'PRICE' | 'BEST_SELLING' | 'RELEVANCE';
  reverse?: boolean;
}

// Utility Types
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };