/**
 * 收藏站點（BUS_STOP 分組）的 targetId / targetName 編解碼。
 * 收藏單位＝站牌×路線×方向（子線候選再帶 sub），與站牌看板列同粒度。
 */

/** 收藏站點 key（對應後端 stop-boards-batch 的單筆查詢）。 */
export interface BusStopFavoriteKey {
  stopUid: string;
  routeUid: string;
  direction: number;
  subRouteName?: string;
}

/** targetId：`stopUid|routeUid|direction[|sub]`。 */
export const encodeBusStopFavoriteId = (key: BusStopFavoriteKey): string =>
  `${key.stopUid}|${key.routeUid}|${key.direction}` +
  (key.subRouteName ? `|${key.subRouteName}` : "");

/** 解析 targetId；非三元組格式（如舊版整站收藏的純 stopUid）回 null，呼叫端據此清除。 */
export const parseBusStopFavoriteId = (
  targetId: string,
): BusStopFavoriteKey | null => {
  const [stopUid, routeUid, rawDir, ...subParts] = targetId.split("|");
  const direction = Number(rawDir);
  if (!stopUid || !routeUid || !Number.isInteger(direction)) return null;
  const subRouteName = subParts.join("|") || undefined;
  return { stopUid, routeUid, direction, subRouteName };
};

/** targetName 顯示快照：`路線顯示名|終點|站名`（batch 查無列時的 fallback 顯示）。 */
export const encodeBusStopFavoriteName = (
  routeLabel: string,
  destination: string,
  stopName: string,
): string => `${routeLabel}|${destination}|${stopName}`;

export const parseBusStopFavoriteName = (
  targetName: string,
): { routeLabel: string; destination: string; stopName: string } => {
  const [routeLabel = "", destination = "", stopName = ""] =
    targetName.split("|");
  return { routeLabel, destination, stopName };
};
