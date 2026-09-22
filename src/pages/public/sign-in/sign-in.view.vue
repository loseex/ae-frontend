<script setup lang="ts">
import SignInForm from "@/widgets/sign-in-form/sign-in-form.vue";
</script>

<template>
  <main>
    <h2>Вход в аккаунт</h2>
    <p>Для использования приложения необходимо войти в аккаунт.</p>
    <SignInForm />
  </main>
</template>

<style lang="css" scoped>
main {
  width: 100%;
  max-width: 320px;
  min-height: 100svh;
  margin-inline: auto;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

main h1,
p {
  text-align: center;
}

main form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
