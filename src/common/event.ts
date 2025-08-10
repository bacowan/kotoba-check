export class Event<Args extends any[]> {
  private listeners = new Set<(...args: Args) => void>();

  subscribe(callback: (...args: Args) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback); // unsubscribe
  }

  trigger(...args: Args): void {
    for (const listener of this.listeners) {
      listener(...args);
    }
  }
}