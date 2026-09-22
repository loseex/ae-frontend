import { createRouter, createWebHashHistory } from "vue-router";
import { ENV_ROUTES } from "./config";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: Object.values(ENV_ROUTES),
});
