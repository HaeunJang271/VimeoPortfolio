import { revalidatePath } from "next/cache";
import { getDirectors } from "@/services/directors";

export async function revalidateAfterWorkChange(options?: {
  slug?: string;
  previousSlug?: string;
  directorIds?: string[];
}) {
  revalidatePath("/work");
  revalidatePath("/admin/works");

  const slugs = new Set<string>();
  if (options?.slug) slugs.add(options.slug);
  if (options?.previousSlug) slugs.add(options.previousSlug);

  for (const slug of slugs) {
    revalidatePath(`/work/${slug}`);
  }

  if (options?.directorIds?.length) {
    const directors = await getDirectors();
    for (const director of directors) {
      if (options.directorIds.includes(director.id)) {
        revalidatePath(`/directors/${director.slug}`);
      }
    }
  }
}
