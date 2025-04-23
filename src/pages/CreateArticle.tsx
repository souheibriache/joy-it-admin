import { useCreateArticle } from "@/utils/api/blog-api";
import { Upload } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FormState {
  title: string;
  subtitle: string;
  tags: string;
  introduction: "";
  conclusion: "";
}

interface ParagraphState {
  title: string;
  subtitle?: string;
  content: string;
  imageFile?: File; // optional file for the paragraph image
}

const CreateArticle: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createArticle, isLoading } = useCreateArticle();

  const [formState, setFormState] = useState<FormState>({
    title: "",
    subtitle: "",
    tags: "",
    introduction: "",
    conclusion: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Paragraphs state: an array of paragraphs
  const [paragraphs, setParagraphs] = useState<ParagraphState[]>([
    {
      title: "",
      subtitle: "",
      content: "",
    },
  ]);
  // For new paragraph form inputs
  const [newParagraph, setNewParagraph] = useState<ParagraphState>({
    title: "",
    subtitle: "",
    content: "",
  });

  // Handle changes for article fields
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Handle thumbnail file selection with preview
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Add a new paragraph to the list
  const addParagraph = () => {
    setParagraphs([...paragraphs, newParagraph]);
    setNewParagraph({ title: "", subtitle: "", content: "" });
  };

  // Handle changes for the new paragraph form
  const handleNewParagraphChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewParagraph({ ...newParagraph, [e.target.name]: e.target.value });
  };

  // Handle file selection for a paragraph image (by paragraph index)
  const handleParagraphImageChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updatedParagraphs = paragraphs.map((para, i) =>
        i === index ? { ...para, imageFile: file } : para
      );
      setParagraphs(updatedParagraphs);
    }
  };

  // Build FormData and submit the article creation request
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("subtitle", formState.subtitle);
    formData.append("introduction", formState.introduction);
    formData.append("conclusion", formState.conclusion);
    // Convert comma-separated tags into an array and then JSON string
    const tagsArray = formState.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    formData.append("tags", JSON.stringify(tagsArray));
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    // Process paragraphs:
    // Build an array for paragraph data and a separate array for paragraph image files.
    const paragraphImageFiles: File[] = [];
    const paragraphsData = paragraphs.map((para) => {
      // If an image file exists for this paragraph, record its index (based on paragraphImageFiles array)
      let imageIndex: number | undefined = undefined;
      if (para.imageFile) {
        paragraphImageFiles.push(para.imageFile);
        imageIndex = paragraphImageFiles.length - 1;
      }
      return {
        title: para.title,
        subtitle: para.subtitle,
        content: para.content,
        ...(imageIndex !== undefined && { imageIndex }),
      };
    });

    // Append paragraphs data as JSON string
    formData.append("paragraphs", JSON.stringify(paragraphsData));

    // Append paragraph image files (if any) in the correct order
    paragraphImageFiles.forEach((file) => {
      formData.append("paragraphImages", file);
    });

    // Call the createArticle mutation
    createArticle(formData, {
      onSuccess: (data) => {
        toast.success("Article créé avec succès");
        navigate(`/blog/${data.id}`);
      },
      onError: () => {
        toast.error("Échec de la création de l'article");
      },
    });
  };

  return (
    <div className="mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Créer un nouvel article</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Article Fields */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Titre</label>
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Sous-titre
          </label>
          <input
            type="text"
            name="subtitle"
            value={formState.subtitle}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Introduction
          </label>
          <textarea
            name="introduction"
            value={formState.introduction}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Conclusion
          </label>
          <textarea
            name="conclusion"
            value={formState.conclusion}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={formState.tags}
            onChange={handleChange}
            placeholder="Séparez les tags par une virgule"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        {/* Thumbnail Upload with Preview */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Thumbnail
          </label>
          <div className="relative w-full min-h-[500px] border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className=" inset-0 w-full h-full object-cover rounded"
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <Upload size={32} />
                <span>Cliquer pour uploader une image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Paragraphs Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Paragraphes</h2>
          {paragraphs.length > 0 &&
            paragraphs.map((para, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded space-y-2"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Titre du paragraphe
                  </label>
                  <input
                    type="text"
                    value={para.title}
                    onChange={(e) => {
                      const updated = [...paragraphs];
                      updated[index].title = e.target.value;
                      setParagraphs(updated);
                    }}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Sous-titre (optionnel)
                  </label>
                  <input
                    type="text"
                    value={para.subtitle || ""}
                    onChange={(e) => {
                      const updated = [...paragraphs];
                      updated[index].subtitle = e.target.value;
                      setParagraphs(updated);
                    }}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Contenu
                  </label>
                  <textarea
                    value={para.content}
                    onChange={(e) => {
                      const updated = [...paragraphs];
                      updated[index].content = e.target.value;
                      setParagraphs(updated);
                    }}
                    className="w-full border h-full border-gray-300 rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Image du paragraphe (optionnel)
                  </label>
                  <div className="relative border rounded overflow-hidden cursor-pointer w-[300px] h-auto">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleParagraphImageChange(index, e)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {para.imageFile ? (
                      <img
                        src={URL.createObjectURL(para.imageFile)}
                        alt="Aperçu"
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
              </div>
            ))}
          <button
            type="button"
            onClick={addParagraph}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Ajouter un paragraphe
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isLoading ? "Création..." : "Enregistrer l'article"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
