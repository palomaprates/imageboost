import { Link } from "@tanstack/react-router";
// import { GiSmallFire } from "react-icons/gi";
import logo from "../../assets/Logo.png";

export default function Logo() {
  return (
    <Link
      className="font-bold flex items-center h-10 gap-1 justify-center select-none text-lg hover:text-xl transition duration-300"
      to="/"
    >
      <img src={logo} alt="ImageBoost logo" className="h-45" />
    </Link>
  );
}
