import { SearchSubmitContext } from "@/contexts/SearchSubmitContext";
import { Button } from "@heroui/react";
import { useTranslation } from "next-i18next";
import { FC, useContext } from "react";

/** 搜尋按鈕 */
const SearchButton: FC = () => {
  const { t } = useTranslation();
  const submitSearch = useContext(SearchSubmitContext);

  return (
    <Button
      className="text-md h-10 min-w-fit bg-cta text-cta-foreground"
      radius="sm"
      onPress={() => submitSearch()}
    >
      {t("searchBtn")}
    </Button>
  );
};

export default SearchButton;
