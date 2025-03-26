import { writable } from "svelte/store";
import { FlyToInterpolator } from '@deck.gl/core';
import { AREAS, INITIAL_VIEW_STATE } from "./constants";

// View State Store
export type ViewStateType = {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
  minZoom?: number;
  maxZoom?: number;
  minPitch?: number;
  maxPitch?: number;
  transitionDuration?: number | "auto";
  transitionInterpolator?: FlyToInterpolator;
};

// Bounds Type for area selection
export type BoundsType = [[number, number], [number, number]];

// Create stores using Svelte's writable stores
export const viewState = writable<ViewStateType>(INITIAL_VIEW_STATE);
export const bounds = writable<BoundsType>(AREAS["all"]?.boundary);
export const timeFilterRange = writable<[number, number] | undefined>(
  undefined,
);

export function updateViewState(newViewState: Partial<ViewStateType>) {
  viewState.update((state) => ({ ...state, ...newViewState }));
}

export function updateBounds(newBounds: BoundsType) {
  bounds.set(newBounds);
}

export function updateTimeFilter(newRange: [number, number] | undefined) {
  timeFilterRange.set(newRange);
}
