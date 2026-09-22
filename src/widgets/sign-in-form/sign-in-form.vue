<script setup lang="ts">
import { useAccountStore } from "@/app/pinia/stores/account.store";
import Button from "@/shared/components/Button.vue";
import Input from "@/shared/components/Input.vue";
import API from "@/shared/services/api.d";
import { useForm } from "@tanstack/vue-form";
import { useMutation } from "@tanstack/vue-query";

const store = useAccountStore();

const { mutateAsync, isPending, error } = useMutation({
  mutationKey: [API.QueryKeys.Account],
  mutationFn: store.authenticate,
});

const required =
  (message: string) =>
  ({ value }: { value: string }) =>
    value?.trim() ? undefined : message;

const passwordRule = ({ value }: { value: string }) => {
  if (!value?.trim()) return "Введите пароль";
  if (value.length < 8) return "Пароль должен содержать не менее 8 символов";
  return undefined;
};

const form = useForm({
  defaultValues: {
    name: "",
    password: "",
  },
  onSubmit: async (v) => await mutateAsync(v.value),
});

const canSubmit = form.useStore((state) => {
  const name = state.values.name?.trim();
  const password = state.values.password;
  return Boolean(name && password && password.length >= 8);
});
</script>

<template>
  <form @submit.stop.prevent="form.handleSubmit">
    <div style="display: flex; flex-direction: column; gap: 0.2rem">
      <form.Field
        name="name"
        :validators="{
          onChange: required('Введите имя'),
          onBlur: required('Введите имя'),
          onSubmit: required('Введите имя'),
        }"
      >
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
      <form.Field
        name="password"
        :validators="{
          onChange: passwordRule,
          onBlur: passwordRule,
          onSubmit: passwordRule,
        }"
      >
        <template v-slot="{ field, state }">
          <label :htmlFor="field.name">Пароль:</label>
          <Input
            type="password"
            placeholder="Введите пароль"
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

    <p v-if="error" style="color: red">Неверный логин\пароль</p>

    <Button :disabled="isPending || !canSubmit">Войти</Button>
  </form>
</template>
