import { writable } from "svelte/store";
import { FlyToInterpolator } from '@deck.gl/core';
import { AREAS, INITIAL_VIEW_STATE } from "./constants";

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
export type BoundsType = [[number, number], [number, number]];

export const viewState = writable<ViewStateType>(INITIAL_VIEW_STATE);
export const bounds = writable<BoundsType>(AREAS["all"]?.boundary);

export function updateViewState(newViewState: Partial<ViewStateType>) {
  viewState.update((state) => ({ ...state, ...newViewState }));
}

export function updateBounds(newBounds: BoundsType) {
  bounds.set(newBounds);
}

