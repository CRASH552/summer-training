import { Store } from '../store.js';
import { Router } from '../router.js';
import { el } from '../utils.js';

export function AddCheckinView(params) {
  const shipmentId = params.get('id');
  const shipment = Store.getShipmentById(shipmentId);
  const container = el('div', 'animate-fade-in');
  
  if (!shipment) {
    container.appendChild(el('h2', '', 'Shipment not found.'));
    return container;
  }
  
  const header = el('div', 'mb-8');
  header.appendChild(el('h1', 'mb-2', 'Add Check-In'));
  header.appendChild(el('p', 'text-muted', `Update status for: ${shipment.title}`));
  
  const form = el('form', 'card flex flex-col gap-4');
  
  // Form fields logic...
  const locationGroup = el('div', 'form-group');
  locationGroup.innerHTML = '<label>Current Location</label>';
  const locationInput = el('input', 'form-input');
  locationInput.required = true;
  locationGroup.appendChild(locationInput);
  
  const statusGroup = el('div', 'form-group');
  statusGroup.innerHTML = '<label>Status</label>';
  const statusSelect = el('select', 'form-input');
  statusSelect.innerHTML = `
    <option value="OK">OK - Operating Normally</option>
    <option value="Issue">Issue - Problem Encountered</option>
  `;
  statusGroup.appendChild(statusSelect);
  
  const noteGroup = el('div', 'form-group');
  noteGroup.innerHTML = '<label>Note (Optional)</label>';
  const noteInput = el('textarea', 'form-input');
  noteGroup.appendChild(noteInput);
  
  const photoGroup = el('div', 'form-group');
  photoGroup.innerHTML = '<label>Photo Capture (Optional)</label>';
  const photoInput = el('input', 'form-input');
  photoInput.type = 'file';
  photoInput.accept = 'image/*';
  photoGroup.appendChild(photoInput);
  
  const submitBtn = el('button', 'btn btn-primary', 'Save Check-in');
  submitBtn.type = 'submit';
  
  form.appendChild(locationGroup);
  form.appendChild(statusGroup);
  form.appendChild(noteGroup);
  form.appendChild(photoGroup);
  form.appendChild(submitBtn);
  
  form.onsubmit = (e) => {
    e.preventDefault();
    
    const saveCheckin = (photoBase64 = null) => {
      const checkinData = {
        location: locationInput.value,
        status: statusSelect.value,
        note: noteInput.value,
        photo: photoBase64
      };
      
      Store.addCheckin(shipmentId, checkinData);
      Router.navigate(`shipment?id=${shipmentId}`);
    };
    
    const file = photoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveCheckin(reader.result); // Base64 encoding complete
      };
      reader.readAsDataURL(file);
    } else {
      saveCheckin(null);
    }
  };
  
  container.appendChild(header);
  container.appendChild(form);
  return container;
}