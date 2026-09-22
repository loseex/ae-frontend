import { findAllOrders, postCreateOrder } from "@/app/core/http/orders.http";
import type API from "@/shared/services/api";
import { defineStore } from "pinia";

type State = {
  value: API.Order.GetAll.Response;
  loading: boolean;
};

export const useOrdersStoreAPI = defineStore("pinia::api::orders", {
  state: (): State => ({
    value: [],
    loading: false,
  }),

  actions: {
    async apiFetch() {
      this.loading = true;
      try {
        const response = await findAllOrders();
        this.setValue(response.data);
        return response;
      } catch (e) {
        this.loading = false;
        throw new Error(e as string);
      } finally {
        this.loading = false;
      }
    },

    async apiPostCreate(body: API.Order.PostCreate.RequestBody) {
      try {
        await postCreateOrder(body);
      } catch (e: unknown) {
        throw new Error(e as string);
      }
    },

    setValue(value: API.Order.GetAll.Response) {
      this.value = value;
    },
  },
});
