import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "sonner";
import { serializeQuery } from "../methods";
import fetchWithAuth from "../fetchWrapper";

export interface SupportOptions {
  page?: number;
  take?: number;
  query?: SupportFilter;
  sort?: OrderOptions;
}

export interface SupportFilter {
  name?: string;
  email?: string;
  category?: SupportCategory[];
  answeredById?: string;
  isSeen?: boolean;
  isAnswered?: boolean;
}

export interface OrderOptions {
  [field: string]: "ASC" | "DESC";
}

export enum SupportCategory {
  QUESTION = "question",
  COMPLAINT = "complaint",
  FEEDBACK = "feedback",
  // ... add more as needed
}

export interface ISupport {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  category: SupportCategory;
  question: string;
  adminAnswer?: string;
  askedBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  answeredBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  seenAt?: Date;
  answeredAt?: Date;
  attachments?: IMedia[];
  questionAttachments?: IMedia[];
}

export interface IMedia {
  id: string;
  fullUrl: string;
  name: string;
  originalName: string;
  resourceType: string;
}

export const useGetAllSupportQuestions = (options: SupportOptions) => {
  const fetchSupportQuestions = async () => {
    const params = serializeQuery(options);
    return await fetchWithAuth(`/admin/support?${params}`, {
      method: "GET",
    });
  };

  const {
    data: supports,
    isLoading,
    error,
  } = useQuery(["supports", options], fetchSupportQuestions);

  if (error) {
    toast.error("Échec du chargement des questions support");
  }

  return { supports, isLoading };
};

export const useGetSupportById = (supportId: string) => {
  const fetchSupportById = async () => {
    return await fetchWithAuth(`/admin/support/${supportId}`, {
      method: "GET",
    });
  };

  return useQuery(["support", supportId], fetchSupportById, {
    enabled: !!supportId,
    onError: () => {
      toast.error("Échec du chargement de la question support");
    },
  });
};

interface AnswerSupportInput {
  supportId: string;
  data: FormData;
}

export const useAnswerSupportQuestion = () => {
  const queryClient = useQueryClient();

  const answerSupport = async ({ supportId, data }: AnswerSupportInput) => {
    const response = await fetchWithAuth(`/admin/support/${supportId}/answer`, {
      method: "PUT",
      body: data,
    });

    return await response;
  };

  return useMutation(answerSupport, {
    onSuccess: (response) => {
      console.log({ response });
      toast.success("Question support répondue avec succès");
      queryClient.invalidateQueries(["supports"]);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Échec de la réponse à la question support");
    },
  });
};

interface DownloadAttachmentsVars {
  supportId: string;
  attachmentType: "question" | "answer" | "all";
}

const downloadAllAttachments = async ({
  supportId,
  attachmentType,
}: DownloadAttachmentsVars): Promise<Blob> => {
  const response = await fetchWithAuth(
    `/admin/support/${supportId}/${attachmentType}`,
    { method: "GET" }
  );
  if (!response.ok) {
    throw new Error("Erreur lors du téléchargement");
  }
  return await response.blob();
};

export const useDownloadAllAttachments = () => {
  return useMutation(downloadAllAttachments, {
    onSuccess: (blob, variables) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = url;
      link.download = `support_${variables.supportId}_attachments.zip`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Téléchargement terminé");
    },
    onError: () => {
      toast.error("Erreur lors du téléchargement");
    },
  });
};
