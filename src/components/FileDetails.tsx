import { LuDownload, LuPencil, LuX } from "react-icons/lu";

interface FileDetailsProps {
  preview: string;
  fileName: string;
  fileSize: number;
}
export default function FileDetails({
  preview,
  fileName,
  fileSize,
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
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition">
          <LuDownload size={20} />
        </button>
        <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition">
          <LuPencil size={20} />
        </button>
        <button className="p-2 border border-gray-300 rounded-full hover:bg-red-500 hover:text-white transition">
          <LuX size={20} />
        </button>
      </div>
    </div>
  );
}
