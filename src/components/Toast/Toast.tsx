import Image from "next/image";
import Link from "next/link";

type Props = {
  image?: string | null;
  href: string;
  title: string;
  subtitle?: string;
};

export function NotificationToast({ image, href, title, subtitle }: Props) {
  return (
    <Link href={href} className="flex items-center">
      <div className="mr-2">
        <Image
          src={image || "/images/user.png"}
          height={50}
          width={50}
          alt="Sender image"
        />
      </div>
      <div className="flex flex-grow flex-col justify-center">
        <div className="font-semibold">{title}</div>
        <div className="text-sm">{subtitle || "Click to view"}</div>
      </div>
    </Link>
  );
}