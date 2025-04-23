import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";
import fetchWithAuth from "@/utils/fetchWrapper";
import { IPricing } from "@/types/pricing";

export const useGetPricing = () => {
  const fetchPricing = async (): Promise<IPricing> => {
    const response = await fetchWithAuth("/pricing", { method: "GET" });
    return response;
  };

  const {
    data: pricing,
    isLoading,
    error,
  } = useQuery<IPricing>("pricing", fetchPricing, {
    onError: () => {
      toast.error("Failed to fetch pricing");
    },
  });

  return { pricing, isLoading, error };
};

export const useUpdatePricing = () => {
  const queryClient = useQueryClient();
  const updatePricing = async ({
    data,
  }: {
    data: IPricing;
  }): Promise<IPricing> => {
    return await fetchWithAuth(`/pricing`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  return useMutation(updatePricing, {
    onSuccess: () => {
      toast.success("Pricing updated successfully");
      queryClient.invalidateQueries("pricing");
    },
    onError: () => {
      toast.error("Failed to update pricing");
    },
  });
};
