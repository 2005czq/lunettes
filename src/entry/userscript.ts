import { mount } from 'svelte';
import App from '../app/App.svelte';
import { initBionicReading } from '../core/bionic';

initBionicReading();

const app = mount(App, {
  target: (() => {
    const app = document.createElement('div');
    document.body.append(app);
    return app;
  })(),
});

export default app;
