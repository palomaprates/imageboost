import { Link } from "@tanstack/react-router";
import { LuImageUp } from "react-icons/lu";

export default function Logo() {
  return (
    <Link
      className="font-bold flex items-center h-10 gap-1 justify-center select-none text-lg hover:text-xl transition duration-300"
      to="/"
    >
      <LuImageUp className="text-purple-800 font-semibold" />
      ImageBoost
    </Link>
  );
}
