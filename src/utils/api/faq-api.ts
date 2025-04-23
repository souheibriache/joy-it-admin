import { useMutation, useQuery, useQueryClient } from "react-query";
import fetchWithAuth from "../fetchWrapper";
import { toast } from "sonner";

export interface IFaq {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

// GET all FAQs
export const useGetFaqs = () => {
  const fetchFaqs = async (): Promise<IFaq[]> => {
    return await fetchWithAuth("/faq", { method: "GET" });
  };

  return useQuery<IFaq[]>("faqs", fetchFaqs, {
    onError: () => {
      toast.error("Failed to fetch FAQs");
    },
  });
};

// CREATE FAQ
export const useCreateFaq = () => {
  const queryClient = useQueryClient();

  const createFaq = async (data: {
    data: { question: string; answer: string };
  }): Promise<IFaq> => {
    return await fetchWithAuth("/faq", {
      method: "POST",
      body: JSON.stringify(data.data),
    });
  };

  return useMutation(createFaq, {
    onSuccess: () => {
      toast.success("FAQ created successfully");
      queryClient.invalidateQueries("faqs");
    },
    onError: () => {
      toast.error("Failed to create FAQ");
    },
  });
};

// UPDATE FAQ
export const useUpdateFaq = () => {
  const queryClient = useQueryClient();

  const updateFaq = async ({
    id,
    data,
  }: {
    id: string;
    data: { question?: string; answer?: string };
  }): Promise<IFaq> => {
    return await fetchWithAuth(`/faq/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  return useMutation(updateFaq, {
    onSuccess: () => {
      toast.success("FAQ updated successfully");
      queryClient.invalidateQueries("faqs");
    },
    onError: () => {
      toast.error("Failed to update FAQ");
    },
  });
};

// DELETE FAQ
export const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  const deleteFaq = async (id: string): Promise<{ message: string }> => {
    return await fetchWithAuth(`/faq/${id}`, {
      method: "DELETE",
    });
  };

  return useMutation(deleteFaq, {
    onSuccess: () => {
      toast.success("FAQ deleted successfully");
      queryClient.invalidateQueries("faqs");
    },
    onError: () => {
      toast.error("Failed to delete FAQ");
    },
  });
};
