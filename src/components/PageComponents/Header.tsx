import { Link } from "@tanstack/react-router";
import Logo from "./Logo";

export default function Header() {
  return (
    <Link className="flex justify-center items-center h-20 w-full" to="/">
      <Logo />
    </Link>
  );
}
