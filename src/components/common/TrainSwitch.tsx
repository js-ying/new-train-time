import {
  SearchAreaContext,
  SearchAreaUpdateContext,
} from "@/contexts/SearchAreaContext";
import { GaEnum } from "@/enums/GaEnum";
import { PageEnum } from "@/enums/PageEnum";
import { SearchAreaActiveIndexEnum } from "@/enums/SearchAreaParamsEnum";
import usePage from "@/hooks/usePage";
import DateUtils from "@/utils/DateUtils";
import { gaClickEvent } from "@/utils/GaUtils";
import { getHomePath, recordLastUsedPage } from "@/utils/PageUtils";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, useContext } from "react";

const TrainSwitch: FC = () => {
  const { t } = useTranslation();
  const { page } = usePage();
  const params = useContext(SearchAreaContext);
  const setParams = useContext(SearchAreaUpdateContext);
  const trains = [PageEnum.TR, PageEnum.THSR, PageEnum.TYMC];

  const handleTrainSwitch = (targetPage: PageEnum) => {
    setParams({
      ...params,
      startStationId: null,
      endStationId: null,
      date: DateUtils.getCurrentDate(),
      time: DateUtils.getCurrentTime(),
      activeIndex: SearchAreaActiveIndexEnum.EMPTY,
    });

    // Record usage
    recordLastUsedPage(targetPage);

    // GA Tracking based on target page
    if (targetPage === PageEnum.TR) gaClickEvent(GaEnum.TR_TITLE);
    else if (targetPage === PageEnum.THSR) gaClickEvent(GaEnum.THSR_TITLE);
    else if (targetPage === PageEnum.TYMC) gaClickEvent(GaEnum.TYMC_TITLE);
  };

  return (
    <div className="flex items-center gap-1 rounded-lg">
      {/* Transport Tabs */}
      {trains.map((train) => {
        const isActive = page === train;
        return (
          <Link
            key={train}
            href={getHomePath(train)}
            onClick={() => handleTrainSwitch(train)}
            className={`
              rounded-md px-3 py-1 text-sm font-bold transition-all
              ${
                isActive
                  ? "bg-zinc-200/80 text-silverLakeBlue-500 shadow-sm dark:bg-zinc-700 dark:text-gamboge-500"
                  : "text-zinc-400 hover:bg-zinc-200/80 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
              }
            `}
          >
            {t(`${train}Dropdown`)}
          </Link>
        );
      })}

      {/* Original Dropdown Switch (Deprecated but kept for future reference) */}
      {/* <Dropdown
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
              href={getHomePath(train)}
              as={Link}
              onPress={() => handleTrainSwitch(train)}
            >
              {t(`${train}Dropdown`)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown> */}
    </div>
  );
};

export default TrainSwitch;

