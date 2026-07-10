import Link from "next/link";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { VimeoIcon } from "@/components/icons/VimeoIcon";
import { BRAND_NAME } from "@/utils/constants";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface MarketingChromeProps {
  instagram: string;
  vimeoUrl: string;
  logo?: string | null;
}

export function MarketingChrome({
  instagram,
  vimeoUrl,
  logo,
}: MarketingChromeProps) {
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40">
      <div className="flex w-full items-end justify-between px-6 pb-8 md:px-10 md:pb-10">
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="block transition-opacity hover:opacity-70"
          >
            {logo ? (
              <div className="relative h-10 w-36 md:h-12 md:w-44">
                <Image
                  src={logo}
                  alt={BRAND_NAME}
                  fill
                  className="object-contain object-left"
                  sizes="(max-width: 768px) 144px, 176px"
                />
              </div>
            ) : (
              <span
                className={`${bebasNeue.className} text-5xl leading-none tracking-wide text-white md:text-7xl`}
              >
                {BRAND_NAME}
              </span>
            )}
          </Link>
          <p className="mt-2 text-[10px] tracking-[0.12em] text-white/70 md:text-[11px]">
            © {BRAND_NAME}. ALL RIGHTS RESERVED.
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-5 md:gap-6">
          {instagram ? (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white transition-opacity hover:opacity-60"
            >
              <InstagramIcon className="h-5 w-5 md:h-6 md:w-6" />
            </a>
          ) : null}
          <a
            href={vimeoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vimeo"
            className="text-white transition-opacity hover:opacity-60"
          >
            <VimeoIcon className="h-5 w-5 md:h-6 md:w-6" />
          </a>
        </div>
      </div>
    </div>
  );
}
