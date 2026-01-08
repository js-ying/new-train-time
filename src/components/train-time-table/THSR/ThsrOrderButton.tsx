import { JsyTimeTable } from "@/models/jsy-thsr-info";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import React from "react";

interface ThsrOrderButtonProps {
  timeTable: JsyTimeTable;
}

const ThsrOrderButton: React.FC<ThsrOrderButtonProps> = ({ timeTable }) => {
  const { t } = useTranslation();
  return (
    <div>
      <Button
        size="sm"
        className="h-6 min-w-fit bg-neutral-500 p-2 text-sm text-white dark:bg-neutral-600"
        onPress={() => {}}
      >
        {t("order")}
      </Button>
    </div>
  );
};

export default ThsrOrderButton;
