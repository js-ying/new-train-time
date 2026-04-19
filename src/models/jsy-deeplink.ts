/**
 * 訂票深連結 Jsy 契約 (camelCase；對應後端 jsy/deeplink.ts)
 */

export interface JsyTrDeeplinkDirectParams {
  startStation: string;
  endStation: string;
  trainDate: string;
  trainNumber: number;
}

export interface JsyTrDeeplinkWebParams {
  startStation: string;
  endStation: string;
  departureDate: string;
  departureNumber: string;
  ticketType: number;
  ticketCount: number;
}

export interface JsyThsrDeeplinkDirectParams {
  startStation: string;
  endStation: string;
  trainDate: string;
  trainTime: string;
  trainNumber: number;
}

export interface JsyThsrDeeplinkWebParams {
  /** S 單程 / R 來回 */
  ticketType: string;
  /** Y 標準 / J 商務 */
  carriageType: string;
  adultTicket: number;
  childrenTicket: number;
  disabledTicket: number;
  seniorTicket: number;
  studentTicket: number;
  startStation: string;
  endStation: string;
  /** YYYYMMDD */
  departureDate: string;
  departureNumber: string;
  returnDate?: string;
  returnNumber?: string;
}

export interface JsyDeeplinkResponse {
  deeplink: string;
  /** YYYY-MM-DD HH:mm:ss */
  expired: string;
}
