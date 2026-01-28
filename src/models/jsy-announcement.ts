export interface JsyAnnouncement {
  id: number;
  contentZhTw: string;
  contentEn: string;
  trainTypes: string; // "TR,THSR,TYMC"
  severity: "CRITICAL" | "WARNING";
  isEnabled: "Y" | "N";
  createdAt: string;
  updatedAt: string;
}
