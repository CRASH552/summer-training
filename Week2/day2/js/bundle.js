// --- STORE ---
const INITIAL_USERS = [
  { id: 'u1', name: 'Admin Manager', role: 'manager', email: 'admin@delivery.com', password: 'password' },
  { id: 'u2', name: 'John Doe', role: 'employee', email: 'john@delivery.com', password: 'password' },
  { id: 'u3', name: 'Jane Smith', role: 'employee', email: 'jane@delivery.com', password: 'password' },
  { id: 'u4', name: 'ACME Corp', role: 'customer', email: 'acme@corp.com', password: 'password' },
  { id: 'u5', name: 'TechFlow Inc', role: 'customer', email: 'techflow@inc.com', password: 'password' }
];

const INITIAL_SHIPMENTS = [
  {
    id: 's1',
    title: 'Server Racks to Datacenter',
    customerId: 'u4',
    employeeId: 'u2',
    status: 'In Transit', 
    goodsType: 'Sensitive',
    pickupLocation: 'Warehouse A (Origin)',
    finalDestination: 'Main Datacenter East',
    timeline: [
      {
        id: 't1',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        location: 'Warehouse A (Origin)',
        status: 'OK',
        note: 'Shipment loaded securely.',
        photo: null
      }
    ],
    internalMessages: [
      { id: 'im1', senderId: 'u1', text: 'Make sure to take clear photos of the rack bases before loading.', timestamp: new Date(Date.now() - 86400000 * 1.6).toISOString() },
      { id: 'im2', senderId: 'u2', text: 'Understood, I will document everything.', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString() }
    ],
    clientMessages: [
      { id: 'cm1', senderId: 'u4', text: 'Has the shipment departed?', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString() },
      { id: 'cm2', senderId: 'u2', text: 'Yes, departed yesterday morning.', timestamp: new Date(Date.now() - 86400000 * 1.4).toISOString() }
    ]
  },
  {
    id: 's2',
    title: 'Office Displays',
    customerId: 'u5',
    employeeId: 'u3',
    status: 'Issue',
    goodsType: 'Fragile',
    pickupLocation: 'Distribution Center 4',
    finalDestination: 'HQ Office Floor 5',
    timeline: [
      {
        id: 't2',
        timestamp: new Date(Date.now() - 4000000).toISOString(),
        location: 'Transit Hub B',
        status: 'Issue Found',
        note: 'Box 3 shows visible water damage on the exterior.',
        photo: null
      }
    ],
    internalMessages: [],
    clientMessages: []
  }
];

const Store = {
  init() {
    // For demo purposes, we will force update users so the new mock credentials take effect
    localStorage.setItem('dc_users', JSON.stringify(INITIAL_USERS));
    
    // Check if shipments exist, if not set initial, if they do, we might need to migrate old messages structure to new
    const existing = JSON.parse(localStorage.getItem('dc_shipments'));
    if (!existing || existing.length === 0 || !existing[0].goodsType) {
      // Force overwrite to apply the new properties
      localStorage.setItem('dc_shipments', JSON.stringify(INITIAL_SHIPMENTS));
    }
  },
  getUsers() { return JSON.parse(localStorage.getItem('dc_users')) || []; },
  getUserById(id) { return this.getUsers().find(u => u.id === id); },
  getShipments() { return JSON.parse(localStorage.getItem('dc_shipments')) || []; },
  getShipmentById(id) { return this.getShipments().find(s => s.id === id); },
  saveShipments(shipments) { localStorage.setItem('dc_shipments', JSON.stringify(shipments)); },
  
  createShipment(data) {
    const shipments = this.getShipments();
    const newShipment = {
      id: 's' + Date.now(),
      title: data.title,
      customerId: data.customerId,
      employeeId: data.employeeId || null,
      status: data.status || 'Created',
      goodsType: data.goodsType || 'Standard',
      pickupLocation: data.pickupLocation || '',
      finalDestination: data.finalDestination || '',
      timeline: [],
      internalMessages: [],
      clientMessages: []
    };
    shipments.push(newShipment);
    this.saveShipments(shipments);
    return newShipment;
  },

  approveRequest(shipmentId, employeeId) {
    const shipments = this.getShipments();
    const shipment = shipments.find(s => s.id === shipmentId);
    if (shipment) {
      shipment.employeeId = employeeId;
      shipment.status = 'Created';
      this.saveShipments(shipments);
    }
  },

  rejectRequest(shipmentId) {
    const shipments = this.getShipments();
    const shipment = shipments.find(s => s.id === shipmentId);
    if (shipment) {
      shipment.status = 'Rejected';
      this.saveShipments(shipments);
    }
  },

  addCheckin(shipmentId, data) {
    const shipments = this.getShipments();
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    shipment.timeline.push({
      id: 't' + Date.now(),
      timestamp: new Date().toISOString(),
      location: data.location,
      status: data.status,
      note: data.note,
      photo: data.photo || null
    });
    if (data.status === 'Issue Found') shipment.status = 'Issue';
    else if (data.isFinal) shipment.status = 'Completed';
    else shipment.status = 'In Transit';
    this.saveShipments(shipments);
  },

  addMessage(shipmentId, channel, senderId, text) {
    const shipments = this.getShipments();
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    shipment[channel].push({
      id: 'm' + Date.now(),
      senderId,
      text,
      timestamp: new Date().toISOString()
    });
    this.saveShipments(shipments);
  }
};

// --- AUTH ---
const Auth = {
  login(email, password) {
    const users = Store.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('dc_current_user', JSON.stringify(user));
      return true;
    }
    return false;
  },
  logout() { localStorage.removeItem('dc_current_user'); },
  getCurrentUser() {
    const userStr = localStorage.getItem('dc_current_user');
    return userStr ? JSON.parse(userStr) : null;
  },
  isAuthenticated() { return !!this.getCurrentUser(); }
};

// --- UTILS ---
function el(tag, className = '', content = '') {
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

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function renderNavbar() {
  const user = Auth.getCurrentUser();
  const nav = el('nav', 'navbar animate-fade-in');
  const brand = el('div', 'nav-brand', '<i class="ph-fill ph-package"></i> Delivery Checker');
  const rightArea = el('div', 'nav-links');
  
  // Theme Toggle Button
  const themeBtn = el('button', 'theme-toggle');
  const currentTheme = localStorage.getItem('dc_theme') || 'dark';
  themeBtn.innerHTML = currentTheme === 'dark' ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
  themeBtn.onclick = () => {
    const current = localStorage.getItem('dc_theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('dc_theme', next);
    if (next === 'light') {
      document.body.classList.add('light-theme');
      themeBtn.innerHTML = '<i class="ph ph-moon"></i>';
    } else {
      document.body.classList.remove('light-theme');
      themeBtn.innerHTML = '<i class="ph ph-sun"></i>';
    }
  };
  rightArea.appendChild(themeBtn);

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

// --- VIEWS ---
function LoginView() {
  const container = el('div', 'flex flex-col items-center justify-center animate-fade-in');
  container.style.minHeight = '80vh';
  const card = el('div', 'card');
  card.style.width = '100%';
  card.style.maxWidth = '400px';
  card.appendChild(el('h2', 'text-center mb-8', '<i class="ph-fill ph-package" style="color: var(--primary)"></i> Delivery Checker'));
  
  const form = el('form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (Auth.login(email, password)) {
      window.location.hash = ''; 
      Router.handleRoute();
    } else {
      alert('Invalid email or password');
    }
  };

  form.appendChild(el('div', 'form-group', `<label class="form-label">Email</label><input type="email" id="loginEmail" class="form-input" required>`));
  form.appendChild(el('div', 'form-group mb-8', `<label class="form-label">Password</label><input type="password" id="loginPassword" class="form-input" required>`));
  
  const submitBtn = el('button', 'btn btn-primary', 'Login');
  submitBtn.style.width = '100%';
  form.appendChild(submitBtn);

  card.appendChild(form);

  const helpText = el('div', 'mt-8', '<p style="font-size: 0.85rem; margin-bottom: 0.5rem"><strong>Test Accounts (Password: password)</strong></p>');
  const userList = el('ul');
  userList.style.fontSize = '0.8rem';
  userList.style.color = 'var(--text-secondary)';
  userList.style.paddingLeft = '1rem';
  Store.getUsers().forEach(u => {
    userList.innerHTML += `<li style="margin-bottom: 4px"><strong>${u.role}:</strong> ${u.email}</li>`;
  });
  helpText.appendChild(userList);
  card.appendChild(helpText);

  container.appendChild(card);
  return container;
}

function ManagerDashboard() {
  const container = el('div', 'animate-fade-in');
  const header = el('div', 'flex justify-between items-center mb-8');
  header.appendChild(el('h1', '', 'Manager Dashboard'));
  
  // Create Shipment Form
  const createCard = el('div', 'card mb-8');
  createCard.appendChild(el('h3', 'mb-4', '<i class="ph ph-plus-circle"></i> Create & Assign Shipment'));
  
  const form = el('form', 'grid-2');
  
  // Title
  const titleGrp = el('div', 'form-group', `<label class="form-label">Shipment Title/Description</label><input type="text" id="newShipmentTitle" class="form-input" placeholder="e.g. Printer Papers" required>`);
  
  // Select Customer
  const custGrp = el('div', 'form-group');
  custGrp.innerHTML = `<label class="form-label">Select Customer</label>`;
  const custSelect = el('select', 'form-select');
  custSelect.id = 'newShipmentCustomer';
  Store.getUsers().filter(u => u.role === 'customer').forEach(c => {
    const opt = el('option', '', c.name);
    opt.value = c.id;
    custSelect.appendChild(opt);
  });
  custGrp.appendChild(custSelect);

  // Select Employee
  const empGrp = el('div', 'form-group');
  empGrp.innerHTML = `<label class="form-label">Assign Employee</label>`;
  const empSelect = el('select', 'form-select');
  empSelect.id = 'newShipmentEmployee';
  Store.getUsers().filter(u => u.role === 'employee').forEach(e => {
    const opt = el('option', '', e.name);
    opt.value = e.id;
    empSelect.appendChild(opt);
  });
  empGrp.appendChild(empSelect);

  const btnGrp = el('div', 'form-group flex items-center', `<br>`);
  btnGrp.style.alignItems = 'flex-end';
  const submitBtn = el('button', 'btn btn-primary', 'Create Shipment');
  submitBtn.style.width = '100%';
  btnGrp.appendChild(submitBtn);

  form.onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('newShipmentTitle').value.trim();
    if (title) {
      Store.createShipment({
        title,
        customerId: custSelect.value,
        employeeId: empSelect.value,
        status: 'Created',
        goodsType: 'Standard',
        pickupLocation: 'Main Depot',
        finalDestination: 'Client Office'
      });
      // Refresh view
      Router.handleRoute();
    }
  };

  form.appendChild(titleGrp);
  form.appendChild(custGrp);
  form.appendChild(empGrp);
  form.appendChild(btnGrp);
  createCard.appendChild(form);

  const shipments = Store.getShipments();
  const activeCount = shipments.filter(s => s.status === 'In Transit' || s.status === 'Created').length;
  const issueCount = shipments.filter(s => s.status === 'Issue').length;
  
  // Stats Row (Now with All Shipment Stat Box)
  const stats = el('div', 'grid-2 mb-8');
  stats.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
  stats.appendChild(el('div', 'card flex items-center gap-4', `<i class="ph-fill ph-truck" style="font-size: 2.5rem; color: var(--primary)"></i><div><h3>${activeCount}</h3><p style="margin:0">Active</p></div>`));
  stats.appendChild(el('div', 'card flex items-center gap-4', `<i class="ph-fill ph-warning-circle" style="font-size: 2.5rem; color: var(--danger)"></i><div><h3>${issueCount}</h3><p style="margin:0">Issues</p></div>`));
  stats.appendChild(el('div', 'card flex items-center gap-4', `<i class="ph-fill ph-folders" style="font-size: 2.5rem; color: var(--text-secondary)"></i><div><h3>${shipments.length}</h3><p style="margin:0">All Shipment</p></div>`));

  // Pending Requests Section
  const pendingSection = el('div', 'mb-8');
  pendingSection.appendChild(el('h2', 'mb-4', 'Pending Shipment Requests'));
  
  const pendingRequests = shipments.filter(s => s.status === 'Pending Approval');
  if (pendingRequests.length === 0) {
    pendingSection.appendChild(el('div', 'card text-center', '<p>No pending customer requests at this time.</p>'));
  } else {
    const pGrid = el('div', 'grid-2');
    pendingRequests.forEach(s => {
      const pCard = el('div', 'card flex flex-col gap-4 animate-fade-in');
      const cust = Store.getUserById(s.customerId);
      
      pCard.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            <h4 style="margin:0">${s.title}</h4>
            <span class="badge badge-neutral mt-2" style="font-size:0.65rem">From: ${cust ? cust.name : 'Unknown'}</span>
          </div>
          <span class="badge badge-neutral">Pending Approval</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary)" class="flex flex-col gap-1">
          <span><i class="ph ph-tag"></i> Type: <strong>${s.goodsType}</strong></span>
          <span><i class="ph ph-map-pin"></i> Pickup: <strong>${s.pickupLocation}</strong></span>
          <span><i class="ph ph-flag"></i> Destination: <strong>${s.finalDestination}</strong></span>
        </div>
      `;
      
      const assignArea = el('div', 'flex gap-2 items-center mt-2');
      assignArea.appendChild(el('span', '', 'Assign:'));
      
      const select = el('select', 'form-select');
      select.style.flex = '1';
      select.style.padding = '0.4rem 0.8rem';
      select.style.fontSize = '0.85rem';
      Store.getUsers().filter(u => u.role === 'employee').forEach(emp => {
        const opt = el('option', '', emp.name);
        opt.value = emp.id;
        select.appendChild(opt);
      });
      assignArea.appendChild(select);
      
      const approveBtn = el('button', 'btn btn-primary', 'Accept & Assign');
      approveBtn.style.padding = '0.4rem 1rem';
      approveBtn.style.fontSize = '0.85rem';
      approveBtn.onclick = () => {
        Store.approveRequest(s.id, select.value);
        Router.handleRoute(); 
      };
      
      const rejectBtn = el('button', 'btn btn-danger', 'Reject');
      rejectBtn.style.padding = '0.4rem 1rem';
      rejectBtn.style.fontSize = '0.85rem';
      rejectBtn.onclick = () => {
        Store.rejectRequest(s.id);
        Router.handleRoute();
      };
      
      const actionRow = el('div', 'flex gap-2 justify-between mt-2');
      actionRow.appendChild(assignArea);
      
      const buttons = el('div', 'flex gap-2');
      buttons.appendChild(approveBtn);
      buttons.appendChild(rejectBtn);
      
      pCard.appendChild(actionRow);
      pCard.appendChild(buttons);
      pGrid.appendChild(pCard);
    });
    pendingSection.appendChild(pGrid);
  }
  
  const listContainer = el('div');
  listContainer.appendChild(el('h2', 'mb-4', 'All Shipments'));
  
  if (shipments.length === 0) {
    listContainer.appendChild(el('p', '', 'No shipments found.'));
  } else {
    const grid = el('div', 'grid-2');
    [...shipments].reverse().forEach(s => {
      const card = el('div', 'card interactive flex flex-col gap-2');
      card.onclick = () => Router.navigate(`shipment?id=${s.id}`);
      let badgeClass = s.status === 'Issue' ? 'badge-danger' : 
                       (s.status === 'In Transit' ? 'badge-warning' : 
                       (s.status === 'Pending Approval' || s.status === 'Rejected' ? 'badge-neutral' : 'badge-success'));
      const titleRow = el('div', 'flex justify-between items-center', `<h4>${s.title}</h4><span class="badge ${badgeClass}">${s.status}</span>`);
      
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
  container.appendChild(createCard);
  container.appendChild(pendingSection);
  container.appendChild(stats);
  container.appendChild(listContainer);
  return container;
}

function EmployeeDashboard() {
  const user = Auth.getCurrentUser();
  const container = el('div', 'animate-fade-in');
  const header = el('div', 'flex justify-between items-center mb-8', el('h1', '', 'My Assignments'));
  
  const shipments = Store.getShipments().filter(s => s.employeeId === user.id);
  
  if (shipments.length === 0) {
    container.appendChild(header);
    container.appendChild(el('div', 'card text-center', '<p>You have no assigned shipments at this time.</p>'));
    return container;
  }
  
  const grid = el('div', 'grid-2');
  [...shipments].reverse().forEach(s => {
    const card = el('div', 'card flex flex-col gap-4');
    let badgeClass = s.status === 'Issue' ? 'badge-danger' : (s.status === 'In Transit' ? 'badge-warning' : 'badge-success');
    card.appendChild(el('div', 'flex justify-between items-center', `<h4>${s.title}</h4><span class="badge ${badgeClass}">${s.status}</span>`));
    
    const customer = Store.getUserById(s.customerId);
    const actions = el('div', 'flex gap-2 mt-4');
    
    const viewBtn = el('button', 'btn btn-secondary', 'View & Chats');
    viewBtn.style.flex = '1';
    viewBtn.onclick = () => Router.navigate(`shipment?id=${s.id}`);
    
    const checkinBtn = el('button', 'btn btn-primary', 'Add Check-in');
    checkinBtn.style.flex = '1';
    if (s.status === 'Completed') {
        checkinBtn.disabled = true;
        checkinBtn.style.opacity = '0.5';
        checkinBtn.style.cursor = 'not-allowed';
    } else {
        checkinBtn.onclick = () => Router.navigate(`add-checkin?id=${s.id}`);
    }
    
    actions.appendChild(viewBtn);
    actions.appendChild(checkinBtn);
    card.appendChild(el('p', '', `<i class="ph ph-buildings"></i> Client: ${customer ? customer.name : 'Unknown'}`));
    card.appendChild(actions);
    grid.appendChild(card);
  });
  
  container.appendChild(header);
  container.appendChild(grid);
  return container;
}

function CustomerDashboard() {
  const user = Auth.getCurrentUser();
  const container = el('div', 'animate-fade-in');
  
  const header = el('div', 'flex justify-between items-center mb-8');
  header.appendChild(el('h1', '', 'My Shipments'));
  
  const reqBtn = el('button', 'btn btn-primary', '<i class="ph ph-plus-circle"></i> Request Shipment');
  reqBtn.onclick = () => Router.navigate('request-shipment');
  header.appendChild(reqBtn);
  
  const shipments = Store.getShipments().filter(s => s.customerId === user.id);
  
  if (shipments.length === 0) {
    container.appendChild(header);
    container.appendChild(el('div', 'card text-center', '<p>You have no active shipments.</p>'));
    return container;
  }
  
  const grid = el('div', 'grid-2');
  [...shipments].reverse().forEach(s => {
    const card = el('div', 'card interactive flex flex-col gap-4');
    card.onclick = () => Router.navigate(`shipment?id=${s.id}`);
    
    let badgeClass = s.status === 'Issue' ? 'badge-danger' : 
                     (s.status === 'In Transit' ? 'badge-warning' : 
                     (s.status === 'Pending Approval' || s.status === 'Rejected' ? 'badge-neutral' : 'badge-success'));
    card.appendChild(el('div', 'flex justify-between items-center', `<h4>${s.title}</h4><span class="badge ${badgeClass}">${s.status}</span>`));
    
    const latestCheckin = s.timeline.length > 0 ? s.timeline[s.timeline.length - 1] : null;
    let statusText = latestCheckin ? `Last seen: ${latestCheckin.location} (${latestCheckin.status})` : 'Awaiting initial check-in';
    card.appendChild(el('p', '', `<i class="ph ph-map-pin"></i> ${statusText}`));
    card.appendChild(el('button', 'btn btn-secondary mt-2', 'Track & Chat'));
    
    grid.appendChild(card);
  });
  
  container.appendChild(header);
  container.appendChild(grid);
  return container;
}

function ShipmentView(params) {
  const shipmentId = params.get('id');
  const shipment = Store.getShipmentById(shipmentId);
  const currentUser = Auth.getCurrentUser();
  const container = el('div', 'animate-fade-in');
  
  if (!shipment) return el('div', '', '<h2>Shipment not found.</h2>');

  const header = el('div', 'flex justify-between items-center mb-8');
  const titleArea = el('div');
  titleArea.appendChild(el('h1', 'mb-2', `<button class="btn btn-secondary" style="padding: 0.5rem; border-radius: 50%; margin-right: 1rem" id="backBtn"><i class="ph ph-arrow-left"></i></button> ${shipment.title}`));
  let badgeClass = shipment.status === 'Issue' ? 'badge-danger' : 
                   (shipment.status === 'In Transit' ? 'badge-warning' : 
                   (shipment.status === 'Pending Approval' || shipment.status === 'Rejected' ? 'badge-neutral' : 'badge-success'));
  titleArea.appendChild(el('span', `badge ${badgeClass}`, shipment.status));
  
  // Show shipping details in header
  const detailsArea = el('div', 'mt-4 flex gap-4', `
    <span style="font-size: 0.85rem; color: var(--text-secondary)"><i class="ph ph-tag"></i> Type: <strong>${shipment.goodsType || 'Standard'}</strong></span>
    <span style="font-size: 0.85rem; color: var(--text-secondary)"><i class="ph ph-map-pin"></i> Pickup: <strong>${shipment.pickupLocation || 'N/A'}</strong></span>
    <span style="font-size: 0.85rem; color: var(--text-secondary)"><i class="ph ph-flag"></i> Destination: <strong>${shipment.finalDestination || 'N/A'}</strong></span>
  `);
  titleArea.appendChild(detailsArea);
  header.appendChild(titleArea);
  
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
      item.appendChild(el('div', `timeline-marker ${checkin.status === 'OK' ? 'status-ok' : 'status-issue'}`));
      const content = el('div', 'timeline-content');
      content.appendChild(el('div', 'timeline-date', formatDate(checkin.timestamp)));
      content.appendChild(el('div', 'flex justify-between items-center mb-2', `<strong>${checkin.location}</strong><span class="badge ${checkin.status === 'OK' ? 'badge-success' : 'badge-danger'}">${checkin.status}</span>`));
      if (checkin.note) content.appendChild(el('p', 'mb-2', `<em>"${checkin.note}"</em>`));
      
      // Render base64 image if attached
      if (checkin.photo) {
        const photoBox = el('div', 'mb-2 mt-2');
        const img = el('img');
        img.src = checkin.photo;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '250px';
        img.style.borderRadius = '8px';
        img.style.objectFit = 'cover';
        img.style.border = '1px solid var(--border-color)';
        photoBox.appendChild(img);
        content.appendChild(photoBox);
      }
      
      item.appendChild(content);
      timelineEl.appendChild(item);
    });
    timelineCard.appendChild(timelineEl);
  }
  leftCol.appendChild(timelineCard);
  
  // Right: Dual-Channel Chat (Hidden if Pending Approval or Rejected)
  const rightCol = el('div', 'flex-col gap-4');
  rightCol.style.flex = '1';
  rightCol.style.minWidth = '300px';

  if (shipment.status === 'Pending Approval' || shipment.status === 'Rejected') {
    rightCol.appendChild(el('div', 'card text-center', '<p style="margin:0"><i class="ph ph-chat-circle-slash" style="font-size:2rem"></i><br>Chat is unavailable for pending or rejected requests.</p>'));
  } else {
    const chatContainer = el('div', 'chat-container');
    const chatHeader = el('div', 'chat-header');
    
    let activeChannel = 'clientMessages'; // default
    
    if (currentUser.role === 'manager') {
      activeChannel = 'internalMessages';
      chatHeader.innerHTML = '<i class="ph ph-lock-key"></i> Internal Chat (with Employee)';
      chatHeader.style.color = 'var(--warning)';
    } else if (currentUser.role === 'customer') {
      activeChannel = 'clientMessages';
      chatHeader.innerHTML = '<i class="ph ph-chat-circle-dots"></i> Support Chat (with Employee)';
    } else if (currentUser.role === 'employee') {
      const tabs = el('div', 'flex gap-2');
      tabs.style.width = '100%';
      
      const btnInternal = el('button', 'btn', '<i class="ph ph-lock-key"></i> Internal (Manager)');
      const btnClient = el('button', 'btn', '<i class="ph ph-users"></i> Client');
      
      btnInternal.style.flex = '1';
      btnClient.style.flex = '1';
      btnInternal.style.borderRadius = '4px';
      btnClient.style.borderRadius = '4px';
      
      const updateTabs = () => {
        btnInternal.className = `btn ${activeChannel === 'internalMessages' ? 'btn-primary' : 'btn-secondary'}`;
        btnClient.className = `btn ${activeChannel === 'clientMessages' ? 'btn-primary' : 'btn-secondary'}`;
        if (activeChannel === 'internalMessages') {
          btnInternal.style.backgroundColor = 'var(--warning)';
          btnInternal.style.color = '#000';
        } else {
          btnInternal.style.backgroundColor = '';
          btnInternal.style.color = '';
        }
        renderMessages();
      };

      btnInternal.onclick = () => { activeChannel = 'internalMessages'; updateTabs(); };
      btnClient.onclick = () => { activeChannel = 'clientMessages'; updateTabs(); };
      
      tabs.appendChild(btnInternal);
      tabs.appendChild(btnClient);
      chatHeader.appendChild(tabs);
      
      setTimeout(updateTabs, 0);
    }
    
    const chatMessages = el('div', 'chat-messages');
    
    const renderMessages = () => {
      chatMessages.innerHTML = '';
      // Refetch shipment from Store to display newly added messages instantly
      const latestShipment = Store.getShipmentById(shipment.id);
      const messages = latestShipment[activeChannel];
      
      if (messages.length === 0) chatMessages.appendChild(el('p', 'text-center', 'No messages yet.'));
      else {
        messages.forEach(m => {
          const isSelf = m.senderId === currentUser.id;
          const msgEl = el('div', `chat-message ${isSelf ? 'self' : 'other'}`);
          const senderUser = Store.getUserById(m.senderId);
          
          if (activeChannel === 'internalMessages' && isSelf) {
            msgEl.style.backgroundColor = 'var(--warning)';
            msgEl.style.color = '#000';
          }

          msgEl.appendChild(el('div', 'chat-sender', isSelf ? 'You' : (senderUser ? senderUser.name : 'Unknown')));
          msgEl.appendChild(el('div', '', m.text));
          msgEl.appendChild(el('div', '', `<span style="font-size: 0.65rem; opacity: 0.5">${formatDate(m.timestamp)}</span>`));
          chatMessages.appendChild(msgEl);
        });
        setTimeout(() => chatMessages.scrollTop = chatMessages.scrollHeight, 10);
      }
    };
    
    renderMessages();
    chatContainer.appendChild(chatHeader);
    chatContainer.appendChild(chatMessages);
    
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
  }
  
  layout.appendChild(leftCol);
  layout.appendChild(rightCol);
  container.appendChild(header);
  container.appendChild(layout);
  
  setTimeout(() => { document.getElementById('backBtn').onclick = () => window.history.back(); }, 0);
  return container;
}

function AddCheckinView(params) {
  const shipmentId = params.get('id');
  const shipment = Store.getShipmentById(shipmentId);
  const container = el('div', 'animate-fade-in flex justify-center');
  
  if (!shipment) return el('div', '', '<h2>Shipment not found.</h2>');
  
  // Protect: Block if shipment is completed
  if (shipment.status === 'Completed') {
    const blockCard = el('div', 'card text-center animate-fade-in');
    blockCard.style.width = '100%';
    blockCard.style.maxWidth = '500px';
    blockCard.style.margin = '40px auto';
    blockCard.appendChild(el('i', 'ph-fill ph-lock-keyhole', ''));
    blockCard.querySelector('i').style.fontSize = '3.5rem';
    blockCard.querySelector('i').style.color = 'var(--danger)';
    blockCard.appendChild(el('h2', 'mt-4', 'Shipment Completed'));
    blockCard.appendChild(el('p', 'mt-2', 'This shipment has been marked as Completed. No further check-ins can be added.'));
    
    const backBtn = el('button', 'btn btn-secondary mt-4', '<i class="ph ph-arrow-left"></i> Go Back');
    backBtn.onclick = () => window.history.back();
    blockCard.appendChild(backBtn);
    container.appendChild(blockCard);
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
  
  card.appendChild(el('div', 'form-group', `<label class="form-label">Current Location / Checkpoint</label><input type="text" id="chkLocation" class="form-input" placeholder="e.g. Warehouse B" required>`));
  card.appendChild(el('div', 'form-group', `<label class="form-label">Condition Status</label><select id="chkStatus" class="form-select"><option value="OK">OK - Intact</option><option value="Issue Found">Issue Found - Damaged/Missing</option></select>`));
  card.appendChild(el('div', 'form-group', `<label class="form-label">Inspection Notes</label><textarea id="chkNote" class="form-textarea" placeholder="Describe the condition..."></textarea>`));
  card.appendChild(el('div', 'form-group mb-8', `<label class="form-label">Attach Photo Evidence</label><input type="file" id="chkPhoto" class="form-input" accept="image/*"><small style="color: var(--text-secondary)">Simulation: photo will convert to a Base64 image and render on the timeline.</small>`));
  card.appendChild(el('div', 'form-group mb-8 flex items-center gap-2', `<input type="checkbox" id="chkFinal" style="width: 18px; height: 18px;"><label for="chkFinal" style="margin:0; font-weight: 500">Mark as Final Delivery (Completes Shipment)</label>`));
  
  const submitBtn = el('button', 'btn btn-primary', 'Save Check-in');
  submitBtn.style.width = '100%';
  
  submitBtn.onclick = () => {
    const locEl = document.getElementById('chkLocation');
    if (!locEl.value.trim()) return alert('Location is required.');
    
    const photoEl = document.getElementById('chkPhoto');
    const file = photoEl.files[0];
    
    const performSave = (photoData) => {
      Store.addCheckin(shipmentId, {
        location: locEl.value.trim(),
        status: document.getElementById('chkStatus').value,
        note: document.getElementById('chkNote').value.trim(),
        photo: photoData,
        isFinal: document.getElementById('chkFinal').checked
      });
      Router.navigate(`shipment?id=${shipmentId}`);
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => performSave(e.target.result);
      reader.onerror = () => {
        alert("Failed to upload/read file.");
        performSave(null);
      };
      reader.readAsDataURL(file);
    } else {
      performSave(null);
    }
  };
  
  card.appendChild(submitBtn);
  container.appendChild(card);
  return container;
}

function RequestShipmentView() {
  const container = el('div', 'animate-fade-in flex justify-center');
  
  const card = el('div', 'card');
  card.style.width = '100%';
  card.style.maxWidth = '600px';
  
  const titleRow = el('div', 'flex items-center gap-4 mb-8');
  const backBtn = el('button', 'btn btn-secondary', '<i class="ph ph-arrow-left"></i>');
  backBtn.style.padding = '0.5rem';
  backBtn.onclick = () => window.history.back();
  titleRow.appendChild(backBtn);
  titleRow.appendChild(el('h2', 'mb-0', 'Request New Shipment'));
  card.appendChild(titleRow);
  
  const form = el('form');
  
  const titleGrp = el('div', 'form-group', `<label class="form-label">Goods Description / What is the shipment?</label><input type="text" id="reqTitle" class="form-input" placeholder="e.g. Electronics Batch C" required>`);
  
  const typeGrp = el('div', 'form-group', `
    <label class="form-label">Goods Type</label>
    <select id="reqType" class="form-select">
      <option value="Standard">Standard</option>
      <option value="Sensitive">Sensitive</option>
      <option value="Fragile">Fragile</option>
      <option value="Hazardous">Hazardous</option>
    </select>
  `);
  
  const pickupGrp = el('div', 'form-group', `<label class="form-label">Location before shipping (Pickup Location)</label><input type="text" id="reqPickup" class="form-input" placeholder="e.g. Warehouse 3 Floor A" required>`);
  const destGrp = el('div', 'form-group mb-8', `<label class="form-label">Goods Final Destination</label><input type="text" id="reqDest" class="form-input" placeholder="e.g. Tech Retail Outlet, New York" required>`);
  
  const submitBtn = el('button', 'btn btn-primary', 'Submit Shipment Request');
  submitBtn.style.width = '100%';
  
  form.onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('reqTitle').value.trim();
    const goodsType = document.getElementById('reqType').value;
    const pickupLocation = document.getElementById('reqPickup').value.trim();
    const finalDestination = document.getElementById('reqDest').value.trim();
    
    if (title && pickupLocation && finalDestination) {
      Store.createShipment({
        title,
        customerId: Auth.getCurrentUser().id,
        employeeId: null,
        status: 'Pending Approval',
        goodsType,
        pickupLocation,
        finalDestination
      });
      Router.navigate('customer-dashboard');
    }
  };
  
  form.appendChild(titleGrp);
  form.appendChild(typeGrp);
  form.appendChild(pickupGrp);
  form.appendChild(destGrp);
  form.appendChild(submitBtn);
  
  card.appendChild(form);
  container.appendChild(card);
  return container;
}

// --- ROUTER & INIT ---
const Router = {
  routes: {
    '': LoginView,
    'manager-dashboard': ManagerDashboard,
    'employee-dashboard': EmployeeDashboard,
    'customer-dashboard': CustomerDashboard,
    'shipment': ShipmentView,
    'add-checkin': AddCheckinView,
    'request-shipment': RequestShipmentView
  },
  navigate(hash) { window.location.hash = hash; },
  handleRoute() {
    const root = document.getElementById('app');
    let hash = window.location.hash.replace('#', '').split('?')[0];
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    if (!hash) hash = '';

    if (!Auth.isAuthenticated() && hash !== '') {
      this.navigate('');
      return;
    }

    if (Auth.isAuthenticated() && hash === '') {
      const user = Auth.getCurrentUser();
      if (user.role === 'manager') this.navigate('manager-dashboard');
      else if (user.role === 'employee') this.navigate('employee-dashboard');
      else if (user.role === 'customer') this.navigate('customer-dashboard');
      return;
    }

    const viewFn = this.routes[hash];
    if (viewFn) {
      root.innerHTML = '';
      if (hash !== '') root.appendChild(renderNavbar());
      root.appendChild(viewFn(params));
    } else {
      root.innerHTML = '<h2>404 Not Found</h2>';
    }
  },
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  
  // Apply saved theme
  const savedTheme = localStorage.getItem('dc_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }
  
  Router.init();
});
