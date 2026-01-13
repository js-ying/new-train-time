import { JsyOperationAlert } from "@/models/jsy-operation-alert";
import { getThsrAlert } from "@/services/thsrService";
import { getTrAlert } from "@/services/trService";
import { getTymcAlert } from "@/services/tymcService";
import { useEffect, useState } from "react";
import usePage from "./usePage";

const useOperationAlert = (): JsyOperationAlert => {
  const { isTr, isThsr, isTymc } = usePage();
  const [jsyOperationAlert, setJsyOperationAlert] =
    useState<JsyOperationAlert>(null);

  const getOperationAlert = async () => {
    try {
      let result: JsyOperationAlert = null;

      if (isTr) {
        result = await getTrAlert();
      } else if (isThsr) {
        result = await getThsrAlert();
      } else if (isTymc) {
        result = await getTymcAlert();
      }

      if (result) {
        setJsyOperationAlert(result);
      }
    } catch (error) {
      console.error("Failed to fetch operation alert:", error);
    }
  };

  useEffect(() => {
    getOperationAlert();
  }, [isTr, isThsr, isTymc]);

  return jsyOperationAlert;
};

export default useOperationAlert;
