<script setup lang="ts">
import Button from "@/shared/components/Button.vue";
import { NavbarRouterLinks } from "./navbar.const";
import AlertDialog from "@/shared/components/AlertDialog.vue";
import { useAccountStore } from "@/app/pinia/stores/account.store";

const store = useAccountStore();
</script>

<template>
  <nav class="navbar">
    <section>
      <template v-for="value in NavbarRouterLinks" v-bind:key="value.path">
        <RouterLink :to="value.path">{{ value.label }}</RouterLink>
      </template>
    </section>
    <section>
      <span>{{ store.value?.name }}</span>
      <AlertDialog
        heading="Вы уверенны что хотите выйти из текущего аккаунта?"
        description="Войти обратно можно будет в любой момент."
        @submit="store.logout"
      >
        <Button>Выйти из аккаунта</Button>
      </AlertDialog>
    </section>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--primary);
}

.navbar section {
  max-width: fit-content;
  display: inline-flex;
  justify-content: start;
  align-items: center;
  gap: 2rem;
}

.navbar section span {
  color: var(--primary-foreground) !important;
}

.navbar section a {
  font-size: 1rem;
  color: var(--primary-foreground) !important;
  text-decoration: none;
}

.navbar section a:hover {
  opacity: 0.9;
}
</style>
