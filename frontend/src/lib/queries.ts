import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Vendor, RFP, Proposal, ComparisonResult } from './api';

// Vendors
export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: api.vendors.getAll,
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.vendors.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vendor> }) =>
      api.vendors.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.vendors.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

// RFPs
export const useRFPs = () => {
  return useQuery({
    queryKey: ['rfps'],
    queryFn: api.rfps.getAll,
  });
};

export const useRFP = (id: string) => {
  return useQuery({
    queryKey: ['rfps', id],
    queryFn: () => api.rfps.getById(id),
    enabled: !!id,
  });
};

export const useCreateRFP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.rfps.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
};

export const useSendRFP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vendorIds }: { id: string; vendorIds: string[] }) =>
      api.rfps.send(id, vendorIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
  });
};

export const useRFPComparison = (id: string) => {
  return useQuery({
    queryKey: ['rfps', id, 'comparison'],
    queryFn: () => api.rfps.getComparison(id),
    enabled: !!id,
  });
};

// Proposals
export const useProposals = (rfpId: string) => {
  return useQuery({
    queryKey: ['proposals', rfpId],
    queryFn: () => api.proposals.getByRfpId(rfpId),
    enabled: !!rfpId,
  });
};

export const useReceiveProposal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.proposals.receive,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposals', variables.rfpId] });
    },
  });
};
