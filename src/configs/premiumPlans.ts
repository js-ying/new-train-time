/**
 * 付費方案的「顯示用」定價來源（/premium 方案頁）。
 *
 * ⚠️ 收費的真實來源是後端 PLAN_CONFIG（Phase 1 結帳時驗金額，不信前端）；
 *    此處僅供前端展示，金額須與後端 PLAN_CONFIG 保持一致。
 * 定價：1月29 / 3月79 / 6月139 / 12月239（charm pricing，買越久每月越便宜）。
 */
export interface PremiumPlan {
  /** 對應 orders.plan_code */
  code: "1m" | "3m" | "6m" | "12m";
  months: number;
  priceTwd: number;
}

export const PREMIUM_PLANS: PremiumPlan[] = [
  { code: "1m", months: 1, priceTwd: 29 },
  { code: "3m", months: 3, priceTwd: 79 },
  { code: "6m", months: 6, priceTwd: 139 },
  { code: "12m", months: 12, priceTwd: 239 },
];
