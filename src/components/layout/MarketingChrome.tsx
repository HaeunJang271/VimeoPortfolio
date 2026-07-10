import Link from "next/link";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { BRAND_NAME } from "@/utils/constants";
import { splitCopyrightForMobile } from "@/utils/copyright";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const LOGO_WIDTH_RATIO = 176 / 48;
const MOBILE_LOGO_MAX_HEIGHT = 36;

function getLogoDisplayWidth(logoHeight: number): number {
  return Math.round(logoHeight * LOGO_WIDTH_RATIO);
}

interface MarketingChromeProps {
  instagram: string;
  vimeoUrl: string;
  logo?: string | null;
  logoHeight?: number;
  copyrightText?: string;
}

export function MarketingChrome({
  instagram,
  vimeoUrl,
  logo,
  logoHeight = 48,
  copyrightText,
}: MarketingChromeProps) {
  const resolvedCopyright =
    copyrightText?.trim() ||
    `© ${new Date().getFullYear()} ${BRAND_NAME}. ALL RIGHTS RESERVED.`;
  const mobileCopyright = splitCopyrightForMobile(resolvedCopyright);
  const desktopLogoWidth = getLogoDisplayWidth(logoHeight);
  const mobileLogoWidth = getLogoDisplayWidth(MOBILE_LOGO_MAX_HEIGHT);

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40">
      <div className="flex w-full items-end justify-between gap-3 px-4 pb-6 sm:px-6 sm:pb-8 md:gap-6 md:px-10 md:pb-10">
        <div className="pointer-events-auto min-w-0 max-w-[calc(100%-4.75rem)] sm:max-w-[calc(100%-5.5rem)] md:max-w-[calc(100%-7rem)]">
          <Link
            href="/"
            className="block transition-opacity hover:opacity-70"
          >
            {logo?.trim() ? (
              <>
                <div
                  className="relative md:hidden"
                  style={{
                    height: `${MOBILE_LOGO_MAX_HEIGHT}px`,
                    width: `${mobileLogoWidth}px`,
                    maxWidth: "100%",
                  }}
                >
                  <Image
                    src={logo}
                    alt={BRAND_NAME}
                    fill
                    className="object-contain object-left"
                    sizes={`${mobileLogoWidth}px`}
                  />
                </div>
                <div
                  className="relative hidden md:block"
                  style={{
                    height: `${logoHeight}px`,
                    width: `${desktopLogoWidth}px`,
                    maxWidth: "min(85vw, 100%)",
                  }}
                >
                  <Image
                    src={logo}
                    alt={BRAND_NAME}
                    fill
                    className="object-contain object-left"
                    sizes={`${desktopLogoWidth}px`}
                  />
                </div>
              </>
            ) : (
              <span
                className={`${bebasNeue.className} block max-w-full truncate text-4xl leading-none tracking-wide text-white sm:text-5xl md:text-7xl`}
              >
                {BRAND_NAME}
              </span>
            )}
          </Link>
          <div className="mt-2 text-[10px] tracking-[0.12em] text-white/70 md:text-[11px]">
            <div className="md:hidden">
              <p>{mobileCopyright.line1}</p>
              {mobileCopyright.line2 ? <p>{mobileCopyright.line2}</p> : null}
            </div>
            <p className="hidden max-w-full md:block">{resolvedCopyright}</p>
          </div>
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center gap-3 md:gap-5">
          {instagram ? (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white transition-opacity hover:opacity-60"
            >
              <InstagramIcon className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
            </a>
          ) : null}
          <a
            href={vimeoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vimeo"
            className="flex shrink-0 items-center justify-center transition-opacity hover:opacity-60"
          >
            <Image
              src="/logo/vimeo.png"
              alt=""
              width={24}
              height={24}
              className="h-5 w-5 md:h-6 md:w-6"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
