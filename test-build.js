// Teste rápido de compilação TypeScript
console.log('Testando imports...');

// Simular imports principais
const test = {
  shopifyTypes: typeof require('./src/types/shopify'),
  queries: typeof require('./src/lib/shopify/queries'),
  services: typeof require('./src/lib/shopify/services'),
  client: typeof require('./src/lib/shopify/client'),
  cartContext: typeof require('./src/context/cart-context')
};

console.log('Imports test passed:', test);