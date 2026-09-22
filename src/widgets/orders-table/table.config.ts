import type { DataTableColumn } from "@/shared/components/data-table";
import type API from "@/shared/services/api";
import OrdersTableActions from "./orders-table-actions.vue";

export const columns: DataTableColumn<API.Order.T>[] = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "name",
    title: "Имя клиента",
  },
  {
    key: "address",
    title: "Адрес",
    search: true,
  },
  {
    key: "date",
    title: "Дата заказа",
    sort: true,
  },
  {
    key: "status",
    title: "Статус",
  },
  {
    key: "comment",
    title: "Комментарий",
  },
  {
    key: "id",
    title: "",
    render: {
      component: OrdersTableActions,
      props: (ctx) => ({ ...ctx }),
    },
  },
];
