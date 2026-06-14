import CommonDialog from "@/components/common/CommonDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

/** 距到期 N 天內視為「即將到期」 */
const EXPIRING_THRESHOLD_DAYS = 7;
const MS_PER_DAY = 86_400_000;

type ExpiryVariant = "expired" | "expiring";

/**
 * 會員到期提醒（Phase 0 骨架）
 * - 登入後依 /me 的 membershipStatus / premiumUntil 判斷：已到期 → 已到期 modal；
 *   有效且距到期 ≤ 7 天 → 即將到期 modal。
 * - 用 localStorage key（expiryNotice:{premiumUntil}:{variant}）防同一到期日同狀態重複跳。
 * - Phase 0 僅資訊提示、不串金流；續購 CTA 待 Phase 1 接付款後再導 UserDialog。
 */
const MembershipExpiryDialog: FC = () => {
  const { profile } = useAuth();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<ExpiryVariant | null>(null);

  useEffect(() => {
    if (!profile?.premiumUntil) return; // 未登入或從未付費 → 不提醒

    let next: ExpiryVariant | null = null;
    if (profile.membershipStatus === "expired") {
      next = "expired";
    } else if (profile.membershipStatus === "active") {
      const daysLeft =
        (new Date(profile.premiumUntil).getTime() - Date.now()) / MS_PER_DAY;
      if (daysLeft <= EXPIRING_THRESHOLD_DAYS) next = "expiring";
    }
    if (!next) return;

    // 同一到期日同一狀態只跳一次
    const key = `expiryNotice:${profile.premiumUntil}:${next}`;
    if (window.localStorage.getItem(key)) return;
    window.localStorage.setItem(key, "1");
    setVariant(next);
    setOpen(true);
  }, [profile]);

  if (!variant) return null;

  const dateText = profile?.premiumUntil
    ? new Date(profile.premiumUntil).toLocaleDateString(i18n.language)
    : "";

  return (
    <CommonDialog
      open={open}
      setOpen={setOpen}
      title={
        variant === "expired"
          ? "membershipExpiredTitle"
          : "membershipExpiringTitle"
      }
      confirmText="membershipRenewCta"
      onConfirm={() => router.push("/premium")}
      cancelText="gotItLabel"
    >
      {variant === "expired"
        ? t("membershipExpiredMsg")
        : t("membershipExpiringMsg", { date: dateText })}
    </CommonDialog>
  );
};

export default MembershipExpiryDialog;
