import { toast } from "sonner";
import fetchWithAuth from "../fetchWrapper";
import { useQuery, useMutation, useQueryClient } from "react-query";

export interface IBlogArticle {
  id: string;
  title: string;
  subtitle: string;
  introduction: string;
  conclusion: string;
  tags: string[];
  author: {
    firstName: string;
    lastName: string;
    id: string;
  };
  thumbnail: {
    id: string;
    fullUrl: string;
    // …other fields…
  } | null;
  paragraphs: IParagraph[];
  createdAt: string;
  updatedAt: string;
}
export interface IParagraph {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image: IParagraphImage | null;
  createdAt: string;
  updatedAt: string;
}

export interface IParagraphImage {
  id: string;
  fullUrl: string;
  file?: File;
}
export const useGetArticles = () => {
  const fetchArticles = async (): Promise<IBlogArticle[]> => {
    const response = await fetchWithAuth("/articles", { method: "GET" });
    return response.data;
  };

  return useQuery<IBlogArticle[]>("articles", fetchArticles, {
    onError: () => toast.error("Failed to fetch articles"),
  });
};

// Get a single article by ID
export const useGetArticle = (id: string) => {
  const fetchArticle = async (): Promise<IBlogArticle> => {
    return await fetchWithAuth(`/articles/${id}`, { method: "GET" });
  };

  return useQuery<IBlogArticle>(["article", id], fetchArticle, {
    onError: () => toast.error("Failed to fetch the article"),
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  const createArticle = async (data: FormData): Promise<IBlogArticle> => {
    return await fetchWithAuth("/articles", {
      method: "POST",
      body: data,
    });
  };

  return useMutation<IBlogArticle, unknown, FormData>(
    (data: FormData) => createArticle(data),
    {
      onSuccess: (): void => {
        toast.success("Article created successfully");
        queryClient.invalidateQueries("articles");
      },
      onError: (): void => {
        toast.error("Failed to create article");
      },
    }
  );
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  const updateArticle = async ({
    id,
    data,
  }: {
    id: string;
    data: FormData;
  }): Promise<IBlogArticle> => {
    return await fetchWithAuth(`/articles/${id}`, {
      method: "PUT",
      body: data,
    });
  };

  return useMutation<IBlogArticle, unknown, { id: string; data: FormData }>(
    (variables) => updateArticle(variables),
    {
      onSuccess: (): void => {
        toast.success("Paragraphe mis à jour avec succès");
        queryClient.invalidateQueries("articles");
      },
      onError: (): void => {
        toast.error("Failed to update article");
      },
    }
  );
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  const deleteArticle = async (id: string): Promise<{ message: string }> => {
    return await fetchWithAuth(`/articles/${id}`, {
      method: "DELETE",
    });
  };

  return useMutation<{ message: string }, unknown, string>(deleteArticle, {
    onSuccess: (): void => {
      toast.success("Article deleted successfully");
      queryClient.invalidateQueries("articles");
    },
    onError: (): void => {
      toast.error("Failed to delete article");
    },
  });
};

export const useCreateParagraph = () => {
  const queryClient = useQueryClient();

  const createParagraph = async ({
    articleId,
    data,
  }: {
    articleId: string;
    data: FormData;
  }): Promise<IParagraph> => {
    return await fetchWithAuth(`/articles/${articleId}/paragraphs`, {
      method: "POST",
      body: data,
    });
  };

  return useMutation<
    IParagraph,
    unknown,
    { articleId: string; data: FormData }
  >((variables) => createParagraph(variables), {
    onSuccess: (): void => {
      toast.success("Nouveau paragraphe créé avec succés");
      queryClient.invalidateQueries("articles");
    },
    onError: (): void => {
      toast.error("Failed to create paragraph");
    },
  });
};

export const useUpdateParagraph = () => {
  const queryClient = useQueryClient();

  const updateParagraph = async ({
    articleId,
    paragraphId,
    data,
  }: {
    articleId: string;
    paragraphId: string;
    data: FormData;
  }): Promise<IParagraph> => {
    return await fetchWithAuth(
      `/articles/${articleId}/paragraphs/${paragraphId}`,
      {
        method: "PUT",
        body: data,
      }
    );
  };

  return useMutation<
    IParagraph,
    unknown,
    { articleId: string; paragraphId: string; data: FormData }
  >((variables) => updateParagraph(variables), {
    onSuccess: (): void => {
      toast.success("Paragraphe mis à jour avec succès");
      queryClient.invalidateQueries("articles");
    },
    onError: (): void => {
      toast.error("Failed to update paragraph");
    },
  });
};

export const useDeleteParagraph = () => {
  const queryClient = useQueryClient();

  const deleteParagraph = async ({
    articleId,
    paragraphId,
  }: {
    articleId: string;
    paragraphId: string;
  }): Promise<{ message: string }> => {
    return await fetchWithAuth(
      `/articles/${articleId}/paragraphs/${paragraphId}`,
      {
        method: "DELETE",
      }
    );
  };

  return useMutation<
    { message: string },
    unknown,
    { articleId: string; paragraphId: string }
  >((variables) => deleteParagraph(variables), {
    onSuccess: (): void => {
      toast.success("Paragraph deleted successfully");
      queryClient.invalidateQueries("articles");
    },
    onError: (): void => {
      toast.error("Failed to delete paragraph");
    },
  });
};
