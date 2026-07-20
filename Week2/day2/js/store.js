// Mock Data Initialization
const INITIAL_USERS = [
  { id: 'u1', name: 'Admin Manager', role: 'manager' },
  { id: 'u2', name: 'John Doe', role: 'employee' },
  { id: 'u3', name: 'Jane Smith', role: 'employee' },
  { id: 'u4', name: 'ACME Corp', role: 'customer' },
  { id: 'u5', name: 'TechFlow Inc', role: 'customer' }
]; 

const INITIAL_SHIPMENTS = [
  {
    id: 's1',
    title: 'Server Racks to Datacenter',
    customerId: 'u4',
    employeeId: 'u2',
    status: 'In Transit', // Active, Completed, Issue
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
    messages: [
      { id: 'm1', senderId: 'u4', text: 'Has the shipment departed?', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString() },
      { id: 'm2', senderId: 'u2', text: 'Yes, departed yesterday morning.', timestamp: new Date(Date.now() - 86400000 * 1.4).toISOString() }
    ]
  },
  {
    id: 's2',
    title: 'Office Displays',
    customerId: 'u5',
    employeeId: 'u3',
    status: 'Issue',
    timeline: [
      {
        id: 't2',
        timestamp: new Date(Date.now() - 4000000).toISOString(),
        location: 'Transit Hub B',
        status: 'Issue Found',
        note: 'Box 3 shows visible water damage on the exterior.',
        photo: 'mock_damage.jpg'
      }
    ],
    messages: []
  }
];

export const Store = {
  init() {
    if (!localStorage.getItem('dc_users')) {
      localStorage.setItem('dc_users', JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem('dc_shipments')) {
      localStorage.setItem('dc_shipments', JSON.stringify(INITIAL_SHIPMENTS));
    }
  },

  getUsers() {
    return JSON.parse(localStorage.getItem('dc_users')) || [];
  },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  },

  getShipments() {
    return JSON.parse(localStorage.getItem('dc_shipments')) || [];
  },

  getShipmentById(id) {
    return this.getShipments().find(s => s.id === id);
  },

  saveShipments(shipments) {
    localStorage.setItem('dc_shipments', JSON.stringify(shipments));
  },

  createShipment(data) {
    const shipments = this.getShipments();
    const newShipment = {
      id: 's' + Date.now(),
      title: data.title,
      customerId: data.customerId,
      employeeId: data.employeeId,
      status: 'Created',
      timeline: [],
      messages: []
    };
    shipments.push(newShipment);
    this.saveShipments(shipments);
    return newShipment;
  },

  addCheckin(shipmentId, data) {
    const shipments = this.getShipments();
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;

    shipment.timeline.push({
      id: 't' + Date.now(),
      timestamp: new Date().toISOString(),
      location: data.location,
      status: data.status, // "OK" or "Issue Found"
      note: data.note,
      photo: data.photo || null
    });

    if (data.status === 'Issue Found') {
      shipment.status = 'Issue';
    } else if (data.isFinal) {
      shipment.status = 'Completed';
    } else {
      shipment.status = 'In Transit';
    }

    this.saveShipments(shipments);
  },

  addMessage(shipmentId, senderId, text) {
    const shipments = this.getShipments();
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;

    shipment.messages.push({
      id: 'm' + Date.now(),
      senderId,
      text,
      timestamp: new Date().toISOString()
    });

    this.saveShipments(shipments);
  }
};
