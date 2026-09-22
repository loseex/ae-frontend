<script setup lang="ts">
import { useAccountStore } from "@/app/pinia/stores/account.store";
import { useOrdersStoreAPI } from "@/app/pinia/stores/orders.store";
import Button from "@/shared/components/Button.vue";
import Input from "@/shared/components/Input.vue";
import API from "@/shared/services/api.d";
import { useForm } from "@tanstack/vue-form";
import { useMutation } from "@tanstack/vue-query";

const account = useAccountStore();
const store = useOrdersStoreAPI();

const { mutateAsync, isPending } = useMutation({
  mutationKey: [API.QueryKeys.Orders],
  mutationFn: store.apiPostCreate,
});

const formatDate = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleString("ru-RU", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const form = useForm({
  defaultValues: {
    name: account.value?.name ?? "",
    address: "",
    comment: "",
  },
  onSubmit: async (v) =>
    await mutateAsync({
      ...v.value,
      status: API.Order.Status.NEW,
      date: formatDate(new Date()),
    }),
});
</script>

<template>
  <form @submit.stop.prevent="form.handleSubmit">
    <div style="display: flex; flex-direction: column; gap: 0.2rem">
      <form.Field name="name">
        <template v-slot="{ field, state }">
          <label :htmlFor="field.name">Ваше имя:</label>
          <Input
            type="text"
            placeholder="Введите ваше имя"
            style="width: 100%"
            :id="field.name"
            :name="field.name"
            :value="field.state.value"
            :disabled="isPending"
            @input="
              (e) => field.handleChange((e.target as HTMLInputElement).value)
            "
            @blur="field.handleBlur"
          />
          <FieldInfo :state="state" />
        </template>
      </form.Field>
    </div>

    <div style="display: flex; flex-direction: column; gap: 0.2rem">
      <form.Field name="address">
        <template v-slot="{ field, state }">
          <label :htmlFor="field.name">Ваш адрес:</label>
          <Input
            type="text"
            placeholder="Введите ваш адрес"
            style="width: 100%"
            :id="field.name"
            :name="field.name"
            :value="field.state.value"
            :disabled="isPending"
            @input="
              (e) => field.handleChange((e.target as HTMLInputElement).value)
            "
            @blur="field.handleBlur"
          />
          <FieldInfo :state="state" />
        </template>
      </form.Field>
    </div>

    <div style="display: flex; flex-direction: column; gap: 0.2rem">
      <form.Field name="comment">
        <template v-slot="{ field, state }">
          <label :htmlFor="field.name">Можете оставить комментарий:</label>
          <Input
            type="text"
            placeholder="Введите текст для комментария"
            style="width: 100%"
            :id="field.name"
            :name="field.name"
            :value="field.state.value"
            :disabled="isPending"
            @input="
              (e) => field.handleChange((e.target as HTMLInputElement).value)
            "
            @blur="field.handleBlur"
          />
          <FieldInfo :state="state" />
        </template>
      </form.Field>
    </div>

    <Button style="width: 100%" :disabled="isPending">Создать заказ</Button>
  </form>
</template>
