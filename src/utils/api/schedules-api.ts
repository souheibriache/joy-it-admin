// schedule.hooks.ts

import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";
import fetchWithAuth from "@/utils/fetchWrapper";
import { ISchedule, UpdateScheduleDto } from "@/types/schedule";

// 1. Get schedules for a specific company (Admin)
export const useGetCompanySchedules = (companyId: string) => {
  const fetchCompanySchedules = async (): Promise<ISchedule[]> => {
    return await fetchWithAuth(`/schedule/admin/company/${companyId}`, {
      method: "GET",
    });
  };

  const {
    data: schedules,
    isLoading,
    error,
  } = useQuery(["companySchedules", companyId], fetchCompanySchedules, {
    enabled: !!companyId,
  });

  if (error) {
    toast.error("Failed to fetch company schedules");
  }

  return { schedules, isLoading };
};

// 2. Get a specific schedule by ID (Admin)
export const useAdminGetScheduleById = (scheduleId: string) => {
  const fetchScheduleById = async (): Promise<ISchedule> => {
    return await fetchWithAuth(`/schedule/admin/${scheduleId}`, {
      method: "GET",
    });
  };

  const {
    data: schedule,
    isLoading,
    error,
  } = useQuery(["schedule", scheduleId], fetchScheduleById, {
    enabled: !!scheduleId,
  });

  if (error) {
    toast.error("Failed to fetch schedule details");
  }

  return { schedule, isLoading };
};

// 3. Update a schedule (Admin)
export const useAdminUpdateSchedule = () => {
  const queryClient = useQueryClient();

  const updateSchedule = async ({
    scheduleId,
    data,
  }: {
    scheduleId: string;
    data: UpdateScheduleDto;
  }): Promise<ISchedule> => {
    return await fetchWithAuth(`/schedule/admin/${scheduleId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  return useMutation(updateSchedule, {
    onSuccess: () => {
      toast.success("Schedule updated successfully");
      queryClient.invalidateQueries("companySchedules");
    },
    onError: () => {
      toast.error("Failed to update schedule");
    },
  });
};
