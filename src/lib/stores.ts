import { writable } from 'svelte/store';
import { AREAS, INITIAL_VIEW_STATE } from './constants';

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
	transitionDuration?: number | 'auto';
};

// Bounds Type for area selection
export type BoundsType = [[number, number], [number, number]];

// Create stores using Svelte's writable stores
export const viewState = writable<ViewStateType>(INITIAL_VIEW_STATE);
export const bounds = writable<BoundsType>(AREAS['all'].boundary);

// Time filter state
export const timeFilterRange = writable<[number, number] | undefined>(undefined);

// Function to update view state
export function updateViewState(newViewState: Partial<ViewStateType>) {
	viewState.update(state => ({ ...state, ...newViewState }));
}

// Function to update bounds
export function updateBounds(newBounds: BoundsType) {
	bounds.set(newBounds);
}

// Function to update time filter
export function updateTimeFilter(newRange: [number, number] | undefined) {
	timeFilterRange.set(newRange);
} 