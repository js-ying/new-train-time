import Chip from "@mui/material/Chip";
import { FC, ReactNode } from "react";

/** 列車詳情的「標籤 + 值」清單：兩欄 grid，標籤欄寬取最寬標籤、值一律從同一條線起排 */
export const DetailInfoList: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="grid grid-cols-label-value items-start gap-2 text-left">
      {children}
    </div>
  );
};

interface DetailInfoRowProps {
  label: string;
  children: ReactNode;
}

/** 標籤含換行（\n）時 chip 隨內容增高、多行置中；單行標籤維持原樣 */
const MULTILINE_CHIP_SX = {
  height: "auto",
  "& .MuiChip-label": {
    whiteSpace: "pre-line",
    textAlign: "center",
    lineHeight: 1.3,
    py: 0.25,
  },
};

/** 清單中的一列（回傳兩個 grid cell，須放在 DetailInfoList 內） */
export const DetailInfoRow: FC<DetailInfoRowProps> = ({ label, children }) => {
  return (
    <>
      <Chip
        label={label}
        size="small"
        color="primary"
        sx={label.includes("\n") ? MULTILINE_CHIP_SX : undefined}
      />
      <div className="break-words">{children}</div>
    </>
  );
};
