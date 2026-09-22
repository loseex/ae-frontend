<script setup lang="ts">
import DataTable from "@/shared/components/data-table/DataTable.vue";
import { columns } from "./table.config";
import { onMounted } from "vue";
import { useOrdersStoreAPI } from "@/app/pinia/stores/orders.store";

const store = useOrdersStoreAPI();

onMounted(async () => {
  try {
    await store.apiFetch();
  } catch (e) {
    console.error(e);
  }
});
</script>

<template>
  <DataTable style="width: 100%" :columns="columns" :rows="store.value" />
</template>
