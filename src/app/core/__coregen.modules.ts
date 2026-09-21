import type { ConcreteComponent } from "@/app/core/core.d";

export async function loadApplication(): Promise<ConcreteComponent> {
  const loaders = Object.values(
    import.meta.glob<ConcreteComponent>("/src/app/modules/App.vue", {
      import: "default",
    }),
  );

  const load = loaders[0];
  if (!load) throw new Error("App.vue not found in glob");

  return load();
}

export async function loadAuthenticationApplication(): Promise<ConcreteComponent> {
  const loaders = Object.values(
    import.meta.glob<ConcreteComponent>("/src/app/modules/Authentication.vue", {
      import: "default",
    }),
  );

  const load = loaders[0];
  if (!load) throw new Error("Authentication.vue not found in glob");

  return load();
}
