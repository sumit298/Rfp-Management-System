import { useQuery } from '@tanstack/react-query';
import { proposalApi } from '@/lib/api';

export const useProposals = (rfpId: string) => {
  return useQuery({
    queryKey: ['proposals', rfpId],
    queryFn: () => proposalApi.getByRfpId(rfpId),
    enabled: !!rfpId,
  });
};
