import { Link } from "@tanstack/react-router";
import { GiSmallFire } from "react-icons/gi";

export default function Logo() {
  return (
    <Link
      className="font-bold flex items-center h-10 gap-1 justify-center select-none text-lg hover:text-xl transition duration-300"
      to="/"
    >
      <GiSmallFire className="text-orange-500 font-semibold" />
      ImageBoost
    </Link>
  );
}
