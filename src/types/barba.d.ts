declare module '@barba/core' {
  export interface BarbaConfig {
    prevent?: ({ href }: { href: string }) => boolean;
    transitions?: TransitionConfig[];
    views?: ViewConfig[];
  }

  export interface TransitionConfig {
    name?: string;
    sync?: boolean;
    from?: { namespace?: string | string[] } | { route?: string };
    to?: { namespace?: string | string[] } | { route?: string };
    beforeLeave?: (data: TransitionData) => Promise<void> | void;
    leave?: (data: TransitionData) => Promise<void> | void;
    afterLeave?: (data: TransitionData) => Promise<void> | void;
    beforeEnter?: (data: TransitionData) => Promise<void> | void;
    enter?: (data: TransitionData) => Promise<void> | void;
    afterEnter?: (data: TransitionData) => Promise<void> | void;
  }

  export interface TransitionData {
    current: {
      container: HTMLElement;
      html: string;
      namespace: string;
      url: { href: string; path: string };
    };
    next: {
      container: HTMLElement;
      html: string;
      namespace: string;
      url: { href: string; path: string };
    };
    trigger: string | HTMLElement | null;
  }

  export interface ViewConfig {
    namespace: string;
    beforeEnter?: (data: TransitionData) => Promise<void> | void;
    afterEnter?: (data: TransitionData) => Promise<void> | void;
    beforeLeave?: (data: TransitionData) => Promise<void> | void;
    afterLeave?: (data: TransitionData) => Promise<void> | void;
  }

  export interface BarbaInstance {
    init: (config: BarbaConfig) => void;
    destroy: () => void;
    hooks: {
      before: (callback: () => void) => void;
      after: (callback: () => void) => void;
    };
  }

  // Barba exports the instance directly, not a factory function
  const barba: BarbaInstance;
  export default barba;
}
