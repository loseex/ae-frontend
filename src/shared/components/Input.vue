<script setup lang="ts">
import type { InputHTMLAttributes } from "vue";
interface InputProps extends /* @vue-ignore */ InputHTMLAttributes {}
const props = defineProps<InputProps>();
</script>

<template>
  <input v-bind="props" />
</template>

<style scoped>
input {
  display: flex;
  width: 100%;
  height: 2.5rem;
  padding: 0.5rem 0.75rem;

  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #0f172a;

  background-color: #e2e8f0;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;

  outline: none;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out,
    background-color 0.15s ease-in-out;
}

input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.15);
}

input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background-color: #f8fafc;
}
</style>
