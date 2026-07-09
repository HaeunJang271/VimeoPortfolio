import type { Credit } from "@/types/work";

interface CreditListProps {
  credits: Credit[];
}

export function CreditList({ credits }: CreditListProps) {
  if (!credits || credits.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium tracking-[0.2em] text-white/40">
        CREDITS
      </h3>
      <dl className="space-y-3">
        {credits.map((credit, index) => (
          <div
            key={`${credit.role}-${credit.name}-${index}`}
            className="flex flex-col gap-1 sm:flex-row sm:gap-8"
          >
            <dt className="min-w-[140px] text-sm text-white/40">{credit.role}</dt>
            <dd className="text-sm text-white/80">{credit.name}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
