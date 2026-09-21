import { Events, type Callback, type Event } from "@/app/core/core.d";

class EventEmitter {
  private static instance: EventEmitter;
  private static events: Map<Events, Set<Event>>;

  constructor() {
    if (!EventEmitter.instance) {
      EventEmitter.events = new Map([[Events.MOUNT, new Set()]]);
      EventEmitter.instance = this;
    }

    return EventEmitter.instance;
  }

  public on(event: Events, listener: Callback): void {
    this.registerListener(event, listener, false);
  }

  public once(event: Events, listener: Callback): void {
    this.registerListener(event, listener, true);
  }

  public emit<T extends any[]>(event: Events, ...args: T): void {
    const actions = EventEmitter.events.get(event);
    if (!actions) return;

    const actionsCopy = new Set(actions);

    actionsCopy.forEach((action) => {
      if (action.once) {
        this.removeListener(event, action.listener);
      }
      try {
        action.listener(...args);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  public removeListener(event: Events, listener: Callback): void {
    const actions = EventEmitter.events.get(event);
    if (!actions) return;

    for (const action of actions) {
      if (action.listener === listener) {
        actions.delete(action);
        break;
      }
    }
  }

  public removeAllListeners(event: Events): void {
    EventEmitter.events.get(event)?.clear();
  }

  private registerListener(
    event: Events,
    listener: Callback,
    once: boolean,
  ): void {
    if (!EventEmitter.events.has(event)) {
      EventEmitter.events.set(event, new Set());
    }
    EventEmitter.events.get(event)!.add({ once, listener });
  }
}

export default EventEmitter;
