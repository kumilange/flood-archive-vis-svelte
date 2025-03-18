import './styles/global.css';
import { mount } from 'svelte';
import App from './routes/+page.svelte';

// Ensure the mount element exists before mounting
document.addEventListener('DOMContentLoaded', () => {
	const target = document.getElementById('app');

	if (!target) {
		console.error('Target element #app not found. Creating one.');
		const newTarget = document.createElement('div');
		newTarget.id = 'app';
		document.body.appendChild(newTarget);
		mount(App, { target: newTarget });
	} else {
		console.log('Mounting Svelte app to #app element');
		mount(App, { target });
	}
});
