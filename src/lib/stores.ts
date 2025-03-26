import { writable } from "svelte/store";

export const map = writable<maplibregl.Map>();

export function setMap(newMap: maplibregl.Map) {
  map.set(newMap);
}
