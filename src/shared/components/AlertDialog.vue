<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Teleport } from "vue";
import Button from "./Button.vue";

interface DialogProps {
  to?: string;
  open?: boolean;
  heading: string;
  description?: string;
  actionLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}

const props = withDefaults(defineProps<DialogProps>(), {
  to: "body",
  open: undefined,
  actionLabel: "Подтвердить",
  cancelLabel: "Отмена",
  loading: false,
  closeOnOverlay: true,
  closeOnEsc: true,
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "submit"): void;
  (e: "cancel"): void;
}>();

const internalOpen = ref(false);

const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() =>
  isControlled.value ? (props.open as boolean) : internalOpen.value,
);

const isSubmitting = ref(false);
const isBusy = computed(() => props.loading || isSubmitting.value);

function setOpen(value: boolean) {
  if (!isControlled.value) internalOpen.value = value;
  emit("update:open", value);
}

function toggle() {
  if (isBusy.value) return;
  setOpen(!isOpen.value);
}

function close() {
  if (isBusy.value) return;
  setOpen(false);
}

function handleSubmit() {
  emit("submit");
}

function handleCancel() {
  emit("cancel");
  close();
}

function onOverlayClick(e: MouseEvent) {
  if (!props.closeOnOverlay) return;
  if (e.target === e.currentTarget) close();
}

function onKeydown(e: KeyboardEvent) {
  if (!props.closeOnEsc) return;
  if (e.key === "Escape") close();
}

watch(
  isOpen,
  (v) => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = v ? "hidden" : "";
  },
  { immediate: true },
);
</script>

<template>
  <span
    class="alert-dialog__trigger"
    role="button"
    tabindex="0"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <slot />
  </span>

  <Teleport :to="props.to">
    <Transition name="dialog-fade">
      <div
        v-if="isOpen"
        class="alert-dialog__overlay"
        role="presentation"
        tabindex="-1"
        @click="onOverlayClick"
        @keydown="onKeydown"
      >
        <div
          class="alert-dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="dialog-heading"
          :aria-describedby="
            props.description ? 'dialog-description' : undefined
          "
        >
          <header class="alert-dialog__header">
            <h3 id="dialog-heading" class="alert-dialog__heading">
              {{ props.heading }}
            </h3>
            <p
              v-if="props.description"
              id="dialog-description"
              class="alert-dialog__description"
            >
              {{ props.description }}
            </p>
          </header>

          <footer class="alert-dialog__footer">
            <Button :disabled="isBusy" @click="handleCancel">{{
              props.cancelLabel
            }}</Button>
            <Button :loading="isBusy" @click="handleSubmit">{{
              props.actionLabel
            }}</Button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.alert-dialog__trigger {
  display: inline-flex;
  cursor: pointer;
}

.alert-dialog__overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
}

.alert-dialog {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.15),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #0f172a;
}

.alert-dialog__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-dialog__heading {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.alert-dialog__description {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
}

.alert-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-active .alert-dialog,
.dialog-fade-leave-active .alert-dialog {
  transition: transform 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .alert-dialog,
.dialog-fade-leave-to .alert-dialog {
  transform: scale(0.96) translateY(8px);
}
</style>
