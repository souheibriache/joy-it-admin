import { OrderOptionsDto, PageDto } from "./order";

export enum ActivityType {
  BIEN_ETRE = "BIEN_ETRE",
  TEAM_BUILDING = "TEAM_BUILDING",
  SPORT = "SPORT",
  NOURRITURE = "NOURRITURE",
  AUTRE = "AUTRE",
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
};

export type UpdateActivityDto = Partial<CreateActivityDto>;

export type UpdateActivityMainImageDto = {
  imageId: string;
};

export type ActivityFilterDto = {
  search?: string;
  types?: ActivityType[];
  durationMin?: number;
  durationMax?: number;
  isAvailable?: boolean;
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
