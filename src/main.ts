import { mount } from 'svelte';
import App from './App.svelte';
import { initBionicReading } from './lib/bionic';

initBionicReading();

const app = mount(App, {
  target: (() => {
    const app = document.createElement('div');
    document.body.append(app);
    return app;
  })(),
});

export default app;
