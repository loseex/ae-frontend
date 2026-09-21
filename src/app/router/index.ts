import { createRouter, createMemoryHistory } from "vue-router";
import { ENV_ROUTES } from "./config";

export const router = createRouter({
  history: createMemoryHistory(),
  routes: Object.values(ENV_ROUTES),
});
