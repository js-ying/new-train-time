import type { MembershipPlanCode } from "@/models/membership";

/**
 * 付款相關前端契約。
 */

/** 建立結帳請求 */
export interface CheckoutRequest {
  planCode: MembershipPlanCode;
}

/**
 * 結帳回應：拿 actionUrl + params 自組 hidden form 導轉綠界 cashier。
 * params 對前端只是 string map（含 CheckMacValue）。
 */
export interface CheckoutResponse {
  actionUrl: string;
  params: Record<string, string>;
}

/** 訂單狀態；not_found = 查無此單（或非本人） */
export type OrderStatus =
  | "created"
  | "paid"
  | "failed"
  | "refunded"
  | "not_found";

/** 查單回應；導回頁輪詢「這筆」是否 paid 用 */
export interface OrderStatusResponse {
  status: OrderStatus;
}
