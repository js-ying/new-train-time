import CommonDialog from "@/components/common/CommonDialog";
import CommonLightbox from "@/components/common/CommonLightbox";
import UserDialog from "@/components/common/UserDialog";
import {
  AnnouncementContent,
  orderDescriptionSlides,
} from "@/components/train-time-table/OrderDescription";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@heroui/react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { FC, useMemo, useState } from "react";
import { updateDataList } from "../../../public/data/updatesData";
import { GaEnum } from "../../enums/GaEnum";
import { gaClickEvent } from "../../utils/GaUtils";

/** Sidebar 漢堡選單 icon */
const SidebarIcon: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
};

interface DrawerListProps {
  setSidebarOpen: (open: boolean) => void;
}

/** Sidebar 內容列表 */
const DrawerList: FC<DrawerListProps> = ({ setSidebarOpen }) => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  // 訂票說明 Dialog 開關狀態
  const [orderDescOpen, setOrderDescOpen] = useState(false);
  // 訂票說明 Lightbox 當前圖片索引（-1 為關閉）
  const [orderDescLightboxIndex, setOrderDescLightboxIndex] = useState(-1);

  /** 頁面連結列表 */
  const list = useMemo(() => {
    return [
      {
        text: "featureIntroductionMenu",
        icon: "M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
      },
      {
        text: "updateAnnouncementsMenu",
        icon: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z",
      },
      {
        text: "orderDescriptionMenu",
        icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
      },
      {
        text: "feedbackMenu",
        icon: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
      },
      {
        text: "systemSettingMenu",
        icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
      },
    ];
  }, []);

  /** 處理選單點擊事件 */
  const handleClick = (text: string) => {
    switch (text) {
      case "home":
        gaClickEvent(GaEnum.HOME);
        setSidebarOpen(false);
        break;

      case "featureIntroductionMenu":
        gaClickEvent(GaEnum.FEATURES);
        setSidebarOpen(false);
        break;

      case "updateAnnouncementsMenu":
        gaClickEvent(GaEnum.UPDATES);
        setSidebarOpen(false);
        break;

      case "feedbackMenu":
        gaClickEvent(GaEnum.CONTACT_ME);
        setFeedbackOpen(true);
        break;

      case "systemSettingMenu":
        gaClickEvent(GaEnum.SYSTEM_SETTINGS);
        setSidebarOpen(false);
        break;

      case "orderDescriptionMenu":
        // 開啟訂票說明彈窗
        gaClickEvent(GaEnum.TR_ORDER_DESCRIPTION);
        setOrderDescOpen(true);
        break;

      default:
        break;
    }
  };

  /** 取得選單項目的連結目標 */
  const getHref = (text: string): string => {
    switch (text) {
      case "featureIntroductionMenu":
        return "/features";
      case "updateAnnouncementsMenu":
        return "/updates";
      case "systemSettingMenu":
        return "/settings";
      default:
        return "/";
    }
  };

  return (
    <>
      <Box sx={{ width: 290 }} role="presentation">
        {/* 網站名稱 */}
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/"
              className="font-bold text-silverLakeBlue-500 dark:text-gamboge-500"
              onClick={() => handleClick("home")}
              sx={{ width: "100%" }}
            >
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <Image
                  src={`/images/logos/logo-32.png`}
                  alt="traintime-logo"
                  width={25}
                  height={25}
                  className="rounded"
                />
              </ListItemIcon>
              <ListItemText
                primary={`${t("trTitle")}`}
                primaryTypographyProps={{
                  fontWeight: "700",
                  fontSize: "1.125rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        {/* 帳號狀態區塊 */}
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setUserDialogOpen(true)}
              sx={{ py: "10px" }}
            >
              {user ? (
                <>
                  <span className="truncate text-sm">
                    {t("greeting", { name: user.displayName })}
                  </span>
                  {profile?.isPremium && (
                    <span className="ml-1.5 rounded-full border border-amber-600 px-1 text-xs text-amber-600 dark:border-amber-400 dark:text-amber-400">
                      VIP
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("notLoggedIn")}
                </span>
              )}
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        {/* 頁面連結 */}
        <List>
          {list.map((item) => (
            <ListItem key={item.text} disablePadding>
              {item.text === "feedbackMenu" ||
              item.text === "orderDescriptionMenu" ? (
                <ListItemButton onClick={() => handleClick(item.text)}>
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={item.icon}
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.text)}
                    primaryTypographyProps={{}}
                  />
                </ListItemButton>
              ) : (
                <ListItemButton
                  component={Link}
                  href={getHref(item.text)}
                  onClick={() => handleClick(item.text)}
                >
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={item.icon}
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.text)}
                    primaryTypographyProps={{}}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>

        <Divider />

        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              disabled={true}
              className="text-sm"
              sx={{ py: "10px" }}
            >
              Ver. {updateDataList[0].ver}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* 意見反應 Dialog */}
      <CommonDialog
        open={feedbackOpen}
        setOpen={setFeedbackOpen}
        title={t("feedbackMenu")}
        bodyTextAlign="text-left"
      >
        <div className="flex flex-col justify-center">
          <div className="mb-6 text-left">{t("feedbackDescription")}</div>
          {/* 置中顯示回饋按鈕 */}
          <div className="flex justify-center">
            <Button
              color="primary"
              className="w-fit bg-silverLakeBlue-500 text-white dark:bg-gamboge-500 dark:text-eerieBlack-500"
              onPress={() =>
                window.open("https://forms.gle/y9VGhdMwMhbiZVW88", "_blank")
              }
            >
              {t("feedbackBtn")}
            </Button>
          </div>
        </div>
      </CommonDialog>

      {/* 訂票說明 Dialog */}
      <CommonDialog
        open={orderDescOpen}
        setOpen={setOrderDescOpen}
        title="trOrderDescription"
        bodyTextAlign="text-left"
        size="md"
        isDismissable={orderDescLightboxIndex === -1}
        isKeyboardDismissDisabled={orderDescLightboxIndex !== -1}
      >
        <AnnouncementContent />
      </CommonDialog>

      {/* 訂票說明 Lightbox */}
      <CommonLightbox
        slides={orderDescriptionSlides}
        open={orderDescLightboxIndex >= 0}
        index={orderDescLightboxIndex}
        onClose={() => setOrderDescLightboxIndex(-1)}
      />

      {/* 使用者 Dialog */}
      <UserDialog open={userDialogOpen} setOpen={setUserDialogOpen} />
    </>
  );
};

/** Sidebar 元件（漢堡選單） */
const Sidebar: FC = () => {
  const [open, setOpen] = useState(false);
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <>
      <div
        role="button"
        aria-label="Toggle sidebar"
        tabIndex={0}
        className="custom-cursor-pointer"
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setOpen(true);
          }
        }}
      >
        <SidebarIcon />
      </div>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        className="!z-10"
        classes={{
          paper: "!z-10 dark:bg-eerieBlack-500 dark:bg-none",
        }}
      >
        <DrawerList setSidebarOpen={setOpen} />
      </SwipeableDrawer>
    </>
  );
};
export default Sidebar;
