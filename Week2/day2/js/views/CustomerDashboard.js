import { Store } from '../store.js'; 
import { Auth } from '../auth.js';
import { el } from '../utils.js';
import { Router } from '../router.js';

export function CustomerDashboard() {
  const user = Auth.getCurrentUser();
  const container = el('div', 'animate-fade-in');
  
  const header = el('div', 'flex justify-between items-center mb-8');
  header.appendChild(el('h1', '', 'My Shipments'));
  
  const shipments = Store.getShipments().filter(s => s.customerId === user.id);
  
  if (shipments.length === 0) {
    container.appendChild(header);
    container.appendChild(el('div', 'card text-center', '<p>You have no active shipments.</p>'));
    return container;
  }
  
  const grid = el('div', 'grid-2');
  shipments.forEach(s => {
    const card = el('div', 'card interactive flex flex-col gap-4');
    card.onclick = () => Router.navigate(`shipment?id=${s.id}`);
    
    const titleRow = el('div', 'flex justify-between items-center');
    titleRow.innerHTML = `<h4>${s.title}</h4>`;
    let badgeClass = 'badge-success';
    if (s.status === 'Issue') badgeClass = 'badge-danger';
    else if (s.status === 'In Transit') badgeClass = 'badge-warning';
    titleRow.innerHTML += `<span class="badge ${badgeClass}">${s.status}</span>`;
    
    const latestCheckin = s.timeline.length > 0 ? s.timeline[s.timeline.length - 1] : null;
    let statusText = 'Awaiting initial check-in';
    if (latestCheckin) {
      statusText = `Last seen: ${latestCheckin.location} (${latestCheckin.status})`;
    }
    
    card.appendChild(titleRow);
    card.appendChild(el('p', '', `<i class="ph ph-map-pin"></i> ${statusText}`));
    
    const viewBtn = el('button', 'btn btn-secondary mt-2', 'Track & Messages');
    card.appendChild(viewBtn);
    
    grid.appendChild(card);
  });
  
  container.appendChild(header);
  container.appendChild(grid);
  return container;
}
