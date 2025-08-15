import { gql } from 'graphql-request';

// Fragment definitions
const IMAGE_FRAGMENT = gql`
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`;

const MONEY_FRAGMENT = gql`
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`;

const PRODUCT_VARIANT_FRAGMENT = gql`
  fragment ProductVariantFragment on ProductVariant {
    id
    title
    price {
      ...MoneyFragment
    }
    compareAtPrice {
      ...MoneyFragment
    }
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    image {
      ...ImageFragment
    }
  }
`;

const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    tags
    vendor
    productType
    createdAt
    updatedAt
    publishedAt
    availableForSale
    featuredImage {
      ...ImageFragment
    }
    images(first: 20) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    variants(first: 250) {
      edges {
        node {
          ...ProductVariantFragment
        }
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    options {
      id
      name
      values
    }
    seo {
      title
      description
    }
  }
`;

const COLLECTION_FRAGMENT = gql`
  fragment CollectionFragment on Collection {
    id
    handle
    title
    description
    descriptionHtml
    image {
      ...ImageFragment
    }
    seo {
      title
      description
    }
    createdAt
    updatedAt
  }
`;

const CART_FRAGMENT = gql`
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 250) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...MoneyFragment
            }
            subtotalAmount {
              ...MoneyFragment
            }
            compareAtAmountPerQuantity {
              ...MoneyFragment
            }
          }
          merchandise {
            ... on ProductVariant {
              ...ProductVariantFragment
              product {
                id
                handle
                title
                featuredImage {
                  ...ImageFragment
                }
              }
            }
          }
          attributes {
            key
            value
          }
        }
      }
    }
    cost {
      totalAmount {
        ...MoneyFragment
      }
      subtotalAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
      totalDutyAmount {
        ...MoneyFragment
      }
    }
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
      }
      email
      phone
    }
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
    estimatedCost {
      totalAmount {
        ...MoneyFragment
      }
      subtotalAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
      totalDutyAmount {
        ...MoneyFragment
      }
    }
    createdAt
    updatedAt
  }
`;

// Product Queries
export const GET_PRODUCTS_QUERY = gql`
  query GetProducts(
    $first: Int = 20
    $after: String
    $query: String
    $sortKey: ProductSortKeys = CREATED_AT
    $reverse: Boolean = true
  ) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          ...ProductFragment
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_QUERY = gql`
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_PRODUCT_RECOMMENDATIONS_QUERY = gql`
  query GetProductRecommendations($productId: ID!, $intent: ProductRecommendationIntent = RELATED) {
    productRecommendations(productId: $productId, intent: $intent) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const SEARCH_PRODUCTS_QUERY = gql`
  query SearchProducts(
    $query: String!
    $first: Int = 20
    $after: String
    $sortKey: ProductSortKeys = RELEVANCE
    $reverse: Boolean = false
  ) {
    search(query: $query, first: $first, after: $after, types: PRODUCT) {
      edges {
        node {
          ... on Product {
            ...ProductFragment
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

// Collection Queries
export const GET_COLLECTIONS_QUERY = gql`
  query GetCollections($first: Int = 20, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          ...CollectionFragment
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_FRAGMENT}
`;

export const GET_COLLECTION_QUERY = gql`
  query GetCollection($handle: String!) {
    collection(handle: $handle) {
      ...CollectionFragment
      products(first: 20) {
        edges {
          node {
            ...ProductFragment
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_FRAGMENT}
`;

export const GET_COLLECTION_PRODUCTS_QUERY = gql`
  query GetCollectionProducts(
    $handle: String!
    $first: Int = 20
    $after: String
    $sortKey: ProductCollectionSortKeys = CREATED
    $reverse: Boolean = true
  ) {
    collection(handle: $handle) {
      id
      title
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...ProductFragment
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

// Cart Queries
export const GET_CART_QUERY = gql`
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFragment
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${CART_FRAGMENT}
`;

// Cart Mutations
export const CREATE_CART_MUTATION = gql`
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 250) {
          edges {
            node {
              id
              quantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
                subtotalAmount {
                  amount
                  currencyCode
                }
                compareAtAmountPerQuantity {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    id
                    url
                    altText
                    width
                    height
                  }
                  product {
                    id
                    handle
                    title
                    featuredImage {
                      id
                      url
                      altText
                      width
                      height
                    }
                  }
                }
              }
              attributes {
                key
                value
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
          }
        }
        buyerIdentity {
          countryCode
          customer {
            id
            email
            firstName
            lastName
          }
          email
          phone
        }
        attributes {
          key
          value
        }
        discountCodes {
          code
          applicable
        }
        estimatedCost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
          }
        }
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${CART_FRAGMENT}
`;

export const UPDATE_CART_MUTATION = gql`
  mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${CART_FRAGMENT}
`;

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${CART_FRAGMENT}
`;

export const UPDATE_CART_BUYER_IDENTITY_MUTATION = gql`
  mutation UpdateCartBuyerIdentity($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${CART_FRAGMENT}
`;

export const APPLY_DISCOUNT_CODE_MUTATION = gql`
  mutation ApplyDiscountCode($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${CART_FRAGMENT}
`;

// Customer Queries
export const GET_CUSTOMER_QUERY = gql`
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      displayName
      acceptsMarketing
      createdAt
      updatedAt
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
        provinceCode
        countryCodeV2
      }
      addresses(first: 20) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            country
            zip
            phone
            provinceCode
            countryCodeV2
          }
        }
      }
    }
  }
`;

// Shop Info Query
export const GET_SHOP_INFO_QUERY = gql`
  query GetShopInfo {
    shop {
      name
      description
      primaryDomain {
        url
        host
      }
      brand {
        logo {
          image {
            ...ImageFragment
          }
        }
        squareLogo {
          image {
            ...ImageFragment
          }
        }
      }
      paymentSettings {
        acceptedCardBrands
        cardVaultUrl
        countryCode
        currencyCode
        shopifyPaymentsAccountId
        supportedDigitalWallets
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;