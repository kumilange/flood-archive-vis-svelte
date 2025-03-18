/// <reference types="svelte" />

// Type definitions for Svelte 5 runes
declare global {
  // Runes
  function $state<T>(initialValue: T): T;
  function $state<T>(): T | undefined;
  function $derived<T>(expression: T): T;
  function $props<T>(): T;
  function $effect(fn: () => void): void;
  function $effect(fn: () => () => void): void;
  function $effect<T>(expression: T): void;
}

export {};
