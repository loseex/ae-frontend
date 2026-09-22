<script setup lang="ts">
import OrdersTable from "@/widgets/orders-table/orders-table.vue";
</script>

<template>
  <main>
    <OrdersTable />
  </main>
</template>

<style lang="css" scoped>
main {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
</style>
