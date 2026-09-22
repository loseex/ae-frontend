import Core from "@/app/core";
import { Applications, Events } from "../core.d";
import { useAccountStore } from "@/app/pinia/stores/account.store";

class Authenticator {
  private static readonly field = "sessions::access";

  static async initialize(): Promise<void> {
    const store = useAccountStore();

    if (Authenticator.hasTokens() == false) {
      return void Core.eventEmitter.emit(
        Events.MOUNT,
        Applications.AUTHENTICATION,
      );
    }

    try {
      await store.me();
      return void Core.eventEmitter.emit(
        Events.MOUNT,
        Applications.APPLICATION,
      );
    } catch (e) {
      console.error(e);
      this.reset();
    }
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.field);
  }

  static setAccessToken(value: string): void {
    void localStorage.setItem(this.field, value);
  }

  static hasTokens(): boolean {
    return localStorage.getItem(this.field) !== null;
  }

  static reset(): void {
    void localStorage.removeItem(this.field);
  }
}

export default Authenticator;
