import { OrderOptionsDto, PageDto } from "./order";

export enum ActivityType {
  BIEN_ETRE = "BIEN_ETRE",
  TEAM_BUILDING = "TEAM_BUILDING",
  NOURRITURE = "NOURRITURE",
}

export type CreateActivityDto = {
  name: string;
  description: string;
  address: string;
  postalCode: string;
  city: string;
  locationUrl: string;
  duration: number; // Duration in hours
  creditCost: number;
  mainImageIndex?: number; // Optional
  isAvailable?: boolean; // Optional
  categories: ActivityType[];
  keyWords: string[];
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  images?: any;
};

export type UpdateActivityDto = Partial<CreateActivityDto>;

export type UpdateActivityMainImageDto = {
  imageId: string;
};

export type ActivityFilterDto = {
  search?: string | null;
  type?: ActivityType | null;
  durationMin?: number | null;
  durationMax?: number | null;
  isAvailable?: boolean | null;
};

export type ActivityOptionsDto = {
  page: number;
  take: number;
  query?: any; // Filtering options
  sort?: OrderOptionsDto; // Sorting options
};

export type Activity = {
  id: string;
  name: string;
  description: string;
  address: string;
  postalCode: string;
  city: string;
  locationUrl: string;
  duration: number;
  creditCost: number;
  mainImageIndex: number;
  isAvailable: boolean;
  categories: ActivityType[];
  keyWords: string[];
  images: string[]; // Array of image URLs or IDs
  createdAt: string;
  updatedAt: string;
};

export type ActivitySearchResponse = PageDto<Activity>;
