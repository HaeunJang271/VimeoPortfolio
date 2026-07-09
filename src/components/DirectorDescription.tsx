import type { DirectorDescriptionLink } from "@/types/director";

interface DirectorDescriptionProps {
  description: string;
  links: DirectorDescriptionLink[];
}

export function DirectorDescription({
  description,
  links,
}: DirectorDescriptionProps) {
  if (!description && links.length === 0) return null;

  return (
    <div className="max-w-3xl space-y-5">
      {description ? (
        <p className="whitespace-pre-line text-sm leading-[1.85] text-white/70 md:text-[15px]">
          {description}
        </p>
      ) : null}

      {links.length > 0 ? (
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map((link) => (
            <a
              key={`${link.label}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/75 underline underline-offset-4 transition-colors hover:text-white md:text-[15px]"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
