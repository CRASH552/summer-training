import { Store } from './store.js';

export const Auth = {
  login(userId) {
    const user = Store.getUserById(userId);
    if (user) {
      localStorage.setItem('dc_current_user', JSON.stringify(user));
      return true;
    }
    return false;
  }, 

  logout() {
    localStorage.removeItem('dc_current_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('dc_current_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }
};
