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
  date: string; // ISO string format for Date
  participants?: number; // Optional number of participants
  status: ScheduleStatusEnum; // Status of the schedule
  createdAt: string; // ISO string format for creation timestamp
  updatedAt: string; // ISO string format for last update timestamp
}

export interface CreateScheduleDto {
  activityId: string; // UUID of the associated activity
  date: string; // ISO string format for Date
  participants?: number; // Optional number of participants
}

export type UpdateScheduleDto = Partial<CreateScheduleDto>;
