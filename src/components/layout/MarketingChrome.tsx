import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { VimeoIcon } from "@/components/icons/VimeoIcon";
import { BRAND_NAME } from "@/utils/constants";
import { extractVimeoId } from "@/utils/vimeo";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface MarketingChromeProps {
  instagram: string;
  homepageShowreel: string;
}

function getVimeoLink(showreel: string): string {
  const id = extractVimeoId(showreel);
  return id ? `https://vimeo.com/${id}` : "https://vimeo.com";
}

export function MarketingChrome({
  instagram,
  homepageShowreel,
}: MarketingChromeProps) {
  const vimeoLink = getVimeoLink(homepageShowreel);

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40">
      <div className="flex w-full items-end justify-between px-6 pb-8 md:px-10 md:pb-10">
        <div className="pointer-events-auto">
          <Link
            href="/"
            className={`${bebasNeue.className} text-5xl leading-none tracking-wide text-white transition-opacity hover:opacity-70 md:text-7xl`}
          >
            {BRAND_NAME}
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
            href={vimeoLink}
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
