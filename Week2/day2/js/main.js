import { Store } from './store.js';
import { Router } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  Router.init();
}); 
