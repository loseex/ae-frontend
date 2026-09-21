import type { AxiosInstance } from "axios";
import axios from "axios";

class Http {
  private static readonly baseURL: string = import.meta.env.BASE_URL;

  static initialize(): AxiosInstance {
    return axios.create({
      baseURL: this.baseURL,
    });
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
