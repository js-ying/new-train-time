import type { MembershipPlanCode } from "@/models/membership";
import type { CheckoutResponse, OrderStatusResponse } from "@/models/order";
import { callUserApi } from "@/services/userApi";
import type { User } from "firebase/auth";

/**
 * 建立綠界結帳：回 { actionUrl, params } 供前端組 form 導轉。
 * 失敗以 ApiError 拋出（呼叫端用 isAuthError 判斷是否要強制登出）。
 */
export const createCheckout = async (
  planCode: MembershipPlanCode,
  user?: User | null,
  locale?: string,
): Promise<CheckoutResponse> => {
  return callUserApi<CheckoutResponse>({
    url: "/api/payments/checkout",
    method: "POST",
    // 帶當前 locale 讓後端組對應語系的 OrderResultURL（en→/en/payment/result）
    body: { planCode, locale },
    user,
  });
};

/** 查本人單筆訂單狀態（導回頁輪詢「這筆」是否 paid）。 */
export const getOrderStatus = async (
  merchantTradeNo: string,
  user?: User | null,
): Promise<OrderStatusResponse> => {
  return callUserApi<OrderStatusResponse>({
    url: `/api/payments/order-status?mtn=${encodeURIComponent(merchantTradeNo)}`,
    method: "GET",
    user,
  });
};
