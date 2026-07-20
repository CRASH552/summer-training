import { Auth } from './auth.js';

export function el(tag, className = '', content = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (typeof content === 'string') {
    element.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  } else if (Array.isArray(content)) {
    content.forEach(child => element.appendChild(child));
  }
  return element; 
}

export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
}

export function renderNavbar() {
  const user = Auth.getCurrentUser();
  const nav = el('nav', 'navbar animate-fade-in');
  
  const brand = el('div', 'nav-brand', '<i class="ph-fill ph-package"></i> Delivery Checker');
  
  const rightArea = el('div', 'nav-links');
  if (user) {
    rightArea.appendChild(el('span', 'badge badge-neutral', user.role));
    rightArea.appendChild(el('span', '', `Hi, ${user.name}`));
    
    const logoutBtn = el('button', 'btn btn-secondary', 'Logout');
    logoutBtn.style.padding = '0.5rem 1rem';
    logoutBtn.onclick = () => {
      Auth.logout();
      window.location.hash = '';
    };
    rightArea.appendChild(logoutBtn);
  }
  
  nav.appendChild(brand);
  nav.appendChild(rightArea);
  return nav;
}
