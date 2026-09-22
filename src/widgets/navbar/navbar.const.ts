import { ENV_ROUTES } from "@/app/router/config";
import type { NavbarLink } from "./navbar.d";

export const NavbarRouterLinks: NavbarLink[] = [
  {
    path: ENV_ROUTES.orders.path,
    label: "Все заказы",
  },
  {
    path: ENV_ROUTES.order_create.path,
    label: "Добавить заказ",
  },
];
