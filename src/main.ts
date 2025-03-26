import { mount } from "svelte";
import { load } from '@loaders.gl/core';
import { _GeoJSONLoader as GeoJSONLoader } from '@loaders.gl/json';
import { DATA_URL } from './lib/constants';
import App from "./routes/+page.svelte";
import Error from "./components/Error.svelte";
import './styles/global.css';

// Ensure the mount element exists before mounting
document.addEventListener("DOMContentLoaded", async () => {
  const target = document.getElementById("app") as HTMLElement;

  try {
    const geojson = await load(DATA_URL, GeoJSONLoader, {
      json: {
        tableFormat: 'geojson',
      },
    });

    mount(App, { target, props: { data: geojson } });
  } catch (error) {
    mount(Error, { target, props: { error: error instanceof Error ? error['message'] : String(error) } });
  }
})