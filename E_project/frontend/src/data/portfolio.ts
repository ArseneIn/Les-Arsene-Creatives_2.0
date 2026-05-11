// src/data/portfolio.ts
export interface Milestone {
  name: string;
  date: string;
  status: 'Completed' | 'On Track' | 'At Risk' | 'Delayed';
}

export interface TeamMember {
  name: string;
  initials: string;
  role: string;
  allocation: number; // percentage
  color: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  client: string;
  manager: string;
  managerInitials: string;
  phase: 'Initiation' | 'Planning' | 'Execution' | 'Monitoring' | 'Closing';
  status: 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  budget: number;
  actual: number;
  spi: number;         // Schedule Performance Index (>1 = ahead, <1 = behind)
  cpi: number;         // Cost Performance Index (>1 = under budget)
  completion: number;  // % complete
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskCount: number;
  milestones: Milestone[];
  team: TeamMember[];
  startDate: string;
  endDate: string;
  sector: string;
  tasksTotal: number;
  tasksCompleted: number;
  trend: 'up' | 'stable' | 'down';
}

export const MOCK_PORTFOLIO: ProjectSummary[] = [
  {
    id: 'p1',
    name: 'Smart Logistics Platform',
    client: 'LOGI Corp Rwanda',
    manager: 'Nuru Freddy',
    managerInitials: 'NF',
    phase: 'Execution',
    status: 'Active',
    budget: 500000,
    actual: 312000,
    spi: 0.92,
    cpi: 1.05,
    completion: 58,
    riskLevel: 'Medium',
    riskCount: 3,
    startDate: '2026-01-10',
    endDate: '2026-08-30',
    sector: 'Technology',
    tasksTotal: 84,
    tasksCompleted: 49,
    trend: 'up',
    milestones: [
      { name: 'Architecture Sign-Off', date: '2026-03-15', status: 'Completed' },
      { name: 'MVP Release', date: '2026-05-31', status: 'On Track' },
      { name: 'Beta Launch', date: '2026-07-15', status: 'At Risk' },
      { name: 'Go-Live', date: '2026-08-30', status: 'On Track' },
    ],
    team: [
      { name: 'Nuru Freddy', initials: 'NF', role: 'PM', allocation: 80, color: '#018bf1' },
      { name: 'Alice K.', initials: 'AK', role: 'Lead Dev', allocation: 100, color: '#AF52DE' },
      { name: 'Bob M.', initials: 'BM', role: 'DevOps', allocation: 60, color: '#34C759' },
      { name: 'Claire D.', initials: 'CD', role: 'QA', allocation: 50, color: '#FF9500' },
    ],
  },
  {
    id: 'p2',
    name: 'Curuza POS Upgrade',
    client: 'Smart Merchants Ltd',
    manager: 'Alice K.',
    managerInitials: 'AK',
    phase: 'Planning',
    status: 'Active',
    budget: 200000,
    actual: 38000,
    spi: 1.1,
    cpi: 1.2,
    completion: 18,
    riskLevel: 'Low',
    riskCount: 1,
    startDate: '2026-03-01',
    endDate: '2026-09-30',
    sector: 'Finance',
    tasksTotal: 42,
    tasksCompleted: 8,
    trend: 'stable',
    milestones: [
      { name: 'Requirements Freeze', date: '2026-04-30', status: 'Completed' },
      { name: 'Design Prototype', date: '2026-06-15', status: 'On Track' },
      { name: 'UAT Sign-Off', date: '2026-09-01', status: 'On Track' },
    ],
    team: [
      { name: 'Alice K.', initials: 'AK', role: 'PM', allocation: 70, color: '#AF52DE' },
      { name: 'David E.', initials: 'DE', role: 'UI/UX', allocation: 100, color: '#FF3B30' },
      { name: 'Eve F.', initials: 'EF', role: 'Backend', allocation: 80, color: '#018bf1' },
    ],
  },
  {
    id: 'p3',
    name: 'Enterprise Reporting Suite',
    client: 'National Analytics Bureau',
    manager: 'Bob M.',
    managerInitials: 'BM',
    phase: 'Initiation',
    status: 'Active',
    budget: 350000,
    actual: 12000,
    spi: 0.75,
    cpi: 0.9,
    completion: 5,
    riskLevel: 'Critical',
    riskCount: 6,
    startDate: '2026-04-01',
    endDate: '2027-01-31',
    sector: 'Government',
    tasksTotal: 110,
    tasksCompleted: 6,
    trend: 'down',
    milestones: [
      { name: 'Stakeholder Kickoff', date: '2026-04-20', status: 'Delayed' },
      { name: 'Data Architecture', date: '2026-06-30', status: 'At Risk' },
      { name: 'Phase 1 Delivery', date: '2026-10-15', status: 'At Risk' },
    ],
    team: [
      { name: 'Bob M.', initials: 'BM', role: 'PM', allocation: 100, color: '#34C759' },
      { name: 'Grace H.', initials: 'GH', role: 'Data Analyst', allocation: 100, color: '#FF9500' },
    ],
  },
  {
    id: 'p4',
    name: 'Heritage Arts Digital Archive',
    client: 'Rwanda Cultural Trust',
    manager: 'Claire D.',
    managerInitials: 'CD',
    phase: 'Execution',
    status: 'Active',
    budget: 120000,
    actual: 95000,
    spi: 1.05,
    cpi: 0.88,
    completion: 74,
    riskLevel: 'Medium',
    riskCount: 2,
    startDate: '2025-10-01',
    endDate: '2026-06-30',
    sector: 'Culture',
    tasksTotal: 55,
    tasksCompleted: 41,
    trend: 'stable',
    milestones: [
      { name: 'Content Collection', date: '2026-01-15', status: 'Completed' },
      { name: 'Platform Build', date: '2026-04-01', status: 'Completed' },
      { name: 'Public Launch', date: '2026-06-30', status: 'On Track' },
    ],
    team: [
      { name: 'Claire D.', initials: 'CD', role: 'PM', allocation: 60, color: '#FF9500' },
      { name: 'Ivan J.', initials: 'IJ', role: 'Full Stack', allocation: 100, color: '#018bf1' },
    ],
  },
  {
    id: 'p5',
    name: 'Mobile Health Monitoring System',
    client: 'HealthBridge NGO',
    manager: 'Grace H.',
    managerInitials: 'GH',
    phase: 'Monitoring',
    status: 'Active',
    budget: 280000,
    actual: 261000,
    spi: 1.02,
    cpi: 1.01,
    completion: 91,
    riskLevel: 'Low',
    riskCount: 0,
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    sector: 'Health',
    tasksTotal: 68,
    tasksCompleted: 62,
    trend: 'up',
    milestones: [
      { name: 'Device Integration', date: '2026-01-30', status: 'Completed' },
      { name: 'Clinical Pilot', date: '2026-03-15', status: 'Completed' },
      { name: 'National Rollout', date: '2026-05-31', status: 'On Track' },
    ],
    team: [
      { name: 'Grace H.', initials: 'GH', role: 'PM', allocation: 90, color: '#FF9500' },
      { name: 'Alice K.', initials: 'AK', role: 'Consultant', allocation: 20, color: '#AF52DE' },
    ],
  },
];
