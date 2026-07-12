import type { Work } from "@/types/work";

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

    // 둘 다 목록에 없으면 displayOrder 오름차순(최신이 맨 위).
    return a.displayOrder - b.displayOrder;
  });
}

export function getOrderedWorkIds(works: Work[], workOrder: string[]): string[] {
  return sortWorksByOrder(works, workOrder).map((work) => work.id);
}
