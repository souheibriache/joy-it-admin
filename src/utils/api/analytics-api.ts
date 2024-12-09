import { useQuery } from "react-query";
import fetchWithAuth from "../fetchWrapper";
import { toast } from "sonner";
import { AnalyticsResponse } from "@/types/analytics";

export const useGetAnalytics = () => {
  const fetchAnalytics = async (): Promise<AnalyticsResponse> => {
    return await fetchWithAuth("/analytics", { method: "GET" });
  };

  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery("analytics", fetchAnalytics);

  if (error) {
    toast.error("Failed to fetch analytics");
  }

  return { analytics, isLoading };
};
