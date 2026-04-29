import { updateDataList } from "@/data/updatesData";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC } from "react";

/** 全站頁尾：版本資訊、服務條款、隱私權政策 */
const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="mx-auto -mb-5 flex flex-col items-center gap-y-2 pb-2 pt-10 text-xs text-zinc-400 dark:text-zinc-500">
      <nav className="flex gap-x-1.5">
        {/* 版本資訊 */}
        <Link href="/updates" className="hover:underline">
          Ver. {updateDataList[0].ver}
        </Link>
        <span aria-hidden="true">·</span>
        {/* 服務條款 */}
        <Link href="/terms" className="hover:underline">
          {t("termsOfService")}
          <span className="sr-only">Terms of Service</span>
        </Link>
        <span aria-hidden="true">·</span>
        {/* 隱私權政策 */}
        <Link href="/privacy" className="hover:underline">
          {t("privacyPolicy")}
          <span className="sr-only">Privacy Policy</span>
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
