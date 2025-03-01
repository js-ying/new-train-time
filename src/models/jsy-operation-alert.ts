export interface JsyOperationAlert {
  status: "normal" | "warning" | "danger" | "error";
  alerts: {
    status: "normal" | "warning" | "danger";
    publishTime: string;
    startTime: string;
    endTime: string;
    title: string;
    desc: string;
  }[];
}
