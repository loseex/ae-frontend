<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import API from "@/shared/services/api.d";
import { columns } from "./table.config";
import { useOrdersStoreAPI } from "@/app/pinia/stores/orders.store";
import DataTable from "@/shared/components/data-table/DataTable.vue";

const store = useOrdersStoreAPI();

useQuery({
  queryKey: [API.QueryKeys.Orders],
  queryFn: store.apiFetch,
});
</script>

<template>
  <DataTable style="width: 100%" :columns="columns" :rows="store.orders" />
</template>
