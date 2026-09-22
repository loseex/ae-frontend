import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import Authenticator from "./authenticator.api";

declare module "axios" {
  export interface AxiosRequestConfig {
    pathParams?: Record<string, string | number>;
  }
}

class Http {
  private static readonly baseURL: string = import.meta.env.VITE_BASE_URL;

  static initialize(): AxiosInstance {
    const _instance = axios.create({
      baseURL: this.baseURL,
    });

    _instance.interceptors.request.use(
      (config): InternalAxiosRequestConfig<any, any> => {
        const accessToken = Authenticator.getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
    );

    _instance.interceptors.response.use(
      (response) => response,
      async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
          return Promise.reject(error);
        }
        const status = error.response?.status;
        if (status == 401) Authenticator.reset();
      },
    );

    return _instance;
  }

  static url(
    template: string,
    params: Record<string, string | number>,
  ): string {
    return template.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name: string) => {
      const value = params[name];
      if (value === undefined) {
        throw new Error(
          `Http.url: missing value for ":${name}" in "${template}"`,
        );
      }
      return encodeURIComponent(String(value));
    });
  }
}

export default Http;
