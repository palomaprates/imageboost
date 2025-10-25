import { Link } from "@tanstack/react-router";
import logo from "../../assets/Logo.png";

export default function Logo() {
  return (
    <Link
      className="font-bold flex cursor-pointer transition items-center h-10 gap-1 justify-center  text-lg hover:text-xl"
      to="/"
    >
      <img src={logo} alt="ImageBoost logo" className="h-45 " />
    </Link>
  );
}
