import API from "@/shared/services/api.d";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import Core from "..";
import Http from "../api/http.api";

export async function findAllOrders(): Promise<
  AxiosResponse<API.Order.GetAll.Response>
> {
  return await Core.http.get<API.Order.GetAll.Response>(API.Order.GetAll.URL);
}

export async function postCreateOrder(
  body: API.Order.PostCreate.RequestBody,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<unknown>> {
  return await Core.http.post<unknown>(API.Order.PostCreate.URL, body, config);
}

export async function patchOrder(
  id: number | string,
  body: API.Order.Patch.RequestBody,
  config?: AxiosRequestConfig,
) {
  return await Core.http.patch<API.Order.T>(
    Http.url(API.Order.Patch.URL, { id }),
    body,
    config,
  );
}

export async function deleteOrder(
  id: number | string,
  config?: AxiosRequestConfig,
) {
  return await Core.http.delete(Http.url(API.Order.Delete.URL, { id }), config);
}
