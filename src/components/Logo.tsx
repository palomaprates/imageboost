import { LuImageUp } from "react-icons/lu";

export default function Logo() {
  return (
    <div className="font-bold flex items-center h-10 gap-1 justify-center select-none hover:text-lg transition duration-300">
      <LuImageUp className="text-purple-800 font-semibold" />
      ImageBoost
    </div>
  );
}
