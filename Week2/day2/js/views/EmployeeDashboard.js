import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { el } from '../utils.js';
import { Router } from '../router.js';

export function EmployeeDashboard() {
  const user = Auth.getCurrentUser();
  const container = el('div', 'animate-fade-in');
  
  const header = el('div', 'flex justify-between items-center mb-8');
  header.appendChild(el('h1', '', 'My Assignments'));
  
  const shipments = Store.getShipments().filter(s => s.employeeId === user.id);
  
  if (shipments.length === 0) {
    container.appendChild(header);
    container.appendChild(el('div', 'card text-center', '<p>You have no assigned shipments at this time.</p>'));
    return container;
  }
  
  const grid = el('div', 'grid-2');
  shipments.forEach(s => {
    const card = el('div', 'card flex flex-col gap-4');
    
    const titleRow = el('div', 'flex justify-between items-center');
    titleRow.innerHTML = `<h4>${s.title}</h4>`;
    let badgeClass = 'badge-success';
    if (s.status === 'Issue') badgeClass = 'badge-danger';
    else if (s.status === 'In Transit') badgeClass = 'badge-warning';
    titleRow.innerHTML += `<span class="badge ${badgeClass}">${s.status}</span>`;
    
    const customer = Store.getUserById(s.customerId);
    
    const actions = el('div', 'flex gap-2 mt-4');
    
    const viewBtn = el('button', 'btn btn-secondary', 'View & Chat');
    viewBtn.style.flex = '1';
    viewBtn.onclick = () => Router.navigate(`shipment?id=${s.id}`);
    
    const checkinBtn = el('button', 'btn btn-primary', 'Add Check-in');
    checkinBtn.style.flex = '1';
    // Only allow check-ins if not completed
    if (s.status === 'Completed') {
        checkinBtn.disabled = true;
        checkinBtn.style.opacity = '0.5';
        checkinBtn.style.cursor = 'not-allowed';
    } else {
        checkinBtn.onclick = () => Router.navigate(`add-checkin?id=${s.id}`);
    }
    
    actions.appendChild(viewBtn);
    actions.appendChild(checkinBtn);
    
    card.appendChild(titleRow);
    card.appendChild(el('p', '', `<i class="ph ph-buildings"></i> Client: ${customer ? customer.name : 'Unknown'}`));
    card.appendChild(actions);
    
    grid.appendChild(card);
  });
  
  container.appendChild(header);
  container.appendChild(grid);
  return container;
}
