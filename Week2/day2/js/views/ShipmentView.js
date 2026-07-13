import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { el, formatDate } from '../utils.js';
import { Router } from '../router.js';

export function ShipmentView(params) {
  const shipmentId = params.get('id');
  const shipment = Store.getShipmentById(shipmentId);
  const currentUser = Auth.getCurrentUser();
  
  const container = el('div', 'animate-fade-in');
  
  if (!shipment) {
    container.appendChild(el('h2', '', 'Shipment not found.'));
    return container;
  }

  // Header
  const header = el('div', 'flex justify-between items-center mb-8');
  const titleArea = el('div');
  titleArea.appendChild(el('h1', 'mb-2', `<button class="btn btn-secondary" style="padding: 0.5rem; border-radius: 50%; margin-right: 1rem" id="backBtn"><i class="ph ph-arrow-left"></i></button> ${shipment.title}`));
  
  let badgeClass = 'badge-success';
  if (shipment.status === 'Issue') badgeClass = 'badge-danger';
  else if (shipment.status === 'In Transit') badgeClass = 'badge-warning';
  titleArea.appendChild(el('span', `badge ${badgeClass}`, shipment.status));
  
  header.appendChild(titleArea);
  
  // Layout Grid: Timeline (Left) / Chat (Right)
  const layout = el('div', 'flex gap-4');
  layout.style.flexWrap = 'wrap';
  
  // Left: Timeline
  const leftCol = el('div', 'flex-col gap-4');
  leftCol.style.flex = '1';
  leftCol.style.minWidth = '300px';
  
  const timelineCard = el('div', 'card');
  timelineCard.appendChild(el('h3', 'mb-4', '<i class="ph ph-clock-counter-clockwise"></i> Shipment Timeline'));
  
  if (shipment.timeline.length === 0) {
    timelineCard.appendChild(el('p', '', 'No check-ins recorded yet.'));
  } else {
    const timelineEl = el('div', 'timeline');
    shipment.timeline.forEach(checkin => {
      const item = el('div', 'timeline-item');
      const markerClass = checkin.status === 'OK' ? 'status-ok' : 'status-issue';
      item.appendChild(el('div', `timeline-marker ${markerClass}`));
      
      const content = el('div', 'timeline-content');
      content.appendChild(el('div', 'timeline-date', formatDate(checkin.timestamp)));
      
      const head = el('div', 'flex justify-between items-center mb-2');
      head.innerHTML = `<strong>${checkin.location}</strong>`;
      head.innerHTML += `<span class="badge ${checkin.status === 'OK' ? 'badge-success' : 'badge-danger'}">${checkin.status}</span>`;
      content.appendChild(head);
      
      if (checkin.note) {
        content.appendChild(el('p', 'mb-2', `<em>"${checkin.note}"</em>`));
      }
      
      if (checkin.photo) {
        // Mock photo display
        const photoBox = el('div', 'mb-2 flex items-center justify-center');
        photoBox.style.background = 'rgba(0,0,0,0.2)';
        photoBox.style.borderRadius = '8px';
        photoBox.style.height = '100px';
        photoBox.style.border = '1px dashed var(--border-color)';
        photoBox.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.8rem"><i class="ph ph-image"></i> Attached: ${checkin.photo}</span>`;
        content.appendChild(photoBox);
      }
      
      item.appendChild(content);
      timelineEl.appendChild(item);
    });
    timelineCard.appendChild(timelineEl);
  }
  
  leftCol.appendChild(timelineCard);
  
  // Right: Chat Panel
  const rightCol = el('div', 'flex-col gap-4');
  rightCol.style.flex = '1';
  rightCol.style.minWidth = '300px';
  
  const chatContainer = el('div', 'chat-container');
  chatContainer.appendChild(el('div', 'chat-header', '<i class="ph ph-chat-circle-dots"></i> Communication'));
  
  const chatMessages = el('div', 'chat-messages');
  chatMessages.id = 'chat-messages';
  
  const renderMessages = () => {
    chatMessages.innerHTML = '';
    if (shipment.messages.length === 0) {
      chatMessages.appendChild(el('p', 'text-center', 'No messages yet.'));
    } else {
      shipment.messages.forEach(m => {
        const isSelf = m.senderId === currentUser.id;
        const msgEl = el('div', `chat-message ${isSelf ? 'self' : 'other'}`);
        const senderUser = Store.getUserById(m.senderId);
        
        msgEl.appendChild(el('div', 'chat-sender', isSelf ? 'You' : (senderUser ? senderUser.name : 'Unknown')));
        msgEl.appendChild(el('div', '', m.text));
        msgEl.appendChild(el('div', '', `<span style="font-size: 0.65rem; opacity: 0.5">${formatDate(m.timestamp)}</span>`));
        chatMessages.appendChild(msgEl);
      });
      // auto scroll to bottom
      setTimeout(() => chatMessages.scrollTop = chatMessages.scrollHeight, 10);
    }
  };
  
  renderMessages();
  chatContainer.appendChild(chatMessages);
  
  // Input area
  const chatInputArea = el('div', 'chat-input-area');
  const inputEl = el('input', 'form-input');
  inputEl.placeholder = 'Type a message...';
  inputEl.style.marginBottom = '0';
  
  const sendBtn = el('button', 'btn btn-primary', '<i class="ph-bold ph-paper-plane-right"></i>');
  
  const handleSend = () => {
    const text = inputEl.value.trim();
    if (text) {
      Store.addMessage(shipment.id, currentUser.id, text);
      inputEl.value = '';
      renderMessages();
    }
  };
  
  sendBtn.onclick = handleSend;
  inputEl.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
  
  chatInputArea.appendChild(inputEl);
  chatInputArea.appendChild(sendBtn);
  chatContainer.appendChild(chatInputArea);
  
  rightCol.appendChild(chatContainer);
  
  layout.appendChild(leftCol);
  layout.appendChild(rightCol);
  
  container.appendChild(header);
  container.appendChild(layout);
  
  // Setup back button
  setTimeout(() => {
    document.getElementById('backBtn').onclick = () => {
        window.history.back();
    };
  }, 0);
  
  return container;
}
