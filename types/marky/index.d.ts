declare module "marky" {
  export interface Entry {
    name: string;
    startTime: number;
    duration: number;
    entryType: string;
  }
  export function mark(name: string): void;
  export function stop(name: string): Entry;
  export function clear(): void;
  export function getEntries(): Entry[];
}
