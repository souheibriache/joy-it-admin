// schedule.types.ts

export enum ScheduleStatusEnum {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export interface ISchedule {
  id: string;
  activityId: string;
  date: string;
  participants?: number;
  status: ScheduleStatusEnum;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleDto {
  activityId: string;
  date: string;
  participants?: number;
}

export type UpdateScheduleDto = Partial<CreateScheduleDto>;
