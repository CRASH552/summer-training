import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { Router } from '../router.js';
import { el } from '../utils.js';

export function LoginView() {
  const container = el('div', 'flex flex-col items-center justify-center animate-fade-in');
  container.style.minHeight = '80vh';

  const card = el('div', 'card');
  card.style.width = '100%';
  card.style.maxWidth = '400px';

  const title = el('h2', 'text-center mb-8', '<i class="ph-fill ph-package" style="color: var(--primary)"></i> Delivery Checker');
  
  const instruction = el('p', 'text-center mb-4', 'Select a user to simulate login:');
  
  const usersList = el('div', 'flex flex-col gap-4');
  
  const users = Store.getUsers();
  users.forEach(user => {
    const btn = el('button', 'btn btn-secondary', `
      <div class="flex flex-col items-start w-full">
        <span style="font-weight: 600">${user.name}</span>
        <span class="badge badge-neutral mt-2" style="font-size: 0.65rem">${user.role}</span>
      </div>
    `);
    btn.style.width = '100%';
    btn.style.justifyContent = 'flex-start';
    btn.onclick = () => {
      if (Auth.login(user.id)) {
        // Router will handle redirect on hash change, but we trigger it
        window.location.hash = ''; // reset hash
        Router.handleRoute(); // force re-evaluate route
      }
    };
    usersList.appendChild(btn);
  });

  card.appendChild(title);
  card.appendChild(instruction);
  card.appendChild(usersList);
  container.appendChild(card);
  
  return container;
}
