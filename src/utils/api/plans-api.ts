// plan.hooks.ts

import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";
import fetchWithAuth from "@/utils/fetchWrapper";
import { CreatePlanDto, IPlan, UpdatePlanDto } from "@/types/plans";

// Hook to fetch all plans
export const useGetAllPlans = () => {
  const fetchPlans = async (): Promise<IPlan[]> => {
    return await fetchWithAuth("/plans", { method: "GET" });
  };

  const { data: plans, isLoading, error } = useQuery("plans", fetchPlans);

  if (error) {
    toast.error("Failed to fetch plans");
  }

  return { plans, isLoading };
};

// Hook to fetch a single plan by ID
export const useGetPlanById = (planId: string) => {
  const fetchPlanById = async (): Promise<IPlan> => {
    return await fetchWithAuth(`/plans/${planId}`, { method: "GET" });
  };

  const {
    data: plan,
    isLoading,
    error,
  } = useQuery(["plan", planId], fetchPlanById, {
    enabled: !!planId,
  });

  if (error) {
    toast.error("Failed to fetch plan details");
  }

  return { plan, isLoading };
};

// Hook to create a new plan
export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  const createPlan = async (data: CreatePlanDto): Promise<IPlan> => {
    return await fetchWithAuth("/plans", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  return useMutation(createPlan, {
    onSuccess: () => {
      toast.success("Plan created successfully");
      queryClient.invalidateQueries("plans");
    },
    onError: () => {
      toast.error("Failed to create plan");
    },
  });
};

// Hook to update a plan
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  const updatePlan = async ({
    planId,
    data,
  }: {
    planId: string;
    data: UpdatePlanDto;
  }): Promise<IPlan> => {
    return await fetchWithAuth(`/plans/${planId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  return useMutation(updatePlan, {
    onSuccess: () => {
      toast.success("Plan updated successfully");
      queryClient.invalidateQueries("plans");
    },
    onError: () => {
      toast.error("Failed to update plan");
    },
  });
};

// Hook to delete a plan
export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  const deletePlan = async (planId: string): Promise<void> => {
    return await fetchWithAuth(`/plans/${planId}`, {
      method: "DELETE",
    });
  };

  return useMutation(deletePlan, {
    onSuccess: () => {
      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries("plans");
    },
    onError: () => {
      toast.error("Failed to delete plan");
    },
  });
};
