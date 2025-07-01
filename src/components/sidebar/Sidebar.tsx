import CommonDialog from "@/components/CommonDialog";
import { Button } from "@heroui/react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from "@mui/material";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";
import { updateDataList } from "../../../public/data/updatesData";
import { GaEnum } from "../../enums/GaEnum";
import useSettingHook from "../../hooks/useSettingHook";
import { gaClickEvent } from "../../utils/GaUtils";
import IOSSwitchSetting from "./IOSSwitchSetting";

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

const DrawerList: FC<DrawerListProps> = ({ setSidebarOpen }) => {
  const { t } = useTranslation();
  const router = useRouter();

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
        text: "feedbackMenu",
        icon: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
      },
    ];
  }, []);

  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [showTrTrainNote, setShowTrTrainNote] =
    useSettingHook("showTrTrainNote");

  const [autoRedirectLastUsedPage, setEnableLastUsedPageRedirect] =
    useSettingHook("autoRedirectLastUsedPage");

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

      default:
        break;
    }
  };

  return (
    <>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          <ListItem>
            <ListItemIcon sx={{ minWidth: "40px" }}>
              <Image
                src={`/images/logos/logo-32.png`}
                alt="traintime-logo"
                width={25}
                height={25}
                className="rounded"
              />
            </ListItemIcon>
            <ListItemButton
              component={Link}
              href="/"
              className="custom-cursor-pointer font-bold text-silverLakeBlue-500 dark:text-gamboge-500"
              onClick={() => handleClick("home")}
              sx={{ width: "100%" }}
            >
              <ListItemText
                primary={`${t("trTitle")}`}
                primaryTypographyProps={{
                  fontWeight: "700",
                  fontSize: "1.125rem",
                }}
              />
            </ListItemButton>
          </ListItem>
          {list.map((item) => (
            <ListItem key={item.text} disablePadding>
              {item.text === "feedbackMenu" ? (
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
                  href={item.text === "featureIntroductionMenu" ? "/features" : "/updates"}
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
        <List className="ml-4 mr-2 text-sm">
          <IOSSwitchSetting
            value={showTrTrainNote}
            setValue={setShowTrTrainNote}
            label={t("showTrTrainNoteSwitch")}
            color="primary"
          />
        </List>
        <Divider />
        <List className="ml-4 mr-2 text-sm">
          <IOSSwitchSetting
            value={autoRedirectLastUsedPage}
            setValue={setEnableLastUsedPageRedirect}
            label={t("autoRedirectLastUsedPageSwitch")}
            color="primary"
          />
        </List>
        <Divider />
        <List>
          <ListItemButton disabled={true}>
            <ListItemText
              primary={`ver. ${updateDataList[0].ver}`}
              primaryTypographyProps={{}}
            />
          </ListItemButton>
        </List>
      </Box>

      <CommonDialog
        open={feedbackOpen}
        setOpen={setFeedbackOpen}
        title={t("feedbackMenu")}
      >
        <div className="flex flex-col justify-center">
          <div className="mb-6 text-left">{t("feedbackDescription")}</div>
          <div>
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
    </>
  );
};

const Sidebar: FC = () => {
  const [open, setOpen] = useState(false);
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <>
      <div
        role="button"
        className="custom-cursor-pointer"
        onClick={() => setOpen(true)}
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
