import { Task, ChatMessage, HistoryEntry } from '@/types/task.types';
import { Staff, Vendor } from '@/types/staff.types';
import { Project, Checklist, Alert } from '@/types/project.types';

const now = Date.now();
const dayMs = 86400000;
const hourMs = 3600000;

export const mockStaff: Staff[] = [
  { id: 's1', name: 'Chidi Okonkwo', email: 'chidi@fifs.ng', phone: '+234 802 345 6789', role: 'technician', status: 'on-site', avatar: 'CO', performanceScore: 87, attendanceLog: [
    { id: 'a1', date: new Date(now - dayMs).toISOString(), checkIn: '07:45', checkOut: '17:30', status: 'present' },
    { id: 'a2', date: new Date(now - 2*dayMs).toISOString(), checkIn: '08:00', checkOut: '17:15', status: 'present' },
    { id: 'a3', date: new Date(now - 3*dayMs).toISOString(), checkIn: '08:30', checkOut: '16:45', status: 'late' },
  ], taskHistory: ['t1', 't3'], discipline: [] },
  { id: 's2', name: 'Amara Eze', email: 'amara@fifs.ng', phone: '+234 803 456 7890', role: 'supervisor', status: 'on-site', avatar: 'AE', performanceScore: 92, attendanceLog: [
    { id: 'a4', date: new Date(now - dayMs).toISOString(), checkIn: '07:30', checkOut: '18:00', status: 'present' },
    { id: 'a5', date: new Date(now - 2*dayMs).toISOString(), checkIn: '07:50', checkOut: '17:30', status: 'present' },
  ], taskHistory: ['t2'], discipline: [{ id: 'd1', date: new Date(now - 30*dayMs).toISOString(), type: 'commendation', description: 'Quick resolution of HVAC crisis in Block A', issuedBy: 'Management' }] },
  { id: 's3', name: 'Femi Adeyemi', email: 'femi@fifs.ng', phone: '+234 804 567 8901', role: 'electrician', status: 'on-site', avatar: 'FA', performanceScore: 78, attendanceLog: [
    { id: 'a6', date: new Date(now - dayMs).toISOString(), checkIn: '08:15', checkOut: '17:00', status: 'present' },
  ], taskHistory: ['t4', 't5'], discipline: [] },
  { id: 's4', name: 'Ngozi Okafor', email: 'ngozi@fifs.ng', phone: '+234 805 678 9012', role: 'engineer', status: 'off-site', avatar: 'NO', performanceScore: 95, attendanceLog: [
    { id: 'a7', date: new Date(now - dayMs).toISOString(), checkIn: '07:00', checkOut: '16:30', status: 'present' },
  ], taskHistory: ['t6'], discipline: [] },
  { id: 's5', name: 'Isaac Bello', email: 'isaac@fifs.ng', phone: '+234 806 789 0123', role: 'plumber', status: 'on-site', avatar: 'IB', performanceScore: 81, attendanceLog: [
    { id: 'a8', date: new Date(now - dayMs).toISOString(), checkIn: '08:00', checkOut: '17:30', status: 'present' },
  ], taskHistory: ['t7'], discipline: [] },
  { id: 's6', name: 'Blessing John', email: 'blessing@fifs.ng', phone: '+234 807 890 1234', role: 'cleaner', status: 'on-leave', avatar: 'BJ', performanceScore: 90, attendanceLog: [
    { id: 'a9', date: new Date(now - 5*dayMs).toISOString(), checkIn: '07:30', checkOut: '16:00', status: 'present' },
  ], taskHistory: ['t8'], discipline: [] },
];

export const mockVendors: Vendor[] = [
  { id: 'v1', companyName: 'DeRocks Plumbing Services', trade: 'Plumbing', rating: 4.5, slaScore: 92, contactPerson: 'Mr. Rockson', phone: '+234 808 901 2345', email: 'derocks@email.ng',
    jobHistory: [{ id: 'j1', taskId: 't7', description: 'Fixed burst pipe at admin block', date: new Date(now - 7*dayMs).toISOString(), rating: 5, cost: 85000 }],
    responseTimeAvg: 45, slaCompliance: 94 },
  { id: 'v2', companyName: 'PowerGrid Electricals', trade: 'Electrical', rating: 4.8, slaScore: 96, contactPerson: 'Eng. Tunde', phone: '+234 809 012 3456', email: 'powergrid@email.ng',
    jobHistory: [{ id: 'j2', taskId: 't4', description: 'Generator control panel repair', date: new Date(now - 14*dayMs).toISOString(), rating: 5, cost: 120000 }],
    responseTimeAvg: 30, slaCompliance: 98 },
  { id: 'v3', companyName: 'CoolTemp HVAC Ltd', trade: 'HVAC', rating: 4.2, slaScore: 88, contactPerson: 'Mr. James', phone: '+234 810 123 4567', email: 'cooltemp@email.ng',
    jobHistory: [{ id: 'j3', taskId: 't3', description: 'AC repair in conference hall', date: new Date(now - 21*dayMs).toISOString(), rating: 4, cost: 95000 }],
    responseTimeAvg: 60, slaCompliance: 85 },
  { id: 'v4', companyName: 'CleanSpace Solutions', trade: 'Cleaning', rating: 4.0, slaScore: 85, contactPerson: 'Mrs. Grace', phone: '+234 811 234 5678', email: 'cleanspace@email.ng',
    jobHistory: [{ id: 'j4', taskId: 't8', description: 'Deep cleaning of executive wing', date: new Date(now - 10*dayMs).toISOString(), rating: 4, cost: 45000 }],
    responseTimeAvg: 90, slaCompliance: 82 },
];

export const mockTasks: Task[] = [
  {
    id: 't1', title: 'Burst pipe in Block A restroom', description: 'Major water leak from pipe joint, flooding the ground floor restroom. Immediate attention required.', category: 'plumbing', priority: 'critical', status: 'open', location: 'Block A - Ground Floor Restroom', assignedTo: 's5', assignedToName: 'Isaac Bello', createdBy: 'Amara Eze',
    createdAt: new Date(now - 2*hourMs).toISOString(), updatedAt: new Date(now - 2*hourMs).toISOString(), dueDate: new Date(now + 2*hourMs).toISOString(), mediaUrls: [], chatMessages: [
      { id: 'c1', taskId: 't1', senderId: 's2', senderName: 'Amara Eze', content: 'Isaac, please check this immediately. Water is spreading to the lobby.', timestamp: new Date(now - 1.5*hourMs).toISOString() },
      { id: 'c2', taskId: 't1', senderId: 's5', senderName: 'Isaac Bello', content: 'On my way now. Bringing emergency repair kit.', timestamp: new Date(now - 1*hourMs).toISOString() },
    ], history: [{ id: 'h1', taskId: 't1', action: 'Issue created', performedBy: 'Amara Eze', timestamp: new Date(now - 2*hourMs).toISOString() }], isVerified: false,
  },
  {
    id: 't2', title: 'HVAC not cooling in MD office', description: 'Air conditioning unit in Managing Director\'s office blowing warm air. Filter check and refrigerant inspection needed.', category: 'hvac', priority: 'high', status: 'in-progress', location: 'Executive Wing - 2nd Floor', assignedTo: 's2', assignedToName: 'Amara Eze', createdBy: 'Chidi Okonkwo',
    createdAt: new Date(now - 5*hourMs).toISOString(), updatedAt: new Date(now - 1*hourMs).toISOString(), dueDate: new Date(now + 3*hourMs).toISOString(), mediaUrls: [], chatMessages: [
      { id: 'c3', taskId: 't2', senderId: 's1', senderName: 'Chidi Okonkwo', content: 'The MD is complaining about the heat. Please prioritize.', timestamp: new Date(now - 4*hourMs).toISOString() },
      { id: 'c4', taskId: 't2', senderId: 's2', senderName: 'Amara Eze', content: 'Inspected the unit. Needs refrigerant recharge. Contacting CoolTemp.', timestamp: new Date(now - 2*hourMs).toISOString() },
    ], history: [
      { id: 'h2', taskId: 't2', action: 'Issue created', performedBy: 'Chidi Okonkwo', timestamp: new Date(now - 5*hourMs).toISOString() },
      { id: 'h3', taskId: 't2', action: 'Status changed to In Progress', performedBy: 'Amara Eze', timestamp: new Date(now - 3*hourMs).toISOString() },
    ], isVerified: false,
  },
  {
    id: 't3', title: 'Generator #2 failing to start', description: 'Backup generator in Block C fails to crank. Battery voltage reading low. Scheduled maintenance overdue.', category: 'generator', priority: 'critical', status: 'open', location: 'Block C - Generator Room', assignedTo: 's3', assignedToName: 'Femi Adeyemi', createdBy: 'System',
    createdAt: new Date(now - 3*hourMs).toISOString(), updatedAt: new Date(now - 3*hourMs).toISOString(), dueDate: new Date(now + 1*hourMs).toISOString(), mediaUrls: [], chatMessages: [], history: [{ id: 'h4', taskId: 't3', action: 'Issue auto-generated from checklist', performedBy: 'System', timestamp: new Date(now - 3*hourMs).toISOString() }], isVerified: false,
  },
  {
    id: 't4', title: 'Smart lighting system offline', description: 'The smart lighting control system for the parking lot is unresponsive. Motion sensors not triggering lights.', category: 'smart-systems', priority: 'medium', status: 'in-progress', location: 'Parking Lot A & B', assignedTo: 's3', assignedToName: 'Femi Adeyemi', createdBy: 'Ngozi Okafor',
    createdAt: new Date(now - 24*hourMs).toISOString(), updatedAt: new Date(now - 6*hourMs).toISOString(), dueDate: new Date(now + 12*hourMs).toISOString(), mediaUrls: [], chatMessages: [
      { id: 'c5', taskId: 't4', senderId: 's4', senderName: 'Ngozi Okafor', content: 'Femi, have you checked the central control panel? Might be a network issue.', timestamp: new Date(now - 12*hourMs).toISOString() },
    ], history: [
      { id: 'h5', taskId: 't4', action: 'Issue created', performedBy: 'Ngozi Okafor', timestamp: new Date(now - 24*hourMs).toISOString() },
      { id: 'h6', taskId: 't4', action: 'Status changed to In Progress', performedBy: 'Femi Adeyemi', timestamp: new Date(now - 6*hourMs).toISOString() },
    ], isVerified: false,
  },
  {
    id: 't5', title: 'Electrical socket sparking in Lab 3', description: 'Wall socket producing sparks when equipment is plugged in. Possible short circuit. Area cordoned off.', category: 'electrical', priority: 'critical', status: 'open', location: 'Science Lab 3 - Block B', assignedTo: 's3', assignedToName: 'Femi Adeyemi', createdBy: 'Chidi Okonkwo',
    createdAt: new Date(now - 1*hourMs).toISOString(), updatedAt: new Date(now - 1*hourMs).toISOString(), dueDate: new Date(now + 1*hourMs).toISOString(), mediaUrls: [], chatMessages: [], history: [{ id: 'h7', taskId: 't5', action: 'Issue created', performedBy: 'Chidi Okonkwo', timestamp: new Date(now - 1*hourMs).toISOString() }], isVerified: false,
  },
  {
    id: 't6', title: 'Security camera #12 feed frozen', description: 'Camera at the main entrance gate video feed stuck on same frame since yesterday. Network camera needs reboot or replacement.', category: 'smart-systems', priority: 'medium', status: 'open', location: 'Main Entrance Gate', assignedTo: 's4', assignedToName: 'Ngozi Okafor', createdBy: 'Security Desk',
    createdAt: new Date(now - 8*hourMs).toISOString(), updatedAt: new Date(now - 8*hourMs).toISOString(), dueDate: new Date(now + 16*hourMs).toISOString(), mediaUrls: [], chatMessages: [], history: [{ id: 'h8', taskId: 't6', action: 'Issue created', performedBy: 'Security Desk', timestamp: new Date(now - 8*hourMs).toISOString() }], isVerified: false,
  },
  {
    id: 't7', title: 'Carpentry: Broken cabinet door in meeting room', description: 'The cabinet door in the main meeting room is hanging off its hinges. Need repair or replacement.', category: 'carpentry', priority: 'low', status: 'resolved', location: 'Main Meeting Room - 1st Floor', assignedTo: null, createdBy: 'Admin',
    createdAt: new Date(now - 72*hourMs).toISOString(), updatedAt: new Date(now - 4*hourMs).toISOString(), mediaUrls: [], chatMessages: [
      { id: 'c6', taskId: 't7', senderId: 's5', senderName: 'Isaac Bello', content: 'Not my trade but I secured the door temporarily. Needs a carpenter.', timestamp: new Date(now - 48*hourMs).toISOString() },
    ], history: [
      { id: 'h9', taskId: 't7', action: 'Issue created', performedBy: 'Admin', timestamp: new Date(now - 72*hourMs).toISOString() },
      { id: 'h10', taskId: 't7', action: 'Resolved by vendor', performedBy: 'DeRocks Plumbing', timestamp: new Date(now - 4*hourMs).toISOString() },
    ], isVerified: false,
  },
  {
    id: 't8', title: 'Restroom cleaning - Executive wing', description: 'Daily deep cleaning for all restrooms in the executive wing area.', category: 'cleaning', priority: 'low', status: 'closed', location: 'Executive Wing Restrooms', assignedTo: 's6', assignedToName: 'Blessing John', createdBy: 'Amara Eze',
    createdAt: new Date(now - 48*hourMs).toISOString(), updatedAt: new Date(now - 24*hourMs).toISOString(), mediaUrls: [], chatMessages: [], history: [
      { id: 'h11', taskId: 't8', action: 'Issue created', performedBy: 'Amara Eze', timestamp: new Date(now - 48*hourMs).toISOString() },
      { id: 'h12', taskId: 't8', action: 'Completed and verified', performedBy: 'Amara Eze', timestamp: new Date(now - 24*hourMs).toISOString() },
    ], isVerified: true,
  },
];

export const mockChecklists: Checklist[] = [
  {
    id: 'cl1', type: 'daily', date: new Date(now).toISOString().split('T')[0], completed: false, items: [
      { id: 'cli1', checklistId: 'cl1', label: 'All restrooms clean and stocked', status: 'ok', updatedAt: new Date(now - 2*hourMs).toISOString() },
      { id: 'cli2', checklistId: 'cl1', label: 'Common areas swept and mopped', status: 'ok', updatedAt: new Date(now - 2*hourMs).toISOString() },
      { id: 'cli3', checklistId: 'cl1', label: 'Trash bins emptied', status: 'warning', note: 'Kitchen bin nearly full', updatedAt: new Date(now - 1*hourMs).toISOString() },
      { id: 'cli4', checklistId: 'cl1', label: 'Entrance mats cleaned', status: 'ok', updatedAt: new Date(now - 2*hourMs).toISOString() },
      { id: 'cli5', checklistId: 'cl1', label: 'Windows checked for damage', status: 'ok', updatedAt: new Date(now - 2*hourMs).toISOString() },
      { id: 'cli6', checklistId: 'cl1', label: 'Fire extinguishers in place', status: 'fault', note: 'Extinguisher missing in Block A corridor', updatedAt: new Date(now - 1*hourMs).toISOString() },
    ],
  },
  {
    id: 'cl2', type: 'generator', date: new Date(now).toISOString().split('T')[0], completed: false, items: [
      { id: 'cli7', checklistId: 'cl2', label: 'Fuel level checked', status: 'ok', updatedAt: new Date(now - 3*hourMs).toISOString() },
      { id: 'cli8', checklistId: 'cl2', label: 'Battery voltage normal', status: 'fault', note: 'Gen #2 battery at 11.2V - needs charging', updatedAt: new Date(now - 3*hourMs).toISOString() },
      { id: 'cli9', checklistId: 'cl2', label: 'Coolant level adequate', status: 'ok', updatedAt: new Date(now - 3*hourMs).toISOString() },
      { id: 'cli10', checklistId: 'cl2', label: 'Oil level checked', status: 'ok', updatedAt: new Date(now - 3*hourMs).toISOString() },
      { id: 'cli11', checklistId: 'cl2', label: 'Auto-transfer switch test', status: 'warning', note: 'Switch responds slowly', updatedAt: new Date(now - 3*hourMs).toISOString() },
    ],
  },
  {
    id: 'cl3', type: 'electrical', date: new Date(now).toISOString().split('T')[0], completed: true, submittedAt: new Date(now - 4*hourMs).toISOString(), items: [
      { id: 'cli12', checklistId: 'cl3', label: 'Main panel temperature check', status: 'ok', updatedAt: new Date(now - 5*hourMs).toISOString() },
      { id: 'cli13', checklistId: 'cl3', label: 'Emergency lighting test', status: 'ok', updatedAt: new Date(now - 5*hourMs).toISOString() },
      { id: 'cli14', checklistId: 'cl3', label: 'Circuit breaker inspection', status: 'ok', updatedAt: new Date(now - 5*hourMs).toISOString() },
      { id: 'cli15', checklistId: 'cl3', label: 'Grounding system check', status: 'ok', updatedAt: new Date(now - 5*hourMs).toISOString() },
      { id: 'cli16', checklistId: 'cl3', label: 'UPS battery status', status: 'ok', updatedAt: new Date(now - 5*hourMs).toISOString() },
    ],
  },
];

export const mockProjects: Project[] = [
  {
    id: 'p1', name: 'Executive Office Wing Renovation', description: 'Complete renovation of the executive office wing including new flooring, painting, lighting upgrade, and furniture installation.', type: 'renovation', status: 'active',
    startDate: new Date(now - 30*dayMs).toISOString(), endDate: new Date(now + 60*dayMs).toISOString(), budget: 15000000, budgetUsed: 5200000,
    teamMembers: ['s2', 's4', 's3'], mediaUrls: [], activityLog: [
      { id: 'l1', projectId: 'p1', action: 'Project created', performedBy: 'Management', timestamp: new Date(now - 30*dayMs).toISOString() },
      { id: 'l2', projectId: 'p1', action: 'Demolition completed', performedBy: 'Amara Eze', timestamp: new Date(now - 20*dayMs).toISOString() },
      { id: 'l3', projectId: 'p1', action: 'Electrical wiring phase started', performedBy: 'Femi Adeyemi', timestamp: new Date(now - 14*dayMs).toISOString() },
    ],
    tasks: [
      { id: 'pt1', projectId: 'p1', title: 'Demolition and stripping', description: 'Remove old fixtures, flooring, and partition walls', assignedTo: 's2', status: 'completed', dueDate: new Date(now - 22*dayMs).toISOString(), completedAt: new Date(now - 20*dayMs).toISOString() },
      { id: 'pt2', projectId: 'p1', title: 'Electrical rewiring', description: 'Run new conduit and wiring for modern lighting and power points', assignedTo: 's3', status: 'in-progress', dueDate: new Date(now - 7*dayMs).toISOString() },
      { id: 'pt3', projectId: 'p1', title: 'Flooring installation', description: 'Install new ceramic tiles and carpet in offices', assignedTo: 's2', status: 'pending', dueDate: new Date(now + 14*dayMs).toISOString() },
      { id: 'pt4', projectId: 'p1', title: 'Painting and finishing', description: 'Interior painting and wall finishing', assignedTo: null, status: 'pending', dueDate: new Date(now + 30*dayMs).toISOString() },
      { id: 'pt5', projectId: 'p1', title: 'Furniture installation', description: 'Install new office furniture and workstations', assignedTo: null, status: 'pending', dueDate: new Date(now + 45*dayMs).toISOString() },
    ],
    createdAt: new Date(now - 30*dayMs).toISOString(), updatedAt: new Date(now - 1*dayMs).toISOString(),
  },
  {
    id: 'p2', name: 'Main Electrical Panel Upgrade', description: 'Upgrade the main electrical distribution panel to handle increased load from new HVAC system and IT infrastructure.', type: 'electrical-upgrade', status: 'active',
    startDate: new Date(now - 14*dayMs).toISOString(), endDate: new Date(now + 30*dayMs).toISOString(), budget: 8000000, budgetUsed: 2100000,
    teamMembers: ['s3', 's4'], mediaUrls: [], activityLog: [
      { id: 'l4', projectId: 'p2', action: 'Project created', performedBy: 'Engineering', timestamp: new Date(now - 14*dayMs).toISOString() },
      { id: 'l5', projectId: 'p2', action: 'Load assessment completed', performedBy: 'Ngozi Okafor', timestamp: new Date(now - 10*dayMs).toISOString() },
    ],
    tasks: [
      { id: 'pt6', projectId: 'p2', title: 'Load assessment', description: 'Calculate current and future electrical load requirements', assignedTo: 's4', status: 'completed', dueDate: new Date(now - 10*dayMs).toISOString(), completedAt: new Date(now - 10*dayMs).toISOString() },
      { id: 'pt7', projectId: 'p2', title: 'Panel specification', description: 'Specify new panel requirements and order components', assignedTo: 's3', status: 'completed', dueDate: new Date(now - 5*dayMs).toISOString(), completedAt: new Date(now - 6*dayMs).toISOString() },
      { id: 'pt8', projectId: 'p2', title: 'Installation', description: 'Install new panel and connect to main supply', assignedTo: 's3', status: 'in-progress', dueDate: new Date(now + 7*dayMs).toISOString() },
      { id: 'pt9', projectId: 'p2', title: 'Testing and commissioning', description: 'Test all circuits and commission new panel', assignedTo: null, status: 'pending', dueDate: new Date(now + 20*dayMs).toISOString() },
    ],
    createdAt: new Date(now - 14*dayMs).toISOString(), updatedAt: new Date(now - 2*dayMs).toISOString(),
  },
];

export const mockAlerts: Alert[] = [
  { id: 'al1', taskName: 'Generator #2 battery check', taskId: 't3', assignedPerson: 'Femi Adeyemi', scheduledTime: new Date(now - 1.5*hourMs).toISOString(), status: 'pending', escalated: false, createdAt: new Date(now - 2*dayMs).toISOString() },
  { id: 'al2', taskName: 'HVAC filter replacement - MD Office', taskId: 't2', assignedPerson: 'Amara Eze', scheduledTime: new Date(now + 2*hourMs).toISOString(), status: 'pending', escalated: false, createdAt: new Date(now - 1*dayMs).toISOString() },
  { id: 'al3', taskName: 'Weekly fire alarm test', assignedPerson: 'Chidi Okonkwo', scheduledTime: new Date(now - 30*dayMs).toISOString(), status: 'pending', escalated: true, createdAt: new Date(now - 35*dayMs).toISOString() },
  { id: 'al4', taskName: 'Parking lot light sensor calibration', taskId: 't4', assignedPerson: 'Femi Adeyemi', scheduledTime: new Date(now - 3*hourMs).toISOString(), status: 'pending', escalated: false, createdAt: new Date(now - 7*dayMs).toISOString() },
  { id: 'al5', taskName: 'Water pump maintenance - Block A', assignedPerson: 'Isaac Bello', scheduledTime: new Date(now + 4*hourMs).toISOString(), status: 'pending', escalated: false, createdAt: new Date(now - 3*dayMs).toISOString() },
];

export const getDashboardStats = () => {
  const openIssues = mockTasks.filter(t => t.status === 'open' || t.status === 'in-progress');
  const criticalExists = openIssues.some(t => t.priority === 'critical');
  const tasksDueToday = mockTasks.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    return due.getDate() === today.getDate() && due.getMonth() === today.getMonth() && due.getFullYear() === today.getFullYear() && t.status !== 'closed';
  });
  const overdueTasks = mockTasks.filter(t => t.dueDate && new Date(t.dueDate).getTime() < Date.now() && t.status !== 'closed' && t.status !== 'resolved');
  const staffOnSite = mockStaff.filter(s => s.status === 'on-site').length;
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;

  return { openIssuesCount: openIssues.length, criticalExists, tasksDueTodayCount: tasksDueToday.length, overdueTasks, staffOnSite, activeProjects };
};
