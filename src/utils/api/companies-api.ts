import { useMutation, useQuery, useQueryClient } from "react-query";
import fetchWithAuth from "../fetchWrapper";
import { toast } from "sonner";
import { serializeQuery } from "../methods";
import { CompanyOptionsDto, UpdateCompanyDto } from "@/types/company";

export const useGetCompanyById = (companyId: string) => {
  const fetchCompanyById = async () => {
    return await fetchWithAuth(`/admin/companies/${companyId}`, {
      method: "GET",
    });
  };

  const {
    data: company,
    isLoading,
    error,
  } = useQuery(["company", companyId], fetchCompanyById, {
    enabled: !!companyId,
  });

  if (error) {
    toast.error("Failed to fetch company details");
  }

  return { company, isLoading };
};

export const useGetPaginatedCompanies = (options: CompanyOptionsDto) => {
  const fetchPaginatedCompanies = async () => {
    const params = serializeQuery(options);
    return await fetchWithAuth(`/admin/companies?${params}`, { method: "GET" });
  };

  const {
    data: companies,
    isLoading,
    error,
  } = useQuery(["companies", options], fetchPaginatedCompanies);

  if (error) {
    toast.error("Failed to fetch companies");
  }

  return { companies, isLoading };
};

export const useVerifyCompany = () => {
  const queryClient = useQueryClient();

  const verifyCompany = async (companyId: string) => {
    return await fetchWithAuth(`/admin/companies/${companyId}/verify`, {
      method: "PUT",
    });
  };

  return useMutation(verifyCompany, {
    onSuccess: () => {
      toast.success("Company verified successfully");
      queryClient.invalidateQueries("companies");
    },
    onError: () => {
      toast.error("Failed to verify company");
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  const updateCompany = async ({
    companyId,
    data,
  }: {
    companyId: string;
    data: UpdateCompanyDto;
  }) => {
    return await fetchWithAuth(`/admin/companies/${companyId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  return useMutation(updateCompany, {
    onSuccess: () => {
      toast.success("Company updated successfully");
      queryClient.invalidateQueries("companies");
    },
    onError: () => {
      toast.error("Failed to update company");
    },
  });
};
