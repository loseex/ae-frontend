import API from "@/shared/services/api.d";
import {
  deleteOrder,
  findAllOrders,
  patchOrder,
  postCreateOrder,
} from "@/app/core/http/orders.http";
import { defineStore } from "pinia";

type State = {
  orders: API.Order.GetAll.Response;
  loading: boolean;
  error: unknown | null;
};

const normalizeError = (e: unknown): Error =>
  e instanceof Error ? e : new Error(String(e));

export const useOrdersStoreAPI = defineStore("pinia::api::orders", {
  state: (): State => ({
    orders: [],
    loading: false,
    error: null,
  }),

  actions: {
    async apiFetch(params: URLSearchParams) {
      this.loading = true;
      this.error = null;

      try {
        const response = await findAllOrders();
        this.orders = response.data;
        return response;
      } catch (e) {
        this.error = e;
        throw normalizeError(e);
      } finally {
        this.loading = false;
      }
    },

    async apiPostCreate(body: API.Order.PostCreate.RequestBody) {
      this.error = null;

      try {
        const response = await postCreateOrder(body);

        // Если API возвращает созданный заказ:
        // this.orders.push(response.data);

        return response;
      } catch (e) {
        this.error = e;
        throw normalizeError(e);
      }
    },

    async apiChangeStatus(id: API.Order.T["id"], status: API.Order.Status) {
      this.error = null;

      try {
        const response = await patchOrder(id, { status });

        const index = this.orders.findIndex((order) => order.id === id);
        if (index !== -1) {
          this.orders[index] = {
            ...this.orders[index],
            status,
          };
        }

        return response;
      } catch (e) {
        this.error = e;
        throw normalizeError(e);
      }
    },

    async apiMarkDone(id: API.Order.T["id"]) {
      return this.apiChangeStatus(id, API.Order.Status.DONE);
    },

    async apiDeleteOrder(id: API.Order.T["id"]) {
      this.error = null;

      try {
        const response = await deleteOrder(id);

        this.orders = this.orders.filter((order) => order.id !== id);

        return response;
      } catch (e) {
        this.error = e;
        throw normalizeError(e);
      }
    },
  },
});
