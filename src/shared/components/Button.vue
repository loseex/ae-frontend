<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";
interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
  label?: string;
}
const props = defineProps<ButtonProps>();
</script>

<template>
  <button v-bind="props">{{ props.label }}</button>
</template>

<style scoped>
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  white-space: nowrap;
  height: 2.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  outline: none;
  transition:
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out,
    transform 0.05s ease-in-out;
  background-color: var(--primary);
  color: var(--primary-foreground);
}

button:hover {
  cursor: pointer;
}

button:disabled {
  opacity: 80%;
  pointer-events: none;
}
</style>
