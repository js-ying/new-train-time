import Alert from "@mui/material/Alert";
import { FC } from "react";

const TdxAlert: FC = () => {
  return (
    <Alert severity="warning" variant="outlined">
      <div className="font-bold">
        目前已知交通部 TDX
        平臺資料來源異常，台鐵時刻表無法正常顯示。請稍後再試，感謝您的理解與支持！
      </div>
    </Alert>
  );
};

export default TdxAlert;
