// plan.types.ts

export interface IPlan {
  id: string;
  name: string;
  credit: number;
  price: number;
  benifits: string[];
  activities: string[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

// CreatePlanDto
export interface CreatePlanDto {
  name: string;
  credit: number;
  price: number;
  benifits: string[];
  activities: string[];
}

// UpdatePlanDto (Partial of CreatePlanDto)
export type UpdatePlanDto = Partial<CreatePlanDto>;
