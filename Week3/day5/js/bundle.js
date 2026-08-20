// --- UTILS ---
const Utils = {
    sanitize(str) {
        if (!str) return '';
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;' };
        const reg = /[&<>"'/]/ig;
        return str.replace(reg, (match) => (map[match]));
    },
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
};

// --- STORE ---
const defaultData = {
    users: [
        { id: '1', email: 'admin@delivery.com', password: 'password', role: 'manager', name: 'Admin Manager' },
        { id: '2', email: 'john@delivery.com', password: 'password', role: 'employee', name: 'John Doe' },
        { id: '3', email: 'jane@delivery.com', password: 'password', role: 'employee', name: 'Jane Smith' },
        { id: '4', email: 'acme@corp.com', password: 'password', role: 'customer', name: 'Acme Corp' },
        { id: '5', email: 'techflow@inc.com', password: 'password', role: 'customer', name: 'Techflow Inc' }
    ],
    shipments: []
};

const Store = {
    init() {
        if (!localStorage.getItem('dc_db')) {
            localStorage.setItem('dc_db', JSON.stringify(defaultData));
        }
        if (!localStorage.getItem('dc_theme')) {
            localStorage.setItem('dc_theme', 'dark');
        }
        this.applyTheme();
    },
    get(key) {
        return JSON.parse(localStorage.getItem('dc_db'))[key];
    },
    set(key, value) {
        const db = JSON.parse(localStorage.getItem('dc_db'));
        db[key] = value;
        localStorage.setItem('dc_db', JSON.stringify(db));
    },
    getUsers() { return this.get('users'); },
    getShipments() { return this.get('shipments'); },
    getShipment(id) { return this.getShipments().find(s => s.id === id); },
    saveShipment(shipment) {
        const shipments = this.getShipments();
        const index = shipments.findIndex(s => s.id === shipment.id);
        if (index > -1) {
            shipments[index] = shipment;
        } else {
            shipments.push(shipment);
        }
        this.set('shipments', shipments);
    },
    applyTheme() {
        document.body.setAttribute('data-theme', localStorage.getItem('dc_theme'));
    },
    toggleTheme() {
        const current = localStorage.getItem('dc_theme');
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('dc_theme', next);
        this.applyTheme();
    }
};

// --- AUTH ---
const Auth = {
    login(email, password) {
        const users = Store.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('dc_user', JSON.stringify(user));
            return true;
        }
        return false;
    },
    logout() {
        localStorage.removeItem('dc_user');
        Router.navigate('#login');
    },
    getCurrentUser() {
        const user = localStorage.getItem('dc_user');
        return user ? JSON.parse(user) : null;
    }
};

// --- VIEWS ---
const Views = {
    renderHeader(appContainer) {
        const user = Auth.getCurrentUser();
        const header = document.createElement('div');
        header.className = 'header animate-fade-in';
        
        const titleInfo = document.createElement('div');
        titleInfo.innerHTML = `<h2>Delivery Checker</h2><span style="opacity: 0.7; font-size: 0.9em;">Role: ${Utils.sanitize(user.role.toUpperCase())} | ${Utils.sanitize(user.name)}</span>`;
        
        const actions = document.createElement('div');
        actions.className = 'flex gap-2 items-center';
        
        const themeBtn = document.createElement('button');
        themeBtn.className = 'btn';
        themeBtn.innerHTML = '<i class="ph ph-moon"></i> Theme';
        themeBtn.onclick = () => Store.toggleTheme();
        
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-danger';
        logoutBtn.innerHTML = 'Logout';
        logoutBtn.onclick = () => Auth.logout();
        
        actions.appendChild(themeBtn);
        actions.appendChild(logoutBtn);
        
        header.appendChild(titleInfo);
        header.appendChild(actions);
        appContainer.appendChild(header);
    },

    login(appContainer) {
        const card = document.createElement('div');
        card.className = 'card animate-fade-in';
        card.style.maxWidth = '400px';
        card.style.margin = '100px auto';
        
        card.innerHTML = `
            <h2>Login</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" id="email" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" id="password" class="form-input" required>
                </div>
                <button type="submit" class="btn" style="width: 100%;">Login</button>
                <p id="loginError" class="text-danger mt-4" style="display: none;">Invalid credentials</p>
            </form>
            <div style="margin-top: 20px; font-size: 0.9em; opacity: 0.8;">
                <p><strong>Test Accounts:</strong> (Password: password)</p>
                <ul>
                    <li>admin@delivery.com (Manager)</li>
                    <li>john@delivery.com (Employee)</li>
                    <li>acme@corp.com (Customer)</li>
                </ul>
            </div>
        `;
        
        appContainer.appendChild(card);
        
        document.getElementById('loginForm').onsubmit = (e) => {
            e.preventDefault();
            const em = document.getElementById('email').value;
            const pw = document.getElementById('password').value;
            if (Auth.login(em, pw)) {
                Router.navigate('#dashboard');
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        };
    },

    managerDashboard(appContainer) {
        this.renderHeader(appContainer);
        const card = document.createElement('div');
        card.className = 'card animate-fade-in';
        card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3>Manager Dashboard</h3>
                <button id="createShipmentBtn" class="btn"><i class="ph ph-plus"></i> Create Shipment</button>
            </div>
            <h4>All Shipments</h4>
            <div id="shipmentList"></div>
        `;
        appContainer.appendChild(card);
        
        document.getElementById('createShipmentBtn').onclick = () => Router.navigate('#request-shipment');
        
        const listContainer = document.getElementById('shipmentList');
        const shipments = Store.getShipments();
        if (shipments.length === 0) {
            listContainer.innerHTML = '<p>No shipments found.</p>';
        } else {
            shipments.forEach(s => {
                const sCard = document.createElement('div');
                sCard.className = 'card';
                sCard.style.cursor = 'pointer';
                sCard.style.padding = '15px';
                sCard.innerHTML = `
                    <div class="flex justify-between items-center">
                        <strong>${Utils.sanitize(s.goods)}</strong>
                        <span style="color: ${s.status === 'pending' ? 'var(--danger)' : 'var(--success)'}">${Utils.sanitize(s.status.toUpperCase())}</span>
                    </div>
                `;
                sCard.onclick = () => Router.navigate('#shipment?id=' + s.id);
                listContainer.appendChild(sCard);
            });
        }
    },

    employeeDashboard(appContainer) {
        this.renderHeader(appContainer);
        const user = Auth.getCurrentUser();
        const card = document.createElement('div');
        card.className = 'card animate-fade-in';
        card.innerHTML = `
            <h3>Employee Dashboard</h3>
            <h4 class="mt-4">My Assigned Shipments</h4>
            <div id="shipmentList"></div>
        `;
        appContainer.appendChild(card);
        
        const listContainer = document.getElementById('shipmentList');
        const shipments = Store.getShipments().filter(s => s.employee_id === user.id);
        if (shipments.length === 0) {
            listContainer.innerHTML = '<p>No assigned shipments.</p>';
        } else {
            shipments.forEach(s => {
                const sCard = document.createElement('div');
                sCard.className = 'card';
                sCard.style.cursor = 'pointer';
                sCard.style.padding = '15px';
                sCard.innerHTML = `
                    <div class="flex justify-between items-center">
                        <strong>${Utils.sanitize(s.goods)}</strong>
                        <span>${Utils.sanitize(s.status.toUpperCase())}</span>
                    </div>
                `;
                sCard.onclick = () => Router.navigate('#shipment?id=' + s.id);
                listContainer.appendChild(sCard);
            });
        }
    },

    customerDashboard(appContainer) {
        this.renderHeader(appContainer);
        const user = Auth.getCurrentUser();
        const card = document.createElement('div');
        card.className = 'card animate-fade-in';
        card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3>Customer Dashboard</h3>
                <button id="reqShipmentBtn" class="btn"><i class="ph ph-plus"></i> Request Shipment</button>
            </div>
            <h4>My Shipments</h4>
            <div id="shipmentList"></div>
        `;
        appContainer.appendChild(card);
        
        document.getElementById('reqShipmentBtn').onclick = () => Router.navigate('#request-shipment');
        
        const listContainer = document.getElementById('shipmentList');
        const shipments = Store.getShipments().filter(s => s.customer_id === user.id);
        if (shipments.length === 0) {
            listContainer.innerHTML = '<p>No shipments requested yet.</p>';
        } else {
            shipments.forEach(s => {
                const sCard = document.createElement('div');
                sCard.className = 'card';
                sCard.style.cursor = 'pointer';
                sCard.style.padding = '15px';
                sCard.innerHTML = `
                    <div class="flex justify-between items-center">
                        <strong>${Utils.sanitize(s.goods)}</strong>
                        <span>${Utils.sanitize(s.status.toUpperCase())}</span>
                    </div>
                `;
                sCard.onclick = () => Router.navigate('#shipment?id=' + s.id);
                listContainer.appendChild(sCard);
            });
        }
    },

    requestShipment(appContainer) {
        this.renderHeader(appContainer);
        const card = document.createElement('div');
        card.className = 'card animate-fade-in';
        card.innerHTML = `
            <div class="flex items-center gap-4 mb-4">
                <button id="backBtn" class="btn"><i class="ph ph-arrow-left"></i></button>
                <h3 style="margin: 0;">Request / Create Shipment</h3>
            </div>
            <form id="requestForm">
                <div class="form-group">
                    <label class="form-label">Goods Description</label>
                    <input type="text" id="goods" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Type</label>
                    <select id="type" class="form-select">
                        <option>Standard</option>
                        <option>Express</option>
                        <option>Fragile</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Pickup Location</label>
                    <input type="text" id="pickup" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Destination</label>
                    <input type="text" id="destination" class="form-input" required>
                </div>
                <button type="submit" class="btn btn-success" style="width: 100%;">Submit</button>
            </form>
        `;
        appContainer.appendChild(card);
        
        document.getElementById('backBtn').onclick = () => window.history.back();
        
        document.getElementById('requestForm').onsubmit = (e) => {
            e.preventDefault();
            const user = Auth.getCurrentUser();
            const shipment = {
                id: Utils.generateId(),
                goods: document.getElementById('goods').value,
                type: document.getElementById('type').value,
                pickup: document.getElementById('pickup').value,
                destination: document.getElementById('destination').value,
                status: 'pending',
                customer_id: user.role === 'manager' ? null : user.id,
                employee_id: null,
                checkpoints: [],
                internalChat: [],
                clientChat: []
            };
            Store.saveShipment(shipment);
            Router.navigate('#dashboard');
        };
    },

    shipmentDetails(appContainer, id) {
        this.renderHeader(appContainer);
        const shipment = Store.getShipment(id);
        const user = Auth.getCurrentUser();
        
        if (!shipment) {
            const error = document.createElement('div');
            error.innerHTML = 'Shipment not found <button class="btn" onclick="window.history.back()">Back</button>';
            appContainer.appendChild(error);
            return;
        }

        const topBar = document.createElement('div');
        topBar.className = 'flex items-center gap-4 mb-4';
        topBar.innerHTML = `<button class="btn" id="backBtn"><i class="ph ph-arrow-left"></i> Back</button>`;
        appContainer.appendChild(topBar);

        const detailsCard = document.createElement('div');
        detailsCard.className = 'card animate-fade-in';
        detailsCard.innerHTML = `
            <h3>Shipment: ${Utils.sanitize(shipment.goods)}</h3>
            <p><strong>Type:</strong> ${Utils.sanitize(shipment.type)}</p>
            <p><strong>Status:</strong> ${Utils.sanitize(shipment.status.toUpperCase())}</p>
            <p><strong>From:</strong> ${Utils.sanitize(shipment.pickup)} <strong>To:</strong> ${Utils.sanitize(shipment.destination)}</p>
        `;
        
        // Actions based on role
        if (user.role === 'manager' && shipment.status === 'pending') {
            const employees = Store.getUsers().filter(u => u.role === 'employee');
            const actionDiv = document.createElement('div');
            actionDiv.className = 'mt-4 border-top pt-4';
            
            let empOptions = employees.map(e => `<option value="${e.id}">${Utils.sanitize(e.name)}</option>`).join('');
            actionDiv.innerHTML = `
                <h4>Approve & Assign</h4>
                <div class="flex gap-4 items-center mt-4">
                    <select id="assignEmployee" class="form-select" style="max-width: 300px;">
                        ${empOptions}
                    </select>
                    <button class="btn btn-success" id="approveBtn">Approve</button>
                    <button class="btn btn-danger" id="rejectBtn">Reject</button>
                </div>
            `;
            detailsCard.appendChild(actionDiv);
        } else if (user.role === 'employee' && (shipment.status === 'active' || shipment.status === 'in_transit')) {
            const checkinForm = document.createElement('div');
            checkinForm.className = 'mt-4 border-top pt-4';
            checkinForm.innerHTML = `
                <h4>Add Checkpoint</h4>
                <form id="checkpointForm" class="mt-4">
                    <div class="form-group">
                        <label class="form-label">Note</label>
                        <input type="text" id="cpNote" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Status Update</label>
                        <select id="cpStatus" class="form-select">
                            <option value="in_transit">In Transit</option>
                            <option value="issue">Issue</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Photo Evidence (Optional)</label>
                        <input type="file" id="cpPhoto" class="form-input" accept="image/*">
                    </div>
                    <button type="submit" class="btn btn-success">Save Checkpoint</button>
                </form>
            `;
            detailsCard.appendChild(checkinForm);
        }
        
        // Timeline
        const timelineDiv = document.createElement('div');
        timelineDiv.className = 'timeline mt-4 pt-4';
        timelineDiv.innerHTML = `<h4>Timeline</h4>`;
        
        if (shipment.checkpoints.length === 0) {
            timelineDiv.innerHTML += '<p>No checkpoints yet.</p>';
        } else {
            shipment.checkpoints.forEach(cp => {
                const item = document.createElement('div');
                item.className = 'timeline-item';
                
                let imgHtml = '';
                if (cp.image) {
                    imgHtml = `<img src="${cp.image}" class="photo-preview">`;
                }
                
                item.innerHTML = `
                    <small style="opacity: 0.7;">${new Date(cp.timestamp).toLocaleString()}</small><br>
                    <strong>${Utils.sanitize(cp.status.toUpperCase())}</strong>: ${Utils.sanitize(cp.note)}
                    <br>${imgHtml}
                `;
                timelineDiv.appendChild(item);
            });
        }
        detailsCard.appendChild(timelineDiv);
        appContainer.appendChild(detailsCard);

        // Bind Action Events
        setTimeout(() => {
            document.getElementById('backBtn').onclick = () => window.history.back();
            
            if (document.getElementById('approveBtn')) {
                document.getElementById('approveBtn').onclick = () => {
                    const empId = document.getElementById('assignEmployee').value;
                    const s = Store.getShipment(id);
                    s.status = 'active';
                    s.employee_id = empId;
                    Store.saveShipment(s);
                    Router.navigate('#shipment?id=' + id);
                };
                document.getElementById('rejectBtn').onclick = () => {
                    const s = Store.getShipment(id);
                    s.status = 'rejected';
                    Store.saveShipment(s);
                    Router.navigate('#shipment?id=' + id);
                };
            }
            
            if (document.getElementById('checkpointForm')) {
                document.getElementById('checkpointForm').onsubmit = (e) => {
                    e.preventDefault();
                    const note = document.getElementById('cpNote').value;
                    const status = document.getElementById('cpStatus').value;
                    const photoInput = document.getElementById('cpPhoto');
                    
                    const processCheckpoint = (base64Img) => {
                        const s = Store.getShipment(id);
                        s.checkpoints.push({
                            timestamp: Date.now(),
                            note: note,
                            status: status,
                            image: base64Img
                        });
                        if (status === 'issue' || status === 'delivered') s.status = status;
                        Store.saveShipment(s);
                        Router.navigate('#shipment?id=' + id);
                    };

                    if (photoInput.files.length > 0) {
                        const reader = new FileReader();
                        reader.onload = (ev) => processCheckpoint(ev.target.result);
                        reader.readAsDataURL(photoInput.files[0]);
                    } else {
                        processCheckpoint(null);
                    }
                };
            }
        }, 0);

        // Chat modules
        if (['manager', 'employee'].includes(user.role)) {
            appContainer.appendChild(this.createChatModule(id, 'internal'));
        }
        if (['customer', 'employee'].includes(user.role)) {
            appContainer.appendChild(this.createChatModule(id, 'client'));
        }
    },
    
    createChatModule(shipmentId, channel) {
        const title = channel === 'internal' ? 'Internal Chat (Manager ↔ Employee)' : 'Client Chat (Customer ↔ Employee)';
        const card = document.createElement('div');
        card.className = 'card animate-fade-in';
        card.innerHTML = `
            <h4>${title}</h4>
            <div id="${channel}ChatBox" class="chat-box"></div>
            <form id="${channel}ChatForm" class="flex gap-2 mt-4">
                <input type="text" id="${channel}ChatInput" class="form-input" style="flex:1;" placeholder="Type a message..." required>
                <button type="submit" class="btn btn-primary"><i class="ph-bold ph-paper-plane-right"></i> Send</button>
            </form>
        `;
        
        setTimeout(() => {
            this.renderMessages(shipmentId, channel);
            document.getElementById(`${channel}ChatForm`).onsubmit = (e) => {
                e.preventDefault();
                const input = document.getElementById(`${channel}ChatInput`);
                const text = input.value.trim();
                if (!text) return;
                
                const shipment = Store.getShipment(shipmentId);
                const user = Auth.getCurrentUser();
                const chatArray = channel === 'internal' ? shipment.internalChat : shipment.clientChat;
                
                chatArray.push({
                    senderId: user.id,
                    senderName: user.name,
                    timestamp: Date.now(),
                    text: text
                });
                
                Store.saveShipment(shipment);
                input.value = '';
                // Render instantly by re-fetching from Store
                this.renderMessages(shipmentId, channel);
            };
        }, 0);
        
        return card;
    },
    
    renderMessages(shipmentId, channel) {
        // Must fetch fresh shipment object as per spec
        const shipment = Store.getShipment(shipmentId);
        const user = Auth.getCurrentUser();
        const chatArray = channel === 'internal' ? shipment.internalChat : shipment.clientChat;
        const box = document.getElementById(`${channel}ChatBox`);
        if (!box) return;
        
        box.innerHTML = '';
        if (!chatArray || chatArray.length === 0) {
            box.innerHTML = '<p style="opacity: 0.6; text-align: center;">No messages yet.</p>';
            return;
        }
        
        chatArray.forEach(m => {
            const isSelf = m.senderId === user.id;
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${isSelf ? 'message-self' : ''}`;
            
            const metaDiv = document.createElement('div');
            metaDiv.style.fontSize = '0.75em';
            metaDiv.style.opacity = '0.8';
            metaDiv.style.marginBottom = '4px';
            metaDiv.textContent = `${m.senderName} - ${new Date(m.timestamp).toLocaleTimeString()}`;
            
            // Safe text injection avoiding innerHTML
            const textDiv = document.createElement('div');
            textDiv.textContent = m.text; 
            
            msgDiv.appendChild(metaDiv);
            msgDiv.appendChild(textDiv);
            box.appendChild(msgDiv);
        });
        
        box.scrollTop = box.scrollHeight;
    }
};

// --- ROUTER ---
const Router = {
    navigate(hash) {
        window.location.hash = hash;
    },
    handleRoute() {
        const app = document.getElementById('app');
        const hash = window.location.hash || '#login';
        const user = Auth.getCurrentUser();

        // Guards
        if (!user && hash !== '#login') {
            return this.navigate('#login');
        }
        if (user && hash === '#login') {
            return this.navigate('#dashboard');
        }

        const [path, queryString] = hash.split('?');
        const params = new URLSearchParams(queryString || '');

        app.innerHTML = ''; // Clear container

        if (path === '#login') {
            Views.login(app);
        } else if (path === '#dashboard') {
            if (user.role === 'manager') Views.managerDashboard(app);
            else if (user.role === 'employee') Views.employeeDashboard(app);
            else Views.customerDashboard(app);
        } else if (path === '#request-shipment') {
            if (user.role === 'customer' || user.role === 'manager') {
                Views.requestShipment(app);
            } else {
                this.navigate('#dashboard');
            }
        } else if (path === '#shipment') {
            const id = params.get('id');
            Views.shipmentDetails(app, id);
        } else {
            app.innerHTML = '<h2>404 Not Found</h2><button class="btn" onclick="window.history.back()">Go Back</button>';
        }
    }
};

// --- INIT ---
window.addEventListener('hashchange', () => Router.handleRoute());
window.addEventListener('DOMContentLoaded', () => {
    Store.init();
    Router.handleRoute();
});
