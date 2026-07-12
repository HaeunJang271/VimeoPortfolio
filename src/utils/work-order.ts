import type { Work } from "@/types/work";

// 추가한 순서(먼저 추가한 것이 위)를 위한 비교. createdAt 오름차순.
function compareByAddedOrder(a: Work, b: Work): number {
  return a.createdAt.localeCompare(b.createdAt);
}

/**
 * 전역 작품 목록(WORK 페이지·관리자)용 정렬.
 * - 수동 드래그로 저장된 작품(displayOrder >= 0): 저장된 순서 유지, 하단에 배치.
 * - 아직 정렬하지 않은 새 작품(displayOrder < 0): 상단에, 추가한 순서대로.
 */
export function sortWorksForDisplay(works: Work[]): Work[] {
  return [...works].sort((a, b) => {
    const aArranged = a.displayOrder >= 0;
    const bArranged = b.displayOrder >= 0;

    if (aArranged && bArranged) return a.displayOrder - b.displayOrder;
    if (!aArranged && !bArranged) return compareByAddedOrder(a, b);

    // 아직 정렬 안 한 새 작품을 수동 정렬된 작품보다 위로 올린다.
    return aArranged ? 1 : -1;
  });
}

export function sortWorksByOrder(works: Work[], workOrder: string[]): Work[] {
  const orderMap = new Map(workOrder.map((id, index) => [id, index]));

  return [...works].sort((a, b) => {
    const aIndex = orderMap.get(a.id);
    const bIndex = orderMap.get(b.id);

    // 둘 다 수동 정렬 목록에 있으면 저장된 순서를 그대로 따른다.
    if (aIndex !== undefined && bIndex !== undefined) return aIndex - bIndex;

    // 수동 정렬 목록에 없는(=새로 추가된) 작품은 항상 위로 올린다.
    if (aIndex === undefined && bIndex !== undefined) return -1;
    if (aIndex !== undefined && bIndex === undefined) return 1;

    // 둘 다 목록에 없으면 추가한 순서대로(먼저 추가한 것이 위).
    return compareByAddedOrder(a, b);
  });
}

export function getOrderedWorkIds(works: Work[], workOrder: string[]): string[] {
  return sortWorksByOrder(works, workOrder).map((work) => work.id);
}
