import CommonAlert from "@/components/common/CommonAlert";
import { JsyAnnouncement } from "@/models/jsy-announcement";
import useLang from "@/hooks/useLang";
import { FC } from "react";

interface DynamicAnnouncementsProps {
  announcements: JsyAnnouncement[];
}

/** [元件] 動態公告 */
const DynamicAnnouncements: FC<DynamicAnnouncementsProps> = ({
  announcements,
}) => {
  // 公告只有中英，非中文語系一律顯示英文
  const { isZh } = useLang();

  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="mb-5 flex flex-col gap-4">
      {announcements.map((ann) => (
        <CommonAlert
          key={ann.id}
          severity={ann.severity === "CRITICAL" ? "error" : "warning"}
        >
          {isZh ? ann.contentZhTw : ann.contentEn}
        </CommonAlert>
      ))}
    </div>
  );
};

export default DynamicAnnouncements;
