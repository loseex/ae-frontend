<script setup lang="ts">
import { useAccountStore } from "@/app/pinia/stores/account.store";
import Button from "@/shared/components/Button.vue";
import Input from "@/shared/components/Input.vue";
import API from "@/shared/services/api.d";
import { useForm } from "@tanstack/vue-form";
import { useMutation } from "@tanstack/vue-query";

const store = useAccountStore();

const { mutateAsync, isPending } = useMutation({
  mutationKey: [API.QueryKeys.Account],
  mutationFn: store.authenticate,
});

const form = useForm({
  defaultValues: {
    name: "",
    password: "",
  },
  onSubmit: async (v) => await mutateAsync(v.value),
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
      <form.Field name="password">
        <template v-slot="{ field, state }">
          <label :htmlFor="field.name">Пароль:</label>
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

    <Button :disabled="isPending">Войти</Button>
  </form>
</template>
