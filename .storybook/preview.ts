import type { Preview } from '@storybook/vue3';
import { setup } from '@storybook/vue3';
import { createMemoryHistory, createRouter } from 'vue-router';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import 'primeicons/primeicons.css';
import '../src/assets/main.css';

// Khởi tạo PrimeVue + services + router bộ nhớ cho tất cả stories
setup((app) => {
  app.use(PrimeVue, {
    theme: { preset: Aura }
  });
  app.use(ToastService);
  app.use(ConfirmationService);

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/login', component: { template: '<div />' } },
      { path: '/register', component: { template: '<div />' } },
      { path: '/list', component: { template: '<div />' } },
      { path: '/student', component: { template: '<div />' } },
      { path: '/student/:id', component: { template: '<div />' } }
    ]
  });
  app.use(router);
});

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'centered'
  }
};

export default preview;



