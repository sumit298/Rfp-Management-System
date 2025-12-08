import type { RFP, Vendor, Proposal, ComparisonResult } from './api';

export const mockVendors: Vendor[] = [
  {
    _id: 'v1',
    name: 'John Smith',
    email: 'john@techsupply.com',
    company: 'TechSupply Co.',
    phone: '+1 (555) 123-4567',
  },
  {
    _id: 'v2',
    name: 'Sarah Johnson',
    email: 'sarah@officepro.com',
    company: 'OfficePro Solutions',
    phone: '+1 (555) 234-5678',
  },
  {
    _id: 'v3',
    name: 'Michael Chen',
    email: 'michael@furnishplus.com',
    company: 'FurnishPlus Inc.',
    phone: '+1 (555) 345-6789',
  },
];

export const mockRFPs: RFP[] = [
  {
    _id: 'rfp1',
    title: 'Office Furniture Procurement',
    description: 'Complete office furniture setup for new headquarters',
    requirements: {
      items: [
        { name: 'Ergonomic Office Chairs', specs: 'High-back mesh chairs with lumbar support', quantity: 500 },
        { name: 'Standing Desks', specs: 'Electric height-adjustable desks', quantity: 200 },
        { name: 'Conference Tables', specs: 'Large oval tables for 12-person meetings', quantity: 10 },
      ],
      budget: 180000,
      deliveryDays: 30,
      paymentTerms: '50% upfront, 50% on delivery',
      warranty: '3-year manufacturer warranty',
    },
    status: 'sent',
    selectedVendors: ['v1', 'v2', 'v3'],
    createdAt: '2024-01-20T14:00:00Z',
  },
  {
    _id: 'rfp2',
    title: 'IT Equipment Upgrade',
    description: 'Laptop and monitor refresh for engineering team',
    requirements: {
      items: [
        { name: 'Developer Laptops', specs: 'High-performance laptops with 32GB RAM, 1TB SSD', quantity: 50 },
        { name: '4K Monitors', specs: '32-inch 4K IPS monitors with USB-C', quantity: 100 },
      ],
      budget: 250000,
      deliveryDays: 14,
      paymentTerms: 'Net 30',
      warranty: '2-year warranty',
    },
    status: 'draft',
    selectedVendors: [],
    createdAt: '2024-01-22T09:30:00Z',
  },
];

export const mockProposals: Proposal[] = [
  {
    _id: 'p1',
    rfpId: 'rfp1',
    vendorId: mockVendors[0],
    pricing: {
      items: [
        { name: 'Ergonomic Office Chairs', unitPrice: 250, quantity: 500, total: 125000 },
        { name: 'Standing Desks', unitPrice: 200, quantity: 200, total: 40000 },
        { name: 'Conference Tables', unitPrice: 1000, quantity: 10, total: 10000 },
      ],
      totalCost: 175000,
    },
    terms: {
      deliveryDays: 25,
      paymentTerms: '40% upfront, 60% on delivery',
      warranty: '5-year extended warranty',
    },
    aiScore: 92,
    aiSummary: 'Excellent proposal with competitive pricing, extended warranty, and faster delivery.',
    status: 'received',
  },
  {
    _id: 'p2',
    rfpId: 'rfp1',
    vendorId: mockVendors[1],
    pricing: {
      items: [
        { name: 'Ergonomic Office Chairs', unitPrice: 230, quantity: 500, total: 115000 },
        { name: 'Standing Desks', unitPrice: 215, quantity: 200, total: 43000 },
        { name: 'Conference Tables', unitPrice: 1000, quantity: 10, total: 10000 },
      ],
      totalCost: 168000,
    },
    terms: {
      deliveryDays: 35,
      paymentTerms: '50% upfront, 50% on delivery',
      warranty: '3-year warranty',
    },
    aiScore: 78,
    aiSummary: 'Lowest price but longer delivery time. Good for budget-conscious projects.',
    status: 'received',
  },
  {
    _id: 'p3',
    rfpId: 'rfp1',
    vendorId: mockVendors[2],
    pricing: {
      items: [
        { name: 'Ergonomic Office Chairs', unitPrice: 280, quantity: 500, total: 140000 },
        { name: 'Standing Desks', unitPrice: 225, quantity: 200, total: 45000 },
        { name: 'Conference Tables', unitPrice: 1000, quantity: 10, total: 10000 },
      ],
      totalCost: 195000,
    },
    terms: {
      deliveryDays: 20,
      paymentTerms: 'Net 45',
      warranty: '5-year warranty + maintenance',
    },
    aiScore: 85,
    aiSummary: 'Premium offering with fastest delivery and best payment terms.',
    status: 'received',
  },
];

export const mockComparison: ComparisonResult = {
  proposals: mockProposals,
  recommendation: {
    vendorId: 'v1',
    vendorName: 'TechSupply Co.',
    reasoning: 'TechSupply Co. offers the best balance of price, delivery time, and warranty coverage. Their 5-year extended warranty provides significant long-term value.',
  },
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  rfps: {
    getAll: async (): Promise<RFP[]> => {
      await delay(500);
      return [...mockRFPs];
    },
    getById: async (id: string): Promise<RFP | undefined> => {
      await delay(300);
      return mockRFPs.find(r => r._id === id);
    },
    create: async (naturalLanguageInput: string): Promise<RFP> => {
      await delay(1500);
      const newRFP: RFP = {
        _id: `rfp${Date.now()}`,
        title: 'AI-Generated Office Supplies RFP',
        description: naturalLanguageInput.slice(0, 200),
        requirements: {
          items: [
            { name: 'Office Supplies', specs: 'Based on your requirements', quantity: 100 },
          ],
          budget: 50000,
          deliveryDays: 14,
          paymentTerms: 'Net 30',
          warranty: '1-year warranty',
        },
        status: 'draft',
        selectedVendors: [],
        createdAt: new Date().toISOString(),
      };
      mockRFPs.unshift(newRFP);
      return newRFP;
    },
    send: async (id: string, vendorIds: string[]): Promise<{ message: string }> => {
      await delay(800);
      const rfp = mockRFPs.find(r => r._id === id);
      if (rfp) {
        rfp.status = 'sent';
        rfp.selectedVendors = vendorIds;
      }
      return { message: `RFP sent to ${vendorIds.length} vendors` };
    },
    getComparison: async (id: string): Promise<ComparisonResult | null> => {
      await delay(1000);
      if (id === 'rfp1') {
        return mockComparison;
      }
      return null;
    },
  },
  vendors: {
    getAll: async (): Promise<Vendor[]> => {
      await delay(400);
      return [...mockVendors];
    },
    create: async (data: Omit<Vendor, '_id'>): Promise<Vendor> => {
      await delay(500);
      const newVendor: Vendor = {
        ...data,
        _id: `v${Date.now()}`,
      };
      mockVendors.push(newVendor);
      return newVendor;
    },
    update: async (id: string, data: Partial<Vendor>): Promise<Vendor> => {
      await delay(500);
      const index = mockVendors.findIndex(v => v._id === id);
      if (index !== -1) {
        mockVendors[index] = { ...mockVendors[index], ...data };
        return mockVendors[index];
      }
      throw new Error('Vendor not found');
    },
    delete: async (id: string): Promise<void> => {
      await delay(400);
      const index = mockVendors.findIndex(v => v._id === id);
      if (index !== -1) {
        mockVendors.splice(index, 1);
      }
    },
  },
  proposals: {
    getByRfpId: async (rfpId: string): Promise<Proposal[]> => {
      await delay(400);
      return mockProposals.filter(p => p.rfpId === rfpId);
    },
  },
};
