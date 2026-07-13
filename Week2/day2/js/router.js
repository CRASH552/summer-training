// Simple router
import { LoginView } from './views/Login.js';
import { ManagerDashboard } from './views/ManagerDashboard.js';
import { EmployeeDashboard } from './views/EmployeeDashboard.js';
import { CustomerDashboard } from './views/CustomerDashboard.js';
import { ShipmentView } from './views/ShipmentView.js';
import { AddCheckinView } from './views/AddCheckin.js';
import { Auth } from './auth.js';
import { renderNavbar } from './utils.js';

export const Router = {
  routes: {
    '': LoginView,
    'manager-dashboard': ManagerDashboard,
    'employee-dashboard': EmployeeDashboard,
    'customer-dashboard': CustomerDashboard,
    'shipment': ShipmentView,
    'add-checkin': AddCheckinView
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  handleRoute() {
    const root = document.getElementById('app');
    let hash = window.location.hash.replace('#', '').split('?')[0];
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');

    if (!hash) hash = '';

    // Route protection
    if (!Auth.isAuthenticated() && hash !== '') {
      this.navigate('');
      return;
    }

    if (Auth.isAuthenticated() && hash === '') {
      const user = Auth.getCurrentUser();
      if (user.role === 'manager') this.navigate('manager-dashboard');
      else if (user.role === 'employee') this.navigate('employee-dashboard');
      else if (user.role === 'customer') this.navigate('customer-dashboard');
      return;
    }

    // Render logic
    const viewFn = this.routes[hash];
    if (viewFn) {
      // Clear app and render navbar if not login
      root.innerHTML = '';
      if (hash !== '') {
        root.appendChild(renderNavbar());
      }
      
      const viewEl = viewFn(params);
      root.appendChild(viewEl);
    } else {
      root.innerHTML = '<h2>404 Not Found</h2>';
    }
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }
};
