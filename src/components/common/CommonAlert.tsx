import { cn } from "@/utils/cn";
import Alert, { AlertProps } from "@mui/material/Alert";
import { FC } from "react";

/**
 * [元件] 狀態提示 Alert：統一 outlined + 圓角外觀
 * 用於系統告知類訊息（無資料 / API 錯誤 / 公告）；行動引導請用 CalloutBanner
 */
const CommonAlert: FC<AlertProps> = ({ className, ...props }) => (
  <Alert
    variant="outlined"
    className={cn("rounded-xl", className)}
    {...props}
  />
);

export default CommonAlert;
