import { Switch } from "@nextui-org/react";
import { FC } from "react";
import { GaEnum } from "../enums/GaEnum";
import { gaClickEvent } from "../utils/GaUtils";

interface IOSSwitchSettingProps {
  label: string;
  value: boolean;
  setValue: (val: boolean) => void;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

const IOSSwitchSetting: FC<IOSSwitchSettingProps> = ({
  label,
  color = "default",
  value,
  setValue,
}) => {
  return (
    <div className="flex items-center justify-between">
      {label}
      <Switch
        isSelected={value}
        onValueChange={(val) => {
          gaClickEvent(GaEnum.SHOW_TR_TRAIN_NOTE);
          setValue(val);
        }}
        size="sm"
        color={color}
      ></Switch>
    </div>
  );
};

export default IOSSwitchSetting;
