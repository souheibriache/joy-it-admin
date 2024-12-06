import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";
import fetchWithAuth from "@/utils/fetchWrapper";
import {
  ActivityOptionsDto,
  UpdateActivityDto,
  UpdateActivityMainImageDto,
} from "@/types/activity";
import { serializeQuery } from "../methods";

// Hook to fetch a single activity by ID
export const useGetActivityById = (activityId: string) => {
  const getActivityByIdRequest = async () => {
    return await fetchWithAuth(`/activities/${activityId}`, { method: "GET" });
  };

  const {
    data: activity,
    isLoading,
    error,
  } = useQuery(["activity", activityId], getActivityByIdRequest, {
    enabled: !!activityId,
  });

  if (error) {
    toast.error("Failed to fetch activity");
  }

  return { activity, isLoading };
};

// Hook to fetch paginated activities
export const useGetPaginatedActivities = (options: ActivityOptionsDto) => {
  const getPaginatedActivitiesRequest = async () => {
    const params = serializeQuery(options);
    return await fetchWithAuth(`/activities?${params}`, { method: "GET" });
  };

  const {
    data: activities,
    isLoading,
    error,
  } = useQuery(["activities", options], getPaginatedActivitiesRequest);

  if (error) {
    toast.error("Echéc de recuperation des activités");
  }

  return { activities, isLoading };
};

// Hook to create an activity
export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  const createActivityRequest = async (data: FormData) => {
    return await fetchWithAuth(`/activities`, { method: "POST", body: data });
  };

  return useMutation(createActivityRequest, {
    onSuccess: () => {
      toast.success("Activity created successfully");
      queryClient.invalidateQueries("activities");
    },
    onError: () => {
      toast.error("Failed to create activity");
    },
  });
};

// Hook to update an activity
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  const updateActivityRequest = async ({
    activityId,
    data,
  }: {
    activityId: string;
    data: UpdateActivityDto;
  }) => {
    return await fetchWithAuth(`/activities/${activityId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  return useMutation(updateActivityRequest, {
    onSuccess: () => {
      toast.success("Activity updated successfully");
      queryClient.invalidateQueries("activities");
    },
    onError: () => {
      toast.error("Failed to update activity");
    },
  });
};

// Hook to update the main image of an activity
export const useUpdateActivityMainImage = () => {
  const queryClient = useQueryClient();

  const updateActivityMainImageRequest = async ({
    activityId,
    data,
  }: {
    activityId: string;
    data: UpdateActivityMainImageDto;
  }) => {
    return await fetchWithAuth(`/activities/${activityId}/main-image`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  return useMutation(updateActivityMainImageRequest, {
    onSuccess: (_data, variables) => {
      // Access `activityId` from the mutation variables
      queryClient.invalidateQueries(["activity", variables.activityId]);
      toast.success("Main image updated successfully");
    },
    onError: () => {
      toast.error("Failed to update main image");
    },
  });
};
// Hook to delete an activity
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  const deleteActivityRequest = async (activityId: string) => {
    return await fetchWithAuth(`/activities/${activityId}`, {
      method: "DELETE",
    });
  };

  return useMutation(deleteActivityRequest, {
    onSuccess: () => {
      toast.success("Activity deleted successfully");
      queryClient.invalidateQueries("activities");
    },
    onError: () => {
      toast.error("Failed to delete activity");
    },
  });
};
