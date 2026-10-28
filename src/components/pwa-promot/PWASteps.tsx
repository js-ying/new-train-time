import { useTranslation } from "next-i18next";
import Image from "next/image";
import { FC, ReactNode } from "react";

export interface PWAStep {
  icon: ReactNode;
  text: string;
}

// 步驟文字：序號獨立一欄，換行時文字對齊序號之後
const StepText: FC<{ no: number; children: ReactNode }> = ({
  no,
  children,
}) => (
  <div className="flex">
    <span className="mr-1 shrink-0">{no}.</span>
    <span>{children}</span>
  </div>
);

// 安裝步驟清單：左欄固定寬圖示、右欄文字換行不擠壓圖示；最後自動接「安裝成功」一步
const PWASteps: FC<{ steps: PWAStep[] }> = ({ steps }) => {
  const { t } = useTranslation();

  return (
    <ol className="mx-auto w-fit text-left">
      {steps.map((step, index) => (
        <li key={step.text} className="mb-1 flex items-center">
          <div className="shrink-0">{step.icon}</div>
          <StepText no={index + 1}>{step.text}</StepText>
        </li>
      ))}
      <li className="flex items-center">
        <div className="flex h-8 w-12 shrink-0 items-center justify-center">
          <Image
            src={`/images/logos/logo-32.png`}
            alt="traintime-logo"
            width={26}
            height={26}
            className="rounded"
          />
        </div>
        <StepText no={steps.length + 1}>
          {t("installedSuccessfullyMsg")}
        </StepText>
      </li>
    </ol>
  );
};

export default PWASteps;
