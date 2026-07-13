import { Store } from '../store.js';
import { el } from '../utils.js';
import { Router } from '../router.js';

export function AddCheckinView(params) {
  const shipmentId = params.get('id');
  const shipment = Store.getShipmentById(shipmentId);
  
  const container = el('div', 'animate-fade-in flex justify-center');
  
  if (!shipment) {
    container.appendChild(el('h2', '', 'Shipment not found.'));
    return container;
  }
  
  const card = el('div', 'card');
  card.style.width = '100%';
  card.style.maxWidth = '600px';
  
  const titleRow = el('div', 'flex items-center gap-4 mb-8');
  const backBtn = el('button', 'btn btn-secondary', '<i class="ph ph-arrow-left"></i>');
  backBtn.style.padding = '0.5rem';
  backBtn.onclick = () => window.history.back();
  titleRow.appendChild(backBtn);
  titleRow.appendChild(el('h2', 'mb-0', 'Add Check-in'));
  card.appendChild(titleRow);
  
  card.appendChild(el('p', 'mb-8', `Recording condition for: <strong>${shipment.title}</strong>`));
  
  // Form elements
  const locationGrp = el('div', 'form-group');
  locationGrp.innerHTML = `<label class="form-label">Current Location / Checkpoint</label>
                           <input type="text" id="chkLocation" class="form-input" placeholder="e.g. Warehouse B" required>`;
                           
  const statusGrp = el('div', 'form-group');
  statusGrp.innerHTML = `<label class="form-label">Condition Status</label>
                         <select id="chkStatus" class="form-select">
                           <option value="OK">OK - Intact</option>
                           <option value="Issue Found">Issue Found - Damaged/Missing</option>
                         </select>`;
                         
  const noteGrp = el('div', 'form-group');
  noteGrp.innerHTML = `<label class="form-label">Inspection Notes</label>
                       <textarea id="chkNote" class="form-textarea" placeholder="Describe the condition..."></textarea>`;
                       
  const photoGrp = el('div', 'form-group mb-8');
  photoGrp.innerHTML = `<label class="form-label">Attach Photo Evidence</label>
                        <input type="file" id="chkPhoto" class="form-input" accept="image/*">
                        <small style="color: var(--text-secondary)">Simulation: photo will be saved as a mock filename.</small>`;

  const finalGrp = el('div', 'form-group mb-8 flex items-center gap-2');
  finalGrp.innerHTML = `<input type="checkbox" id="chkFinal" style="width: 18px; height: 18px;">
                        <label for="chkFinal" style="margin:0; font-weight: 500">Mark as Final Delivery (Completes Shipment)</label>`;

  const submitBtn = el('button', 'btn btn-primary', 'Save Check-in');
  submitBtn.style.width = '100%';
  
  submitBtn.onclick = () => {
    const locEl = document.getElementById('chkLocation');
    const statusEl = document.getElementById('chkStatus');
    const noteEl = document.getElementById('chkNote');
    const photoEl = document.getElementById('chkPhoto');
    const finalEl = document.getElementById('chkFinal');
    
    if (!locEl.value.trim()) {
      alert('Location is required.');
      return;
    }
    
    const photoName = photoEl.files.length > 0 ? photoEl.files[0].name : null;
    
    Store.addCheckin(shipmentId, {
      location: locEl.value.trim(),
      status: statusEl.value,
      note: noteEl.value.trim(),
      photo: photoName,
      isFinal: finalEl.checked
    });
    
    Router.navigate(`shipment?id=${shipmentId}`);
  };
  
  card.appendChild(locationGrp);
  card.appendChild(statusGrp);
  card.appendChild(noteGrp);
  card.appendChild(photoGrp);
  card.appendChild(finalGrp);
  card.appendChild(submitBtn);
  
  container.appendChild(card);
  return container;
}
