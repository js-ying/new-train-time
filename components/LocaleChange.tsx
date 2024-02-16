import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import usePage from "../hooks/usePageHook";
import { getStationIdByName, getStationNameById } from "../utils/StationUtils";

interface LocaleIconProps {
  isRotated: boolean;
}

const LocaleIcon: FC<LocaleIconProps> = ({ isRotated }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`h-6 w-6 ${isRotated ? "rotate" : ""}`}
      id="locale-icon"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
};

interface LocaleDropdownProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LocaleDropdown: FC<LocaleDropdownProps> = ({ open, setOpen }) => {
  const dropdownRef = useRef(null);
  const router = useRouter();

  const localeOptions = useMemo(
    () => [
      { label: "繁體中文", value: "zh-Hant" },
      { label: "English", value: "en" },
    ],
    [],
  );

  const handleChange = (value: string) => {
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale: value },
    );

    setOpen(!open);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      // 若只是要取得 dom 值，不一定需要使用 useRef
      !document.getElementById("locale-icon").contains(event.target)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md
    bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex={-1}
    >
      <div className="py-1" role="none">
        {localeOptions.map((locale) => {
          return (
            <div
              className="block cursor-pointer px-4 py-2 text-sm text-zinc-700
            transition hover:bg-zinc-200"
              role="menuitem"
              tabIndex={-1}
              key={locale.value}
              onClick={() => handleChange(locale.value)}
            >
              {locale.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 語系變更（下拉選單版）
 */
const LocaleChangeByDropdown = () => {
  const [open, setOpen] = useState(null);

  return (
    <div className="inline-block cursor-pointer" onClick={() => setOpen(!open)}>
      <LocaleIcon isRotated={true} />
      {open && <LocaleDropdown open={open} setOpen={setOpen} />}
    </div>
  );
};

/**
 * 語系變更（Switch 版）
 */
const LocaleChangeBySwitch: FC = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [isRotated, setIsRotated] = useState(true);
  const { page } = usePage();

  const handleChange = () => {
    setIsRotated(false);
    setTimeout(() => {
      setIsRotated(true);
    });

    const locale = i18n.language === "en" ? "zh-Hant" : "en";

    let urlParams = router.query;
    if (urlParams && Object.keys(urlParams).length > 0) {
      // 翻譯 url 中的車站名稱
      urlParams = {
        ...urlParams,
        s: getStationNameById(
          page,
          getStationIdByName(page, urlParams.s as string, i18n.language),
          locale,
        ),
        e: getStationNameById(
          page,
          getStationIdByName(page, urlParams.e as string, i18n.language),
          locale,
        ),
      };
    }

    // 改變語系不會改變 pathname，若使用 router.push，同 pathname 的話會無法觸發 query 的改變
    // 所以使用 router.replace
    router.replace(
      {
        pathname: router.pathname,
        query: urlParams,
      },
      undefined,
      { locale: locale },
    );
  };

  return (
    <div className="inline-block cursor-pointer" onClick={handleChange}>
      <LocaleIcon isRotated={isRotated} />
    </div>
  );
};

/**
 * 語系變更
 */
const LocaleChange: FC = () => {
  return <LocaleChangeBySwitch />;
};

export default LocaleChange;
