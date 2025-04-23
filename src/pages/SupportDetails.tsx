import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetSupportById,
  useAnswerSupportQuestion,
  IMedia,
  useDownloadAllAttachments,
} from "@/utils/api/support-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Loader } from "lucide-react";
import SupportAttachments from "@/components/SupportAttachments";

const SupportDetails: React.FC = () => {
  const { supportId } = useParams<{ supportId: string }>();
  const {
    data: support,
    isLoading,
    error,
    refetch,
  } = useGetSupportById(supportId!);
  const { mutate: answerMutation, isLoading: answerIsLoading } =
    useAnswerSupportQuestion();

  // State for admin reply (if not answered)
  const [adminAnswer, setAdminAnswer] = useState<string>("");
  const [replyAttachments, setReplyAttachments] = useState<File[]>([]);
  const [replyAttachmentsPreview, setReplyAttachmentsPreview] = useState<
    string[]
  >([]);

  const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (replyAttachments.length + files.length > 10) {
        toast.error("Maximum 10 fichiers autorisés");
        return;
      }
      const updatedAttachments = [...replyAttachments, ...files];
      setReplyAttachments(updatedAttachments);

      const newPreviews = files.map((file) =>
        file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
      );
      setReplyAttachmentsPreview((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleDeleteAttachment = (index: number) => {
    const newAttachments = [...replyAttachments];
    newAttachments.splice(index, 1);
    setReplyAttachments(newAttachments);

    const newPreviews = [...replyAttachmentsPreview];
    newPreviews.splice(index, 1);
    setReplyAttachmentsPreview(newPreviews);
  };

  const handleDownloadAttachment = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = fileName;
    link.click();
  };

  const { mutate: downloadAttachments } = useDownloadAllAttachments();
  const handleDownloadAllAttachments = (
    attachmentType: "question" | "answer" | "all"
  ) => {
    toast.info("Téléchargement de tous les fichiers...");
    downloadAttachments({
      supportId: supportId!,
      attachmentType: attachmentType,
    });
  };
  const handleSubmitAnswer = () => {
    if (!adminAnswer) {
      toast.error("Veuillez entrer une réponse.");
      return;
    }
    const formData = new FormData();
    formData.append("adminAnswer", adminAnswer);
    replyAttachments.forEach((file) => {
      formData.append("attachments", file);
    });
    answerMutation(
      { supportId: supportId!, data: formData },
      {
        onSuccess: () => {
          setAdminAnswer("");
          setReplyAttachments([]);
          setReplyAttachmentsPreview([]);
          refetch();
        },
      }
    );
  };
  if (isLoading) return <div>Chargement des détails du support...</div>;
  if (error || !support)
    return <div>Erreur lors du chargement des détails du support.</div>;

  // Determine sender information
  const senderName = support.askedBy
    ? `${support.askedBy.firstName} ${support.askedBy.lastName}`
    : `${support.firstName} ${support.lastName}`;
  const senderEmail =
    support.askedBy && support.askedBy.email
      ? support.askedBy.email
      : support.email;
  const senderCompanyName =
    support.askedBy && support.askedBy.company
      ? support.askedBy.company.name
      : null;
  const senderCompanyLogo =
    support.askedBy && support.askedBy.company
      ? support.askedBy.company.logo?.fullUrl
      : null;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Détails du support</h1>

      {/* Support Question Details */}
      <div className="bg-white p-4 rounded-md shadow-md space-y-4">
        <h2 className="text-2xl font-bold">Question</h2>
        <div>
          <strong>Sujet :</strong>{" "}
          <span>
            {support.subject.length > 20
              ? support.subject.slice(0, 20) + "..."
              : support.subject}
          </span>
        </div>
        <div>
          <strong>Catégorie :</strong> <span>{support.category}</span>
        </div>
        <div>
          <strong>Question :</strong>
          <p className="mt-1">{support.question}</p>
        </div>
        <div>
          <strong>Répondu :</strong>{" "}
          {support.answeredAt ? (
            <span className="px-2 py-1 rounded bg-green-500 text-white text-sm">
              OUI
            </span>
          ) : (
            <span className="px-2 py-1 rounded bg-red-500 text-white text-sm">
              NON
            </span>
          )}
        </div>
        <div>
          <strong>Vu le :</strong>{" "}
          <span>
            {support.seenAt
              ? new Date(support.seenAt).toLocaleDateString("fr-FR")
              : "Non vu"}
          </span>
        </div>
        <div>
          <strong>Pièces jointes :</strong>{" "}
          {support.questionAttachments &&
          support.questionAttachments.length > 0 ? (
            <div className="flex  flex-row flex-wrap gap-4 mt-2">
              {support.questionAttachments.map((att: IMedia) => (
                <div
                  key={att.id}
                  className="relative w-24 h-24 border border-gray-300 rounded-md overflow-hidden group"
                >
                  {att.resourceType.toLowerCase().startsWith("image") ? (
                    <img
                      src={att.fullUrl}
                      alt={att.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <FileText size={24} className="text-gray-500" />
                    </div>
                  )}
                  <button
                    onClick={() =>
                      handleDownloadAttachment(att.fullUrl, att.name)
                    }
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 text-white opacity-0 group-hover:opacity-100 transition duration-200"
                  >
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <span>Aucune pièce jointe</span>
          )}
        </div>
      </div>

      {/* Sender Information */}
      <div className="bg-white p-4 rounded-md shadow-md space-y-4">
        <h2 className="text-2xl font-bold">Informations de l'expéditeur</h2>
        <div>
          <strong>Nom :</strong> <span>{senderName}</span>
        </div>
        <div>
          <strong>Email :</strong> <span>{senderEmail}</span>
        </div>
        {senderCompanyName && (
          <div className="flex items-center space-x-3">
            {senderCompanyLogo && (
              <img
                src={senderCompanyLogo}
                alt={senderCompanyName}
                className="w-10 h-10 object-cover rounded"
              />
            )}
            <span>
              <strong>Entreprise :</strong> {senderCompanyName}
            </span>
          </div>
        )}
      </div>

      {/* Admin Answer Section */}
      {support.answeredAt ? (
        <div className="bg-white p-4 rounded-md shadow-md space-y-4">
          <h2 className="text-2xl font-bold">Réponse de Joy-it</h2>
          <p>{support.adminAnswer}</p>
          {support.attachments && support.attachments.length > 0 && (
            <div className="flex flex-col gap-3">
              <strong>Pièces jointes de la réponse :</strong>

              {/* {support.attachments.map((att: IMedia) => (
                  <li key={att.id}>
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() =>
                        handleDownloadAttachment(att.fullUrl, att.name)
                      }
                    >
                      {att.name}
                    </button>
                  </li>
                ))} */}

              <SupportAttachments
                attachments={support.attachments}
                handleDownloadAttachment={handleDownloadAttachment}
                handleDownloadAllAttachments={handleDownloadAllAttachments}
              />
            </div>
          )}
        </div>
      ) : (
        // Admin Reply Form (if not yet answered)
        <div className="bg-white p-4 rounded-md shadow-md space-y-4">
          <h2 className="text-2xl font-bold">Répondre à ce support</h2>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Votre réponse
            </label>
            <textarea
              value={adminAnswer}
              onChange={(e) => setAdminAnswer(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              rows={5}
              placeholder="Tapez votre réponse ici..."
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Pièces jointes (optionnel)
            </label>
            <div className="flex gap-4 items-center flex-wrap">
              {replyAttachmentsPreview.map((preview, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 border border-gray-300 rounded-md overflow-hidden group"
                >
                  {replyAttachments[index].type.startsWith("image/") ? (
                    <img
                      src={preview}
                      alt={`Pièce jointe ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <FileText size={24} className="text-gray-500" />
                    </div>
                  )}
                  <button
                    onClick={() => handleDeleteAttachment(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    X
                  </button>
                </div>
              ))}
              {/* Only show the upload button if we have less than 10 attachments */}
              {replyAttachments.length < 10 && (
                <label className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-md cursor-pointer">
                  <input
                    type="file"
                    accept="*/*"
                    multiple
                    onChange={handleAttachmentsChange}
                    className="hidden"
                  />
                  <span className="text-gray-400 text-xl">+</span>
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmitAnswer}
              className="bg-blue-600 text-white px-4 py-2 rounded w-[200px]"
            >
              {answerIsLoading ? (
                <Loader className="animate-spin" />
              ) : (
                "Envoyer la réponse"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportDetails;
