import { LuX } from "react-icons/lu";

interface FileDetailsProps {
  preview: string;
  fileName: string;
  fileSize: number;
  onRemove: () => void;
}
export default function FileDetails({
  preview,
  fileName,
  fileSize,
  onRemove,
}: FileDetailsProps) {
  const fileSizeKB = (fileSize / 1024).toFixed(2);
  return (
    <div className="flex items-center justify-between p-2 border border-gray-300 rounded-md">
      <div className="flex items-center space-x-4">
        <img
          src={preview}
          alt="preview"
          className="w-12 h-12 rounded-sm object-cover"
        />
        <div>
          <p className="font-light text-gray-800">{fileName}</p>
          <p className="text-sm font-light text-gray-500">{fileSizeKB} KB</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onRemove}
          className="p-2 border border-gray-300 rounded-full hover:bg-red-500 hover:text-white transition cursor-pointer"
        >
          <LuX size={20} />
        </button>
      </div>
    </div>
  );
}
