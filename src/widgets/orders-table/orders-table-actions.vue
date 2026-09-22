<script setup lang="ts">
import { useAccountStore } from "@/app/pinia/stores/account.store";
import { useOrdersStoreAPI } from "@/app/pinia/stores/orders.store";
import AlertDialog from "@/shared/components/AlertDialog.vue";
import Button from "@/shared/components/Button.vue";
import type { CellContext } from "@/shared/components/data-table";
import API from "@/shared/services/api.d";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { Ref } from "vue";

const queryClient = useQueryClient();
const props = defineProps<CellContext<API.Order.T>>();

const store = useOrdersStoreAPI();
const account = useAccountStore();

const { mutateAsync: mutateAsyncUpdate, isPaused: isPausedUpdate } =
  useMutation({
    mutationKey: [API.QueryKeys.Orders],
    mutationFn: store.apiMarkDone,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [API.QueryKeys.Orders] });
    },
  });

const { mutateAsync: mutateAsyncDelete } = useMutation({
  mutationKey: [API.QueryKeys.Orders],
  mutationFn: store.apiDeleteOrder,
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: [API.QueryKeys.Orders] });
  },
});

const isDisabled: Ref<boolean, boolean> = isPausedUpdate;
</script>

<template>
  <div class="container" v-if="account.isAllowed()">
    <Button
      v-if="props.row.status === API.Order.Status.NEW"
      @click="() => mutateAsyncUpdate(props.row.id)"
      :disabled="isDisabled"
      >Изменить статус</Button
    >

    <AlertDialog
      :heading="`Вы уверены что хотите удалить заказ от ${props.row.name}?`"
      description="Это действие будет невозможно отменить."
      @submit="() => mutateAsyncDelete(props.row.id)"
    >
      <Button :disabled="isDisabled">Удалить</Button>
    </AlertDialog>
  </div>
</template>

<style lang="css" scoped>
.container {
  width: 100%;
  display: inline-flex;
  justify-content: end;
  gap: 1rem;
}
</style>
