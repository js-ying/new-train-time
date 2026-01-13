import { Alert } from "@mui/material";

const CommonAlert = () => {
  return (
    <Alert severity="warning" variant="outlined" className="rounded-xl">
      <div className="font-bold">台鐵票價 6/23 起全面調漲！7 大新制啟用</div>
      <div>
        本系統介接之票價資料尚未更新，將暫時顯示舊制票價，7 大新制請參考 {">> "}
        <a
          href="https://ynews.page.link/9gkaa"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          新聞連結
        </a>
        {" <<"}
      </div>
    </Alert>
  );
};

export default CommonAlert;
