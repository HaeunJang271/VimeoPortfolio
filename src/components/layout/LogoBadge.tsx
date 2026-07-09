import Image from "next/image";
import { SITE_NAME } from "@/utils/constants";

interface LogoBadgeProps {
  logo: string | null;
}

export function LogoBadge({ logo }: LogoBadgeProps) {
  if (logo) {
    return (
      <div className="inline-flex max-w-[180px] items-center bg-black/80 p-3 backdrop-blur-sm">
        <div className="relative h-10 w-32">
          <Image
            src={logo}
            alt={`${SITE_NAME} logo`}
            fill
            className="object-contain object-left"
            sizes="128px"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center bg-black/80 px-4 py-3 text-xs tracking-[0.28em] text-white backdrop-blur-sm">
      {SITE_NAME}
    </div>
  );
}
