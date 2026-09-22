<script setup lang="ts">
import OrderCreateForm from "@/widgets/order-create-form/order-create-form.vue";
</script>

<template>
  <main>
    <h3>Создание заказа</h3>
    <OrderCreateForm />
  </main>
</template>

<style lang="css" scoped>
main {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  align-items: start;
  margin-inline: auto;
  padding: 6rem 2rem;
}

main h1 {
  width: 100%;
  text-align: start;
}

main form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
