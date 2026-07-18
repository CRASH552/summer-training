import { Store } from '../store.js';
import { Auth } from '../auth.js';
import { el, formatDate } from '../utils.js';

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
  
  if (!shipment.timeline || shipment.timeline.length === 0) {
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
        const photoBox = el('div', 'mb-2 flex flex-col items-center justify-center');
        photoBox.style.borderRadius = '8px';
        photoBox.style.overflow = 'hidden';
        photoBox.style.border = '1px solid var(--border-color)';
        
        // If it's a base64 string, render the image. Otherwise, fall back to file name string
        if (checkin.photo.startsWith('data:image')) {
          photoBox.innerHTML = `<img src="${checkin.photo}" alt="Check-in Photo" style="max-width: 100%; max-height: 200px; object-fit: contain;" />`;
        } else {
          photoBox.style.background = 'rgba(0,0,0,0.2)';
          photoBox.style.height = '100px';
          photoBox.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.8rem"><i class="ph ph-image"></i> Attached: ${checkin.photo}</span>`;
        }
        content.appendChild(photoBox);
      }
      
      item.appendChild(content);
      timelineEl.appendChild(item);
    });
    timelineCard.appendChild(timelineEl);
  }
  
  leftCol.appendChild(timelineCard);
  
  // Right: Chat Panel with Tab Filters
  const rightCol = el('div', 'flex-col gap-4');
  rightCol.style.flex = '1';
  rightCol.style.minWidth = '300px';
  
  const chatContainer = el('div', 'chat-container');
  chatContainer.appendChild(el('div', 'chat-header', '<i class="ph ph-chat-circle-dots"></i> Communication'));
  
  // Create Dual-Channel Tab Nav (Only if user is Employee or Manager)
  const isClient = currentUser.role === 'Customer';
  let activeChannel = 'clientMessages'; // default channel
  
  if (!isClient) {
    const tabContainer = el('div', 'flex mb-4 bg-secondary p-1', '', 'tab-container');
    tabContainer.style.borderRadius = '8px';
    tabContainer.style.background = 'var(--bg-secondary)';
    
    const clientTab = el('button', 'btn', 'Client Chat');
    clientTab.style.flex = '1';
    clientTab.style.backgroundColor = 'var(--primary)';
    clientTab.style.color = 'white';
    
    const internalTab = el('button', 'btn', 'Internal Chat');
    internalTab.style.flex = '1';
    internalTab.style.backgroundColor = 'transparent';
    internalTab.style.color = 'var(--text-secondary)';
    
    clientTab.onclick = () => {
      activeChannel = 'clientMessages';
      clientTab.style.backgroundColor = 'var(--primary)';
      clientTab.style.color = 'white';
      internalTab.style.backgroundColor = 'transparent';
      internalTab.style.color = 'var(--text-secondary)';
      renderMessages();
    };
    
    internalTab.onclick = () => {
      activeChannel = 'internalMessages';
      internalTab.style.backgroundColor = 'var(--primary)';
      internalTab.style.color = 'white';
      clientTab.style.backgroundColor = 'transparent';
      clientTab.style.color = 'var(--text-secondary)';
      renderMessages();
    };
    
    tabContainer.appendChild(clientTab);
    tabContainer.appendChild(internalTab);
    chatContainer.appendChild(tabContainer);
  }
  
  const chatMessages = el('div', 'chat-messages');
  chatMessages.id = 'chat-messages';
  
  const renderMessages = () => {
    chatMessages.innerHTML = '';
    const messages = shipment[activeChannel] || [];
    
    if (messages.length === 0) {
      chatMessages.appendChild(el('p', 'text-center text-muted mt-4', 'No messages yet in this channel.'));
    } else {
      messages.forEach(m => {
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
      Store.addMessage(shipment.id, activeChannel, currentUser.id, text);
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
  
  // Setup back button redirect safely
  setTimeout(() => {
    const btn = document.getElementById('backBtn');
    if (btn) {
      btn.onclick = () => {
        window.history.back();
      };
    }
  }, 0);
  
  return container;
}