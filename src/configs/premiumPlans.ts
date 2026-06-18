/**
 * 付費方案的「顯示用」定價來源（/premium 方案頁）。
 */
export interface PremiumPlan {
  /** 對應 orders.plan_code */
  code: "1m" | "6m" | "12m";
  months: number;
  priceTwd: number;
}

export const PREMIUM_PLANS: PremiumPlan[] = [
  { code: "1m", months: 1, priceTwd: 39 },
  { code: "6m", months: 6, priceTwd: 169 },
  { code: "12m", months: 12, priceTwd: 239 },
];
