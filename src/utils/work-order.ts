import type { Work } from "@/types/work";

export function sortWorksByOrder(works: Work[], workOrder: string[]): Work[] {
  if (workOrder.length === 0) {
    return [...works].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  const orderMap = new Map(workOrder.map((id, index) => [id, index]));

  return [...works].sort((a, b) => {
    const aIndex = orderMap.get(a.id);
    const bIndex = orderMap.get(b.id);

    if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;
    if (aIndex !== undefined) return -1;
    if (bIndex !== undefined) return 1;
    return a.displayOrder - b.displayOrder;
  });
}

export function getOrderedWorkIds(works: Work[], workOrder: string[]): string[] {
  return sortWorksByOrder(works, workOrder).map((work) => work.id);
}
