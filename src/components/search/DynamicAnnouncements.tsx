import { JsyAnnouncement } from "@/models/jsy-announcement";
import Alert from "@mui/material/Alert";
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
        <Alert
          key={ann.id}
          severity={ann.severity === "CRITICAL" ? "error" : "warning"}
          variant="outlined"
          className="rounded-xl"
        >
          {isEn ? ann.contentEn : ann.contentZhTw}
        </Alert>
      ))}
    </div>
  );
};

export default DynamicAnnouncements;
