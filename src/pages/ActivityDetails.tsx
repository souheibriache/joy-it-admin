import React, { useEffect, useState } from "react";
import PageTitle from "@/components/PageTitle";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetActivityById,
  useUpdateActivity,
  useCreateActivity,
  useUpdateActivityImages,
  useDeleteActivityImage,
  useDeleteActivity,
} from "@/utils/api/activities-api";
import { Button } from "@/components/ui/button";
import { ActivityType } from "@/types/activity";
import { ArrowLeft, Send, Trash } from "lucide-react";
import { Switch } from "@headlessui/react";

const placeholderImageUrl =
  "https://res.cloudinary.com/dd0w9jo3q/image/upload/v1737834372/istockphoto-1147544807-612x612_arnkqz.jpg";

const ActivityDetails: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const isCreating = activityId === "new-activity"; // Check if in create mode

  const { activity, isLoading: isFetching } = useGetActivityById(
    isCreating ? "" : activityId || ""
  );
  const { mutate: updateActivity, isLoading: isUpdating } = useUpdateActivity();
  const { mutate: deleteActivity, isLoading: isActivityDeleting } =
    useDeleteActivity();
  const { mutate: updateImages, isLoading: isUploading } =
    useUpdateActivityImages();
  const { mutate: createActivity, isLoading: isCreatingActivity } =
    useCreateActivity();
  const { mutate: deleteImage, isLoading: isDeleting } =
    useDeleteActivityImage();

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    address: "",
    city: "",
    postalCode: "",
    locationUrl: "",
    duration: 0,
    participants: 0,
    isInsideCompany: false,
    creditCost: 0,
    types: [],
    keyWords: [],
    images: [],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  const [keyWordInput, setKeyWordInput] = useState<string>("");

  useEffect(() => {
    if (!isCreating && activity) {
      setFormData(activity);
      const mainImageIdx =
        activity.images?.findIndex((img: any) => img.isMain) || 0;
      setMainImageIndex(mainImageIdx);
    }
  }, [activity, isCreating]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleKeyWordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyWordInput.trim()) {
      e.preventDefault(); // Prevent form submission
      setFormData((prev: any) => ({
        ...prev,
        keyWords: [...(prev.keyWords || []), keyWordInput.trim()],
      }));
      setKeyWordInput(""); // Clear the input field
    }
  };

  const handleKeyWordRemove = (keyWord: string, e: any) => {
    e.preventDefault();
    setFormData((prev: any) => ({
      ...prev,
      keyWords: (prev.keyWords || []).filter((kw: string) => kw !== keyWord),
    }));
  };

  const handleCheckboxChange = (type: ActivityType) => {
    setFormData((prev: any) => {
      const updatedTypes = prev.types.includes(type)
        ? prev.types.filter((t: ActivityType) => t !== type)
        : [...prev.types, type];
      return { ...prev, types: updatedTypes };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + (formData.images?.length || 0) > 5) {
        alert("Vous pouvez télécharger jusqu'à 5 images.");
      } else {
        const newImages = files.map((file, index) => ({
          id: `temp-${Date.now()}-${index}`, // Temporary ID
          fullUrl: URL.createObjectURL(file),
          isMain: formData.images?.length === 0 && index === 0, // Set first image as main if no images exist
          file, // Attach the file for saving later
        }));

        setFormData((prev: any) => ({
          ...prev,
          images: [...(prev.images || []), ...newImages],
        }));

        setSelectedFiles((prev) => [...prev, ...files]);
      }
    }
  };

  const handleDeleteImage = (imageId: string) => {
    if (!activityId) return;
    deleteImage({ activityId, imageId });
  };

  const handleSetMainImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      images: prev.images.map((img: any, idx: number) => ({
        ...img,
        isMain: idx === index,
      })),
    }));
    setMainImageIndex(index);
  };

  const handleToggleInsideCompany = (value: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      isInsideCompany: value,
      address: value ? null : prev.address,
      city: value ? null : prev.city,
      postalCode: value ? null : prev.postalCode,
    }));
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    const uploadFormData: any = new FormData();

    // Add form fields
    uploadFormData.append("name", formData.name);
    uploadFormData.append("description", formData.description);
    uploadFormData.append("address", formData.address || "");
    uploadFormData.append("city", formData.city || "");
    uploadFormData.append("postalCode", formData.postalCode || "");
    uploadFormData.append("locationUrl", formData.locationUrl || "");
    uploadFormData.append("duration", formData.duration || "0");
    uploadFormData.append("participants", formData.participants || "0");
    uploadFormData.append("isInsideCompany", formData.isInsideCompany);
    uploadFormData.append("creditCost", formData.creditCost.toString());

    // Add types as array values
    formData.types.forEach((type: string) => {
      uploadFormData.append("types[]", type);
    });

    formData.keyWords.forEach((word: string, index: number) => {
      uploadFormData.append(`keyWords[${index}]`, word);
    });

    // Add images
    selectedFiles.forEach((file) => uploadFormData.append("images", file));

    // Add main image index
    const mainImageIdx = (formData.images || []).findIndex(
      (img: any) => img.isMain
    );
    uploadFormData.append(
      "mainImageIndex",
      String(mainImageIdx >= 0 ? mainImageIdx : 0)
    );

    if (isCreating) {
      createActivity(uploadFormData, {
        onSuccess: (data: any) => {
          const newActivityId = data.id;
          navigate(`/activities/${newActivityId}`);
        },
      });
    } else {
      updateActivity({ activityId: activityId!, data: uploadFormData });
    }
  };

  const handleSaveImages = () => {
    if (!activityId) return;

    const uploadFormData = new FormData();

    const retainedImageIds = (formData.images || [])
      .filter((img: any) => !img.file) // Exclude newly uploaded images
      .map((img: any) => img.id);

    retainedImageIds.forEach((id: string, index: number) => {
      uploadFormData.append(`retainedImageIds[${index}]`, id);
    });

    selectedFiles.forEach((file) => uploadFormData.append("images", file));

    const mainImageIdx = (formData.images || []).findIndex(
      (img: any) => img.isMain
    );
    uploadFormData.append(
      "mainImageIndex",
      String(mainImageIdx >= 0 ? mainImageIdx : 0)
    );

    updateImages({ activityId, data: uploadFormData });
  };

  const handleCancel = () => {
    navigate("/activities");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this activity?")) {
      deleteActivity(activityId!, {
        onSuccess: () => navigate("/activities"),
      });
    }
  };

  if (isFetching) return <div>Chargement des détails de l'activité...</div>;

  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title={isCreating ? "Nouvelle Activité" : "Activités"}
        breadCump={[isCreating ? "Nouvelle Activité" : formData.name]}
      />

      {/* Back Button */}
      <Button
        onClick={() => navigate("/activities")}
        className=" bg-gray-500 text-white w-28 px-4 py-2 rounded-md hover:bg-gray-600 flex flex-row items-center"
      >
        <ArrowLeft />
        <p> Retour</p>
      </Button>

      <div className="flex gap-8">
        {/* Fields Section */}
        <div className="flex-1 bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-4">
            {isCreating ? "Créer une Activité" : "Détails de l'activité"}
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isInsideCompany}
                onChange={handleToggleInsideCompany}
                className={`${
                  formData.isInsideCompany ? "bg-purple" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span
                  className={`${
                    formData.isInsideCompany ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
              <label className="block text-sm font-medium text-gray-700">
                Activité en interne
              </label>
            </div>

            {!formData.isInsideCompany && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Localisation
                  </label>
                  <div className="flex flex-row items-center gap-2">
                    <input
                      type="text"
                      name="locationUrl"
                      value={formData.locationUrl || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <a
                      href={
                        formData.locationUrl || "https://www.google.fr/maps"
                      }
                      target="_blank"
                    >
                      <Send className="text-blue-500" />
                    </a>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre de participants
              </label>
              <input
                type="number"
                name="participants"
                value={formData.participants || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coût de crédit
              </label>
              <input
                type="number"
                name="creditCost"
                value={formData.creditCost || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Durée (Heurs)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Types d'activité
              </label>
              <div className="flex flex-wrap gap-4 mt-2">
                {Object.values(ActivityType).map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.types?.includes(type) || false}
                      onChange={() => handleCheckboxChange(type)}
                      className="mr-2 accent-purple"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label>Mots-clés</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData?.keyWords?.map((keyWord: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-500 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {keyWord}
                    <button
                      onClick={(e) => handleKeyWordRemove(keyWord, e)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={keyWordInput}
                onChange={(e) => setKeyWordInput(e.target.value)}
                onKeyDown={handleKeyWordAdd}
                placeholder="Ajouter un mot-clé"
                className="mt-2 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              {/* Save Button */}
              <Button
                onClick={handleSave}
                disabled={isUpdating || isCreatingActivity}
                className="bg-purple text-white px-4 py-2 rounded-md hover:bg-secondarypurple"
              >
                {isCreatingActivity
                  ? "Création..."
                  : isUpdating
                  ? "Enregistrement..."
                  : isCreating
                  ? "Créer"
                  : "Sauvegarder"}
              </Button>

              {/* Delete Button (only when updating) */}
              {!isCreating && (
                <Button
                  onClick={handleDelete}
                  disabled={isActivityDeleting}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  {isActivityDeleting ? "Suppression..." : "Supprimer"}
                </Button>
              )}

              {/* Cancel Button */}
              <Button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>

        {/* Images Section */}
        <div className="flex-1 bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-4">Images de l'activité</h2>
          <div>
            <img
              src={
                formData.images && formData.images.length > 0
                  ? formData.images.find((img: any) => img.isMain)?.fullUrl ||
                    formData.images[0]?.fullUrl
                  : placeholderImageUrl
              }
              alt="Image principale"
              className="w-full h-96 object-cover rounded-md mb-4"
            />
            <div className="flex gap-4 items-center">
              {formData.images &&
                formData?.images?.map((image: any, index: number) => (
                  <div
                    key={image.id}
                    className="relative w-24 h-24 border border-gray-300 rounded-md overflow-hidden group"
                  >
                    <img
                      src={image.fullUrl}
                      alt="Activité"
                      className="w-full h-full object-cover"
                    />
                    {!isCreating && (
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        disabled={isDeleting}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                      >
                        {isDeleting ? "..." : <Trash className="p-0.5" />}
                      </button>
                    )}
                    <button
                      onClick={() => handleSetMainImage(index)}
                      className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                    >
                      {index === mainImageIndex ? "Principale" : "Définir"}
                    </button>
                  </div>
                ))}
              <label className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="text-gray-400 text-xl">+</span>
              </label>
            </div>
          </div>
          {!isCreating && (
            <Button
              onClick={handleSaveImages}
              disabled={isUploading}
              className="bg-green-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-green-700"
            >
              {isUploading ? "Enregistrement..." : "Sauvegarder les images"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
