import Core from "@/app/core";
import { Applications, Events, type Component } from "@/app/core/core.d";
import {
  loadApplication,
  loadAuthenticationApplication,
} from "@/app/core/__coregen.modules";
import { createApp, type App as VueApp } from "vue";
import { router } from "@/app/router";

class Fitter {
  private readonly root = "app";
  private app: VueApp | null = null;
  private readonly eventEmitter = Core.eventEmitter;

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

  private mountApplication(component: Component): void {
    const container = this.getRootNode();

    if (this.app) {
      this.app.unmount();
      this.app = null;
    }

    this.app = createApp(component);

    this.app.use(router);

    this.app.mount(container);
  }

  private async loadAndMountApplication(
    applicationKey: Applications,
  ): Promise<void> {
    try {
      const component = await this.applicationModules[applicationKey];
      this.mountApplication(component);
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
    this.setupEventListeners();
  }

  public bootstrap(): void {
    try {
      this.initialize();

      // ! temp solution
      this.eventEmitter.emit(Events.MOUNT, Applications.APPLICATION);
    } catch (error) {
      console.error("Bootstrap failed", error);
    }
  }
}

export default Fitter;
