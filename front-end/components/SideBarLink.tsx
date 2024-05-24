import Link from "next/link";
import { useRouter } from "next/router";

function SidebarLink({ Icon, text, active, link }: any) {
  const router = useRouter();
  return (
    <Link
      className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation ${
        active && "font-bold"
      }`}
      href={link}
    >
      <Icon className="h-7" />
      <span className="hidden xl:inline">{text}</span>
    </Link>
  );
}

export default SidebarLink;
