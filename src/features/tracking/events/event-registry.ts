export const InternalEvents = {
  PAGE_VIEW: 'PAGE_VIEW',
  VIEW_ITEM_LIST: 'VIEW_ITEM_LIST',
  SELECT_ITEM: 'SELECT_ITEM',
  VIEW_ITEM: 'VIEW_ITEM',
  SEARCH: 'SEARCH',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  VIEW_CART: 'VIEW_CART',
  BEGIN_CHECKOUT: 'BEGIN_CHECKOUT',
  ADD_SHIPPING_INFO: 'ADD_SHIPPING_INFO',
  ADD_PAYMENT_INFO: 'ADD_PAYMENT_INFO',
  ORDER_CREATED: 'ORDER_CREATED', // internal only
  PURCHASE: 'PURCHASE', // after payment confirmation
} as const;

export type InternalEventName = keyof typeof InternalEvents;

export const MetaStandardEvents: Partial<Record<InternalEventName, string>> = {
  PAGE_VIEW: 'PageView',
  VIEW_ITEM: 'ViewContent',
  SEARCH: 'Search',
  ADD_TO_CART: 'AddToCart',
  BEGIN_CHECKOUT: 'InitiateCheckout',
  ADD_PAYMENT_INFO: 'AddPaymentInfo',
  PURCHASE: 'Purchase',
};

export const Ga4StandardEvents: Partial<Record<InternalEventName, string>> = {
  PAGE_VIEW: 'page_view',
  VIEW_ITEM_LIST: 'view_item_list',
  SELECT_ITEM: 'select_item',
  VIEW_ITEM: 'view_item',
  SEARCH: 'search',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  VIEW_CART: 'view_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_SHIPPING_INFO: 'add_shipping_info',
  ADD_PAYMENT_INFO: 'add_payment_info',
  PURCHASE: 'purchase',
};
