export const updateDataList = [
  {
    date: "2024-04",
    type: "both",
    ver: "1.0.0",
    items: [
      "新功能：台鐵 / 高鐵時刻 一鍵切換",
      "新功能：亮色 / 暗色佈景 一鍵切換",
      "新功能：繁中 / 英文語言 一鍵切換",
      "Dev 說明：以 Next.js 取代 Vue，重構整個前端系統，讓台鐵和高鐵時刻可以在同一個系統、相似的畫面下進行查詢；以 Tailwind CSS 復刻舊系統畫面，並做一些微小調整，在不影響使用者習慣的前提之下，盡可能提升使用體驗。",
    ],
  },
];

export const oldTrUpdateDataList = [
  {
    date: "2023-10",
    type: "tr",
    ver: "7",
    items: [
      "增設後台程式進行資料介接與處理，提高系統穩定度與彈性，並避免原先的流量上限問題",
      "因應台鐵資料即將收費的政策，本站以新增廣告區域的作法來減少部份負擔，還請見諒\n（您的順手點擊廣告，可給予網站作者一臂之力，繼續提供優質的使用體驗給大家）",
    ],
  },
  {
    date: "2023-08",
    type: "tr",
    ver: "6",
    items: [
      "移除 觀光列車資訊，避免使用者誤會",
      "新增 API 介接失敗提示訊息",
      "新增 列車說明呈現於每一個列車時刻下方",
    ],
  },
  {
    date: "2023-07",
    type: "tr",
    ver: "5",
    items: [
      "新增 列車票價資訊",
      "更新 配合票價資訊的新增，調整列車服務圖示位置",
    ],
  },
  {
    date: "2023-02",
    type: "tr",
    ver: "4",
    items: [
      "新增 文字快速篩選車站功能",
      "修正 列車詳細資訊被快取的問題",
      "修正 使用 URL 帶入查詢結果時，上方車站為空白的問題",
    ],
  },
  {
    date: "2021-11",
    type: "tr",
    ver: "3",
    items: ["更新 日期選擇方式", "新增 列車誤點資訊", "新增 當日過期火車特效"],
  },
  {
    date: "2020-08",
    type: "tr",
    ver: "2",
    items: [
      "更新 出發日期選擇方式",
      "新增 首頁歷史查詢記錄功能",
      "移除 所有彈跳視窗",
      "更新 起迄站互換功能位置",
    ],
  },
  {
    date: "2020-04",
    type: "tr",
    ver: "1",
    items: [
      "選擇車站只要用點的就行",
      "查詢結果可透過按鈕篩選「對號列車」或「非對號列車」",
      "每一結果會簡單呈現車次、車種、起迄站、時間範圍與列車服務（哺乳室、身障旅客專用車、訂便當服務、人車同行……）",
      "點擊任一結果可看到更詳細的列車資訊",
      "每次重新進入首頁，系統會自動帶入最後一次查詢車站",
    ],
  },
];

export const oldThsrUpdateDataList = [
  {
    date: "2024-01",
    type: "thsr",
    ver: "3",
    items: [
      "增設後台程式進行資料介接與處理，提高系統穩定度與彈性，並避免原先的流量上限問題",
      "因應台鐵資料即將收費的政策，本站以新增廣告區域的作法來減少部份負擔，還請見諒\n（您的順手點擊廣告，可給予網站作者一臂之力，繼續提供優質的使用體驗給大家）",
    ],
  },
  {
    date: "2023-08",
    type: "thsr",
    ver: "2",
    items: [
      "新增 自由座車箱",
      "新增 API 介接失敗提示訊息",
      "新增 列車說明呈現於每一個列車時刻下方",
    ],
  },
  {
    date: "2021-11",
    type: "thsr",
    ver: "1",
    items: [
      "快速查詢：打字或點擊即可篩選車站",
      "歷史查詢：最新六筆查詢紀錄",
      "票價查詢：包含團體與法優票價",
      "車次詳細時刻表：包含該車次起迄間所有進站時刻",
      "當日過期車次特效：已小於當下時間的車次會以半透明方式呈現",
      "這是我第一次挑戰深色佈景的設計，希望您會喜歡 😍",
    ],
  },
];
