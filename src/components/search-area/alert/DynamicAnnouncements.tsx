import CommonAlert from "@/components/common/CommonAlert";
import { JsyAnnouncement } from "@/models/jsy-announcement";
import { useTranslation } from "next-i18next";
import { FC } from "react";

interface DynamicAnnouncementsProps {
  announcements: JsyAnnouncement[];
}

/** [元件] 動態公告 */
const DynamicAnnouncements: FC<DynamicAnnouncementsProps> = ({
  announcements,
}) => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";

  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="mb-5 flex flex-col gap-4">
      {announcements.map((ann) => (
        <CommonAlert
          key={ann.id}
          severity={ann.severity === "CRITICAL" ? "error" : "warning"}
        >
          {isEn ? ann.contentEn : ann.contentZhTw}
        </CommonAlert>
      ))}
    </div>
  );
};

export default DynamicAnnouncements;
