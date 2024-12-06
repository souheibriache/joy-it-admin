import { OrderOptionsDto, PageDto } from "./order";

export interface ICompany {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  employeesNumber: number;
  isVerified: boolean;
  logo?: string; // Optional, as it might not always be present
  client?: any; // Replace `any` with the actual type of `client` if available
  subscription?: any; // Replace `any` with the actual type of `subscription` if available
}

export interface CreateCompanyDto {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  employeesNumber: number;
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {}

export interface CompanyFilterDto {
  name?: string;
  isVerified?: boolean;
}

export interface CompanyOptionsDto {
  page?: number;
  take?: number;
  query?: CompanyFilterDto;
  sort?: OrderOptionsDto;
}

export type CompanySearchResponse = PageDto<ICompany>;
