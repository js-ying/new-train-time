/**
 * 會員狀態契約（camelCase；後端依 premium_until 即時算後回傳）
 * 真實來源 = users.premium_until；isPremium 由後端 SQL 即時算，前端只消費。
 */

/** 一次性方案代碼 */
export type MembershipPlanCode = "1m" | "3m" | "6m" | "12m";

/** none=從未付費；active=會員有效；expired=曾付費已過期 */
export type MembershipState = "active" | "expired" | "none";

export interface MembershipStatus {
  isPremium: boolean;
  /** ISO 到期日（含 +08:00）；供顯示與到期 modal 判斷；無則 null */
  premiumUntil: string | null;
  status: MembershipState;
  lastPlan: MembershipPlanCode | null;
}
