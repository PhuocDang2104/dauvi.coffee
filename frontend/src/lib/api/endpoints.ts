export const API_ENDPOINTS = {
  products: {
    list: "/products",
    featured: "/products/featured",
    detail: (slug: string) => `/products/${encodeURIComponent(slug)}`,
  },
  lots: {
    featured: "/lots/featured",
    detail: (lotCode: string) => `/lots/${encodeURIComponent(lotCode)}`,
  },
  advisor: {
    recommendations: "/advisor/recommendations",
  },
  cart: {
    detail: "/cart",
    items: "/cart/items",
    item: (itemId: string) => `/cart/items/${encodeURIComponent(itemId)}`,
  },
  orders: {
    create: "/orders",
  },
} as const;

