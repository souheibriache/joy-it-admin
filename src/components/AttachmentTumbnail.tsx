import { File, FileText } from "lucide-react";

const AttachmentThumbnail = ({ att }: { att: any }) => {
  if (att.resourceType && att.resourceType.startsWith("image/")) {
    return (
      <img
        src={att.fullUrl}
        alt={att.name}
        className="w-full h-full object-cover"
      />
    );
  } else if (att.resourceType === "application/pdf") {
    return (
      <div className="flex items-center justify-center w-full h-full bg-red-100">
        <FileText className="w-8 h-8 text-red-600" />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100">
        <File className="w-8 h-8 text-gray-600" />
      </div>
    );
  }
};

export default AttachmentThumbnail;
