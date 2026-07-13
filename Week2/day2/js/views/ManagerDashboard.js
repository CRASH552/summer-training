import { Store } from '../store.js';
import { el } from '../utils.js';
import { Router } from '../router.js';

export function ManagerDashboard() {
  const container = el('div', 'animate-fade-in');
  
  const header = el('div', 'flex justify-between items-center mb-8');
  header.appendChild(el('h1', '', 'Manager Dashboard'));
  
  // Stats row
  const shipments = Store.getShipments();
  const activeCount = shipments.filter(s => s.status === 'In Transit' || s.status === 'Created').length;
  const issueCount = shipments.filter(s => s.status === 'Issue').length;
  
  const stats = el('div', 'grid-2 mb-8');
  const stat1 = el('div', 'card flex items-center gap-4');
  stat1.innerHTML = `<i class="ph-fill ph-truck" style="font-size: 2.5rem; color: var(--primary)"></i>
                     <div><h3>${activeCount}</h3><p style="margin:0">Active Shipments</p></div>`;
  
  const stat2 = el('div', 'card flex items-center gap-4');
  stat2.innerHTML = `<i class="ph-fill ph-warning-circle" style="font-size: 2.5rem; color: var(--danger)"></i>
                     <div><h3>${issueCount}</h3><p style="margin:0">Shipments w/ Issues</p></div>`;
                     
  stats.appendChild(stat1);
  stats.appendChild(stat2);
  
  // All Shipments List
  const listContainer = el('div');
  listContainer.appendChild(el('h2', 'mb-4', 'All Shipments'));
  
  if (shipments.length === 0) {
    listContainer.appendChild(el('p', '', 'No shipments found.'));
  } else {
    const grid = el('div', 'grid-2');
    shipments.forEach(s => {
      const card = el('div', 'card interactive flex flex-col gap-2');
      card.onclick = () => Router.navigate(`shipment?id=${s.id}`);
      
      const titleRow = el('div', 'flex justify-between items-center');
      titleRow.innerHTML = `<h4>${s.title}</h4>`;
      
      let badgeClass = 'badge-success';
      if (s.status === 'Issue') badgeClass = 'badge-danger';
      else if (s.status === 'In Transit') badgeClass = 'badge-warning';
      
      titleRow.innerHTML += `<span class="badge ${badgeClass}">${s.status}</span>`;
      
      const customer = Store.getUserById(s.customerId);
      const employee = Store.getUserById(s.employeeId);
      
      card.appendChild(titleRow);
      card.appendChild(el('p', '', `<i class="ph ph-buildings"></i> Customer: ${customer ? customer.name : 'Unknown'}`));
      card.appendChild(el('p', '', `<i class="ph ph-user"></i> Assigned to: ${employee ? employee.name : 'Unassigned'}`));
      
      grid.appendChild(card);
    });
    listContainer.appendChild(grid);
  }
  
  container.appendChild(header);
  container.appendChild(stats);
  container.appendChild(listContainer);
  return container;
}
