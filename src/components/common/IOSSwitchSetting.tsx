import { Switch } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, ReactNode } from "react";
import { GaEnum } from "../../enums/GaEnum";
import { gaClickEvent } from "../../utils/GaUtils";

interface IOSSwitchSettingProps {
  label: string;
  value: boolean;
  setValue: (val: boolean) => void;
  gaEnum: GaEnum;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  isOnlyMobile?: boolean;
  /** 顯示於 label 文字右側的附加元素（例如 NewLabel 標籤） */
  suffix?: ReactNode;
}

const IOSSwitchSetting: FC<IOSSwitchSettingProps> = ({
  label,
  value,
  setValue,
  gaEnum,
  color = "default",
  isOnlyMobile = false,
  suffix,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-2">
        {isOnlyMobile && (
          <span className="mr-2 border border-zinc-700 px-1 py-0.5 text-xs dark:border-zinc-200">
            {t("mobile")}
          </span>
        )}
        {label}
        {suffix}
      </span>
      <Switch
        isSelected={value}
        onValueChange={(val) => {
          gaClickEvent(gaEnum);
          setValue(val);
        }}
        size="sm"
        color={color}
      ></Switch>
    </div>
  );
};

export default IOSSwitchSetting;
