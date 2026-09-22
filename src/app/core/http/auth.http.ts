import API from "@/shared/services/api.d";
import Core from "@/app/core";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

export async function authenticate(
  body: API.Authentication.Authenticate.RequestBody,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<API.Authentication.Authenticate.Response>> {
  return await Core.http.post<API.Authentication.Authenticate.Response>(
    API.Authentication.Authenticate.URL,
    body,
    config,
  );
}

export async function me(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<API.Authentication.Me.Response>> {
  return await Core.http.get<API.Authentication.Me.Response>(
    API.Authentication.Me.URL,
    config,
  );
}
