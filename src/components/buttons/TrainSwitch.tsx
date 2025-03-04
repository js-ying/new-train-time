import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { GaEnum } from "@/enums/GaEnum";
import { PageEnum } from "@/enums/PageEnum";
import { PathEnum } from "@/enums/PathEnum";
import { SearchAreaActiveIndexEnum } from "@/enums/SearchAreaParamsEnum";
import DateUtils from "@/utils/DateUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import ArrowDownIcon from "../icons/ArrowDownIcon";

/** 列車切換器 */
const TrainSwitch: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const trains = [PageEnum.TR, PageEnum.THSR, PageEnum.TYMC];

  const toggleTrainPage = (toPage: PageEnum) => {
    setParams({
      ...params,
      startStationId: null,
      endStationId: null,
      date: DateUtils.getCurrentDate(),
      time: DateUtils.getCurrentTime(),
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
    });

    if (toPage === PageEnum.TR) {
      gaClickEvent(GaEnum.TR_TITLE);
      router.push({
        pathname: `${PathEnum[PageEnum.TR + "Home"]}`,
      });
    }
    if (toPage === PageEnum.THSR) {
      gaClickEvent(GaEnum.THSR_TITLE);
      router.push({
        pathname: `${PathEnum[PageEnum.THSR + "Home"]}`,
      });
    }
    if (toPage === PageEnum.TYMC) {
      gaClickEvent(GaEnum.TYMC_TITLE);
      router.push({
        pathname: `${PathEnum[PageEnum.TYMC + "Home"]}`,
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Dropdown
          backdrop="blur"
          classNames={{ content: "dark:bg-eerieBlack-500 dark:bg-none" }}
        >
          <DropdownTrigger>
            <Button
              className={`h-5 min-w-fit bg-silverLakeBlue-500 px-1.5
              text-sm text-white dark:bg-gamboge-500 dark:text-eerieBlack-500`}
              radius="md"
              aria-label="train-switch-btn"
            >
              <ArrowDownIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="train-switch-dropdown-menu">
            {trains.map((train) => (
              <DropdownItem
                key={train}
                onPress={() => {
                  toggleTrainPage(train);
                }}
              >
                {t(`${train}Dropdown`)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};

export default TrainSwitch;
