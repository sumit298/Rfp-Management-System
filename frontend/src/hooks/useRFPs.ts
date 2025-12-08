import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rfpApi } from "@/lib/api";
import toast from "react-hot-toast";

export const useRFPs = () => {
  return useQuery({
    queryKey: ["rfps"],
    queryFn: rfpApi.getAll,
  });
};

export const useRFP = (id: string) => {
  return useQuery({
    queryKey: ["rfps", id],
    queryFn: () => rfpApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateRFP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rfpApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rfps"] });
      toast.success("RFP created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useSendRFP = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vendorIds }: { id: string; vendorIds: string[] }) => {
      return rfpApi.send(id, vendorIds);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rfps", variables.id] });
      toast.success("RFP sent to vendors successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useRFPComparison = (id: string) => {
  return useQuery({
    queryKey: ["rfps", id, "comparison"],
    queryFn: () => rfpApi.getComparison(id),
    enabled: !!id,
  });
};
