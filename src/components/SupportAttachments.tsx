import { IMedia } from "@/utils/api/support-api";
import AttachmentThumbnail from "./AttachmentTumbnail";

declare type Props = {
  attachments: IMedia[];
  handleDownloadAttachment: (fullUrl: string, fileName: string) => void;
  handleDownloadAllAttachments: (
    attachmentType: "question" | "answer" | "all"
  ) => void;
  isDeleting?: boolean;
};

const SupportAttachments = ({
  attachments,
  handleDownloadAttachment,
  handleDownloadAllAttachments,
  isDeleting = false,
}: Props) => {
  return (
    <>
      <div className="flex flex-wrap gap-4">
        {attachments.map((att: IMedia) => (
          <div
            key={att.id}
            className="relative w-24 h-24 border border-gray-300 rounded-md overflow-hidden group"
          >
            <AttachmentThumbnail att={att} />
            <button
              onClick={() => handleDownloadAttachment(att.fullUrl, att.name)}
              disabled={isDeleting}
              className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isDeleting ? "..." : "Télécharger"}
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => handleDownloadAllAttachments("answer")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Télécharger tout
        </button>
      </div>
    </>
  );
};

export default SupportAttachments;
