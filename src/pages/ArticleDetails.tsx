import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetArticle,
  useUpdateArticle,
  useDeleteArticle,
  useCreateParagraph,
  useUpdateParagraph,
  useDeleteParagraph,
} from "@/utils/api/blog-api";
import { IBlogArticle, IParagraph } from "@/utils/api/blog-api";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface NewParagraph {
  title: string;
  subtitle?: string;
  content: string;
  image?: {
    id: string;
    fullUrl: string;
    file?: File;
  };
}

const ArticleDetails: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const {
    data: article,
    isLoading,
    error,
    refetch,
  } = useGetArticle(articleId!);

  const [isEditingArticle, setIsEditingArticle] = useState<boolean>(false);
  const [editedArticle, setEditedArticle] = useState<IBlogArticle | null>(null);
  const [articleThumbnailPreview, setArticleThumbnailPreview] = useState<
    string | null
  >(editedArticle?.thumbnail?.fullUrl || null);
  const [newParagraph, setNewParagraph] = useState<NewParagraph>({
    title: "",
    subtitle: "",
    content: "",
  });

  const [editingParagraphId, setEditingParagraphId] = useState<string | null>(
    null
  );
  const [editedParagraph, setEditedParagraph] = useState<IParagraph | null>(
    null
  );

  const updateArticleMutation = useUpdateArticle();
  const deleteArticleMutation = useDeleteArticle();
  const createParagraphMutation = useCreateParagraph();
  const updateParagraphMutation = useUpdateParagraph();
  const deleteParagraphMutation = useDeleteParagraph();

  if (isLoading) return <div>Chargement...</div>;
  if (error || !article)
    return <div>Erreur lors du chargement de l'article.</div>;

  const startEditingArticle = () => {
    setEditedArticle(article);
    setIsEditingArticle(true);
  };

  const cancelEditArticle = () => {
    setIsEditingArticle(false);
    setEditedArticle(null);
  };

  const handleArticleChange = (
    field: keyof IBlogArticle,
    value: string | number | string[]
  ) => {
    if (editedArticle) {
      setEditedArticle({ ...editedArticle, [field]: value });
    }
  };

  const saveArticleChanges = () => {
    if (editedArticle) {
      const formData = new FormData();
      formData.append("title", editedArticle.title);
      formData.append("subtitle", editedArticle.subtitle);
      formData.append("introduction", editedArticle.introduction);
      formData.append("conclusion", editedArticle.conclusion);
      formData.append("tags", JSON.stringify(editedArticle.tags));
      // Append thumbnail file if available
      if (editedArticle.thumbnail && (editedArticle.thumbnail as any).file) {
        formData.append("thumbnail", (editedArticle.thumbnail as any).file);
      }
      updateArticleMutation.mutate(
        { id: editedArticle.id, data: formData },
        {
          onSuccess: () => {
            toast.success("Article mis à jour avec succès");
            setIsEditingArticle(false);
            refetch();
          },
        }
      );
    }
  };

  const handleDeleteArticle = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      deleteArticleMutation.mutate(article.id, {
        onSuccess: () => {
          toast.success("Article supprimé avec succès");
          navigate("/blog"); // Navigate back to blog list after deletion
        },
      });
    }
  };

  // Paragraph operations
  const startEditingParagraph = (para: IParagraph) => {
    setEditingParagraphId(para.id);
    setEditedParagraph(para);
  };

  const cancelEditingParagraph = () => {
    setEditingParagraphId(null);
    setEditedParagraph(null);
  };

  const saveParagraphChanges = () => {
    if (editedParagraph) {
      const formData = new FormData();
      formData.append("title", editedParagraph.title);
      formData.append("content", editedParagraph.content);
      if (editedParagraph.subtitle) {
        formData.append("subtitle", editedParagraph.subtitle);
      }
      // Append the image file if it exists
      if (editedParagraph.image && (editedParagraph.image as any).file) {
        formData.append("image", (editedParagraph.image as any).file);
      }
      updateParagraphMutation.mutate(
        {
          articleId: article.id,
          paragraphId: editedParagraph.id,
          data: formData,
        },
        {
          onSuccess: (response) => {
            const newParagraphsArray = article.paragraphs.filter(
              (para) => para.id !== response.id
            );
            newParagraphsArray.push(response);
            article.paragraphs = newParagraphsArray;
            cancelEditingParagraph();
            refetch();
          },
        }
      );
    }
  };

  const handleDeleteParagraph = (paraId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce paragraphe ?")) {
      deleteParagraphMutation.mutate(
        {
          articleId: article.id,
          paragraphId: paraId,
        },
        {
          onSuccess: () => {
            article.paragraphs = article.paragraphs.filter(
              (para) => para.id !== paraId
            );
          },
        }
      );
    }
  };

  const handleCreateParagraph = () => {
    // Create new paragraph FormData
    if (!newParagraph.title || !newParagraph.content) {
      toast.error("Veuillez renseigner le titre et le contenu");
      return;
    }
    const formData = new FormData();
    formData.append("title", newParagraph.title);
    formData.append("content", newParagraph.content);
    if (newParagraph.subtitle) {
      formData.append("subtitle", newParagraph.subtitle);
    }
    if (newParagraph?.image && (newParagraph.image as any).file) {
      formData.append("image", (newParagraph.image as any).file);
    }

    createParagraphMutation.mutate(
      { articleId: article.id, data: formData },
      {
        onSuccess: (response) => {
          article.paragraphs.push(response);
          setNewParagraph({ title: "", subtitle: "", content: "" });
        },
      }
    );
  };

  const handleParagraphImageInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0 && editedParagraph) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedParagraph((prev) => ({
          ...prev!,
          image: {
            file,
            fullUrl: reader.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArticleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0 && editedArticle) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setArticleThumbnailPreview(reader.result as string);
        // Update the editedArticle with new thumbnail info; preserving id if available, or using a temporary id
        setEditedArticle((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            thumbnail: {
              id: prev.thumbnail?.id || "temp-id",
              fullUrl: reader.result as string,
              // Optionally store the file if needed
              file,
            },
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewParagraphImageInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewParagraph((prev) => ({
          ...prev,
          image: {
            // Using a temporary id or leave it empty until upload returns an id
            id: prev.image?.id || "temp-id",
            fullUrl: reader.result as string,
            // Optionally store the file if needed for submission
            file,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Article Header */}
      <div className="flex space-x-4">
        <button
          onClick={startEditingArticle}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Modifier l'article
        </button>
        <button
          onClick={handleDeleteArticle}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Supprimer l'article
        </button>
      </div>

      {/* Article Details */}
      {isEditingArticle && editedArticle ? (
        <div className="space-y-4">
          <div className="flex flex-row gap-4">
            {/* Left Column: Thumbnail Update */}
            <div className="w-1/3">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Thumbnail de l'article
              </label>
              <div className="relative border rounded overflow-hidden cursor-pointer h-40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArticleThumbnailChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {articleThumbnailPreview ? (
                  <img
                    src={articleThumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-gray-400">
                    <Upload size={32} />
                    <span>Cliquer pour uploader une image</span>
                  </div>
                )}
              </div>
            </div>
            {/* Right Column: Article Text Fields */}
            <div className="w-2/3 flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="font-medium">Titre</label>
                <input
                  type="text"
                  value={editedArticle.title}
                  onChange={(e) => handleArticleChange("title", e.target.value)}
                  className="border rounded p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Sous-titre</label>
                <input
                  type="text"
                  value={editedArticle.subtitle}
                  onChange={(e) =>
                    handleArticleChange("subtitle", e.target.value)
                  }
                  className="border rounded p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Mots clés</label>
                <input
                  type="text"
                  value={editedArticle.tags.join(", ")}
                  onChange={(e) =>
                    handleArticleChange(
                      "tags",
                      e.target.value.split(",")?.map((t) => t.trim())
                    )
                  }
                  className="border rounded p-2"
                  placeholder="Séparez les tags par des virgules"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Introduction</label>
                <textarea
                  value={editedArticle.introduction}
                  onChange={(e) =>
                    handleArticleChange("introduction", e.target.value)
                  }
                  className="border rounded p-2"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-medium">Conclusion</label>
                <textarea
                  value={editedArticle.conclusion}
                  onChange={(e) =>
                    handleArticleChange("conclusion", e.target.value)
                  }
                  className="border rounded p-2"
                />
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={cancelEditArticle}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              onClick={saveArticleChanges}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      ) : (
        // Non-edit view...
        <div className="space-y-2 flex flex-row gap-10">
          {article.thumbnail && (
            <img
              src={article.thumbnail.fullUrl}
              alt={article.title}
              className="w-1/2 flex-1 h-full object-cover rounded my-4"
            />
          )}
          <div className="flex-1 flex flex-col gap-3">
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <p className="text-lg text-gray-700">{article.subtitle}</p>
            <div className="text-sm text-gray-500">
              Par{" "}
              <span className="font-bold">
                {article.author
                  ? `${article.author.firstName} ${article.author.lastName}`
                  : "Inconnu"}
              </span>{" "}
              le{" "}
              <span className="font-semibold">
                {new Date(article.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="flex space-x-2">
              {article.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-200 rounded-full text-sm text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-lg text-gray-700">{article.introduction}</p>
            <p className="text-lg text-gray-700">{article.conclusion}</p>
          </div>
        </div>
      )}

      {/* Article Paragraphs */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Paragraphes</h2>
        {article.paragraphs?.map((para) => (
          <div key={para.id} className="bg-white rounded shadow p-4 mb-4">
            {editingParagraphId === para.id && editedParagraph ? (
              // EDIT MODE: Two-column layout with image input on left and text fields on right
              <div className="space-y-4">
                <div className="flex flex-row gap-4">
                  {/* Left Column: Image Input */}
                  <div className=" w-[300px]">
                    <div className="relative border rounded overflow-hidden cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleParagraphImageInputChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {editedParagraph?.image?.fullUrl ? (
                        <img
                          src={editedParagraph.image.fullUrl}
                          alt="Paragraph Image Preview"
                          className=" h-full object-cover  w-[300px]"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full   w-[300px] p-4 text-gray-400">
                          <Upload size={32} />
                          <span>Cliquer pour uploader une image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Right Column: Editable Text Fields */}
                  <div className="w-2/3 flex flex-col gap-2">
                    <input
                      type="text"
                      value={editedParagraph.title}
                      onChange={(e) =>
                        setEditedParagraph({
                          ...editedParagraph,
                          title: e.target.value,
                        })
                      }
                      className="border rounded p-2 w-full"
                      placeholder="Titre du paragraphe"
                    />
                    <input
                      type="text"
                      value={editedParagraph.subtitle || ""}
                      onChange={(e) =>
                        setEditedParagraph({
                          ...editedParagraph,
                          subtitle: e.target.value,
                        })
                      }
                      className="border rounded p-2 w-full"
                      placeholder="Sous-titre (optionnel)"
                    />
                    <textarea
                      value={editedParagraph.content}
                      onChange={(e) =>
                        setEditedParagraph({
                          ...editedParagraph,
                          content: e.target.value,
                        })
                      }
                      className="border rounded p-2 h-full w-full"
                      placeholder="Contenu"
                    />
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={cancelEditingParagraph}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={saveParagraphChanges}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            ) : (
              // VIEW MODE: Similar layout to before
              <div className="flex flex-row gap-5">
                {para.image && (
                  <img
                    src={para.image.fullUrl}
                    alt={para.title}
                    className=" w-[300px] object-cover rounded my-2"
                  />
                )}
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="text-xl font-bold">{para.title}</h3>
                  {para.subtitle && (
                    <h4 className="text-lg text-gray-600">{para.subtitle}</h4>
                  )}
                  <p className="text-gray-700 my-2">{para.content}</p>
                  <div className="flex mt-auto space-x-2">
                    <button
                      onClick={() => startEditingParagraph(para)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteParagraph(para.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form to Create a New Paragraph */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-2xl font-bold mb-4">
          Ajouter un nouveau paragraphe
        </h2>
        <div className="space-y-4">
          <div className="flex flex-row gap-4">
            {/* Left Column: Image Input */}
            <div className=" w-[300px]">
              <div className="relative border rounded overflow-hidden cursor-pointer h-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewParagraphImageInputChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-[300px]"
                />
                {newParagraph.image ? (
                  <img
                    src={newParagraph.image.fullUrl}
                    alt="Preview"
                    className="h-full object-cover w-[300px]"
                  />
                ) : (
                  <div className="flex flex-col w-[300px] items-center justify-center h-full p-4 text-gray-400">
                    <Upload size={32} />
                    <span>Cliquer pour uploader une image</span>
                  </div>
                )}
              </div>
            </div>
            {/* Right Column: Text Fields */}
            <div className="w-2/3 flex flex-col gap-2">
              <input
                type="text"
                value={newParagraph.title}
                onChange={(e) =>
                  setNewParagraph({ ...newParagraph, title: e.target.value })
                }
                className="border rounded p-2 w-full"
                placeholder="Titre du paragraphe"
              />
              <input
                type="text"
                value={newParagraph.subtitle}
                onChange={(e) =>
                  setNewParagraph({ ...newParagraph, subtitle: e.target.value })
                }
                className="border rounded p-2 w-full"
                placeholder="Sous-titre (optionnel)"
              />
              <textarea
                value={newParagraph.content}
                onChange={(e) =>
                  setNewParagraph({ ...newParagraph, content: e.target.value })
                }
                className="border rounded p-2 h-fit w-full"
                placeholder="Contenu du paragraphe"
              />
            </div>
          </div>
          {/* Add Button */}
          <div className="flex justify-end">
            <button
              onClick={handleCreateParagraph}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
