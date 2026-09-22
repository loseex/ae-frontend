import Core from "@/app/core";
import { Applications, Events, type Component } from "@/app/core/core.d";
import {
  loadApplication,
  loadAuthenticationApplication,
} from "@/app/core/__coregen.modules";
import {
  createApp,
  defineComponent,
  h,
  shallowRef,
  type App as VueApp,
} from "vue";
import { router } from "@/app/router";
import { pinia } from "@/app/pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";

class Fitter {
  private readonly root = "app";
  private app: VueApp | null = null;
  private readonly eventEmitter = Core.eventEmitter;

  private readonly currentComponent = shallowRef<Component | null>(null);

  private readonly applicationModules: Record<
    Applications,
    Promise<Component>
  > = {
    [Applications.APPLICATION]: loadApplication(),
    [Applications.AUTHENTICATION]: loadAuthenticationApplication(),
  };

  private getRootNode(): HTMLDivElement {
    const node = document.getElementById(this.root);
    if (!node) throw new Error(`Root element with id '${this.root}' not found`);
    return node as HTMLDivElement;
  }

  private createRootComponent() {
    const currentComponent = this.currentComponent;
    return defineComponent({
      name: "FitterRoot",
      setup() {
        return () => {
          const component = currentComponent.value;
          return component ? h(component) : null;
        };
      },
    });
  }

  private initializeApp(): void {
    if (this.app) return;

    const container = this.getRootNode();
    this.app = createApp(this.createRootComponent());

    this.app.use(router);
    this.app.use(pinia);
    this.app.use(VueQueryPlugin);

    this.app.mount(container);
  }

  private async loadAndMountApplication(
    applicationKey: Applications,
  ): Promise<void> {
    try {
      this.initializeApp();

      const component = await this.applicationModules[applicationKey];
      this.currentComponent.value = component;
    } catch (error) {
      console.error(`Failed to load application '${applicationKey}'`, error);
      throw new Error(
        `Application loading failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  private setupEventListeners(): void {
    this.eventEmitter.on(Events.MOUNT, (key) => {
      this.loadAndMountApplication(key).catch(console.error);
    });
  }

  private initialize(): void {
    this.initializeApp();
    this.setupEventListeners();
  }

  public bootstrap(): void {
    try {
      this.initialize();
    } catch (error) {
      console.error("Bootstrap failed", error);
    }
  }

  public get vueApp(): VueApp | null {
    return this.app;
  }
}

export default Fitter;
