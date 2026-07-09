import { normalizeCredits, formatCreditLine } from "@/utils/credits";
import type { Credit } from "@/types/work";

interface CreditListProps {
  credits: Credit[];
}

export function CreditList({ credits }: CreditListProps) {
  const normalized = normalizeCredits(credits);

  if (normalized.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16">
      <div className="space-y-2.5">
        {normalized.map((credit, index) => (
          <p
            key={`${credit.role}-${credit.name}-${index}`}
            className="text-sm leading-relaxed text-white/75 md:text-[15px]"
          >
            {formatCreditLine(credit)}
          </p>
        ))}
      </div>
    </section>
  );
}
