import type {
  ConcreteComponent,
  FunctionalComponent,
  ComponentPublicInstance,
} from "vue";

type ConcreteComponent = ComponentOptions | FunctionalComponent;
export type Component = ConcreteComponent | ComponentPublicInstance;

export enum Applications {
  APPLICATION = "application",
  AUTHENTICATION = "authentication",
}

export type PureFunction = ConcreteComponent;
export type Node = () => HTMLDivElement;
export type ReactDOM = ReactDOM.Root | null;
export type Callback = (...args: any[]) => void;

export enum Events {
  MOUNT = "Core::Fitter::Event::MOUNT",
}

export type Event = {
  once: boolean;
  listener: Callback;
};

export interface Array {
  [Events.MOUNT]: Event[];
}
