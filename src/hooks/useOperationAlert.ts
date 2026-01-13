import { JsyOperationAlert } from "@/models/jsy-operation-alert";
import fetchData from "@/services/fetchData";
import { useEffect, useState } from "react";
import usePage from "./usePage";

const useOperationAlert = (): JsyOperationAlert => {
  const { isTr, isThsr, isTymc } = usePage();
  const [jsyOperationAlert, setJsyOperationAlert] =
    useState<JsyOperationAlert>(null);

  // 取得時刻表
  const getOperationAlert = async () => {
    if (isTr) {
      try {
        const result: JsyOperationAlert = await fetchData("/api/getJsyTrAlert");
        setJsyOperationAlert(result);
      } catch (error) {
        console.error(error);
      }
    }

    if (isThsr) {
      try {
        const result: JsyOperationAlert = await fetchData(
          "/api/getJsyThsrAlert",
        );
        setJsyOperationAlert(result);
      } catch (error) {
        console.error(error);
      }
    }

    if (isTymc) {
      try {
        const result: JsyOperationAlert = await fetchData(
          "/api/getJsyTymcAlert",
        );
        setJsyOperationAlert(result);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getOperationAlert();
  }, []);

  return jsyOperationAlert;
};

export default useOperationAlert;
