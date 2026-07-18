/**
 * 會員狀態契約（camelCase）
 */

/** 一次性方案代碼 */
export type MembershipPlanCode = "1m" | "6m" | "12m";

/** none=從未付費；active=會員有效；expired=曾付費已過期 */
export type MembershipState = "active" | "expired" | "none";

export interface MembershipStatus {
  isPremium: boolean;
  /** ISO 到期日（含 +08:00）；供顯示與到期 modal 判斷；無則 null */
  premiumUntil: string | null;
  status: MembershipState;
  lastPlan: MembershipPlanCode | null;
}

/** 一般會員各車種清單上限（歷史查詢 / 常用路線 / 常用站牌共用） */
export const FREE_MAX_PER_TYPE = 5;

/** 付費會員各車種清單上限 */
export const PREMIUM_MAX_PER_TYPE = 10;

/** 取該身分的各車種上限 */
export const maxPerType = (isPremium: boolean): number =>
  isPremium ? PREMIUM_MAX_PER_TYPE : FREE_MAX_PER_TYPE;
