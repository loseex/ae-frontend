import Core from "@/app/core";
import Authenticator from "@/app/core/api/authenticator.api";
import { Applications, Events } from "@/app/core/core.d";
import { authenticate, me } from "@/app/core/http/auth.http";
import API from "@/shared/services/api.d";
import { defineStore } from "pinia";

type State = {
  value: API.User.T | undefined;
  loading: boolean;
};

export const useAccountStore = defineStore("pinia::api::account", {
  state: (): State => ({
    value: undefined,
    loading: false,
  }),

  actions: {
    async authenticate(data: API.Authentication.Authenticate.RequestBody) {
      this.loading = true;
      try {
        const response = await authenticate(data);
        void Authenticator.setAccessToken(response.data.access_token);
        this.value = response.data.data;
        this.loading = false;
      } catch (e: unknown) {
        this.loading = false;
        throw new Error(e as string);
      }

      Core.eventEmitter.emit(Events.MOUNT, Applications.APPLICATION);
    },

    async me() {
      if (Authenticator.hasTokens() === false || this.value !== undefined)
        return;

      this.loading = true;
      try {
        const response = await me();
        this.value = response.data;
        this.loading = false;
      } catch (e: unknown) {
        this.loading = false;
        throw new Error(e as string);
      }
    },

    logout() {
      void Authenticator.reset();
      Core.eventEmitter.emit(Events.MOUNT, Applications.AUTHENTICATION);
    },

    isAllowed(): boolean {
      return this.value?.role === API.User.Role.ADMIN;
    },
  },
});
