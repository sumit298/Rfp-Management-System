import axios from "axios";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5555/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data.data || response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

export interface RFPItem {
  name: string;
  quantity: number;
  specs: string;
}

export interface RFP {
  _id: string;
  title: string;
  description?: string;
  requirements: {
    items: RFPItem[];
    budget: number;
    deliveryDays: number;
    paymentTerms: string;
    warranty: string;
  };
  status: "draft" | "sent" | "closed";
  selectedVendors?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Vendor {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  contactPerson?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProposalItem {
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Proposal {
  _id: string;
  rfpId: string;
  vendorId: Vendor;
  pricing: {
    items: ProposalItem[];
    totalCost: number;
  };
  terms: {
    deliveryDays: number;
    paymentTerms: string;
    warranty: string;
  };
  rawEmail?: string;
  aiSummary?: string;
  aiScore?: number;
  status: "received" | "reviewed" | "accepted" | "rejected";
  receivedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComparisonResult {
  proposals: Proposal[];
  recommendation: {
    vendorId: string;
    vendorName: string;
    reasoning: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export const rfpApi = {
  getAll: (): Promise<RFP[]> => api.get("/rfps"),
  getById: (id: string): Promise<RFP> => api.get(`/rfps/${id}`),
  create: (naturalLanguageInput: string): Promise<RFP> =>
    api.post("/rfps/create", { naturalLanguageInput }),
  send: (id: string, vendorIds: string[]): Promise<{ message: string }> =>
    api.post(`/rfps/${id}/send`, { vendorIds }),
  getComparison: (id: string): Promise<ComparisonResult> => api.get(`/rfps/${id}/comparison`),
};

export const vendorApi = {
  getAll: () => api.get("/vendors"),
  create: (data: Omit<Vendor, "id">) => api.post("/vendors", data),
  update: (id: string, data: Partial<Vendor>) =>
    api.put(`/vendors/${id}`, data),
  delete: (id: string) => api.delete(`/vendors/${id}`),
};

export const proposalApi = {
  getByRfpId: (rfpId: string) => api.get(`/proposals/rfp/${rfpId}`),
};
