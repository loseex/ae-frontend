const OrdersView = () => import("@/pages/protected/orders/orders.view.vue");
const OrderCreateView = () =>
  import("@/pages/protected/order-create/order-create.view.vue");

export const ENV_ROUTES = {
  orders: {
    path: "/",
    component: OrdersView,
  },
  order_create: {
    path: "/create",
    component: OrderCreateView,
  },
} as const;
