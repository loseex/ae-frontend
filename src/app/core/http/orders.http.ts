import API from "@/shared/services/api.d";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import Core from "..";

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
