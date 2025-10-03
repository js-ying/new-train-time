export const updateDataList = [
  {
    date: "2025-10",
    type: "both",
    ver: "2.2.0",
    items: [
      {
        type: "new",
        content: "新功能：側邊欄加入「顯示/隱藏高鐵列車註記」的開關",
      },
      {
        type: "update",
        content: "現在首頁會顯示最新版本號碼了",
      },
      {
        type: "fix",
        content:
          "修正「特色介紹」圖片在 Firefox 可能無法顯示的問題，並且調整了 UI 細節",
      },
    ],
  },
  {
    date: "2025-09",
    type: "both",
    ver: "2.1.2",
    items: [
      {
        type: "update",
        content:
          "增加台鐵誤點資訊涵蓋的列車數量，從 30 分鐘改為 90 分鐘內發車都會顯示",
      },
      {
        type: "update",
        content: "減少系統下方廣告的出現次數，以提升使用體驗",
      },
      {
        type: "update",
        content: "開放重覆查詢相同的查詢條件，但需要短暫的時間間隔",
      },
    ],
  },
  {
    date: "2025-07",
    type: "both",
    ver: "2.1.1",
    items: [
      {
        type: "update",
        content:
          "現在查詢出發時間若不符合規則（今日起兩個月內），系統會自動將日期重設為當下再發查",
      },
      {
        type: "update",
        content: "現在查詢結果頁面，瀏覽器標題會帶出起迄站名",
      },
      {
        type: "update",
        content: "現在即時營運通阻訊息的按鈕會優先顯示是否為颱風或地震影響",
      },
      {
        type: "fix",
        content: "修正桃園捷運時刻表點擊列車詳細資訊會出錯的問題",
      },
      {
        type: "refactor",
        content: "重構後端系統，提升效能與穩定性",
      },
    ],
  },
  {
    date: "2025-06",
    type: "both",
    ver: "2.1.0",
    items: [
      {
        type: "new",
        content: "新功能：自動跳轉至上次使用頁面（當重新進入本系統時）",
      },
      {
        type: "new",
        content: "新功能：側邊欄加入「啟用/關閉自動跳轉至上次使用頁面」的開關",
      },
      {
        type: "update",
        content: "更新台鐵車站清單，新增「鳳鳴」車站",
      },
      {
        type: "fix",
        content: "修正側邊欄中的「開關」沒有正確顯示上次儲存狀態的問題",
      },
      {
        type: "fix",
        content: "修正桌機版選擇車站時游標沒有自動聚焦在輸入框的問題",
      },
    ],
  },
  {
    date: "2025-05",
    type: "both",
    ver: "2.0.1",
    items: [
      {
        type: "update",
        content: "調整主視覺藍色，加強顏色深度並新增點擊動畫效果",
      },
      {
        type: "update",
        content: "更新「特色介紹」頁面圖片",
      },
    ],
  },
  {
    date: "2025-02",
    type: "both",
    ver: "2.0.0",
    items: [
      {
        type: "new",
        content: "新功能：桃園捷運時刻查詢",
      },
      {
        type: "new",
        content: "新功能：即時營運通阻訊息",
      },
      {
        type: "update",
        content: "調整台鐵/高鐵切換方式，改為下拉選單形式",
      },
      {
        type: "update",
        content: "調整「更新公告」頁面排版",
      },
      {
        type: "refactor",
        content: "重構後端系統，提升效能與穩定性",
      },
    ],
  },
  {
    date: "2024-09",
    type: "both",
    ver: "1.3.0",
    items: [
      {
        type: "new",
        content: "新功能：側邊欄加入「顯示/隱藏台鐵列車註記」的開關",
      },
      {
        type: "new",
        content: "新功能：提醒特定台鐵列車的電子票證使用限制",
      },
    ],
  },
  {
    date: "2024-08",
    type: "both",
    ver: "1.2.0",
    items: [
      {
        type: "new",
        content: "新功能：列車詳細資訊一鍵截圖",
      },
      {
        type: "fix",
        content: "修正英文版台鐵時刻表在手機版的排版問題",
      },
    ],
  },
  {
    date: "2024-07",
    type: "both",
    ver: "1.1.1",
    items: [
      {
        type: "update",
        content: "移除首頁自動彈窗",
      },
      {
        type: "update",
        content: "調整桌機版廣告區塊尺寸",
      },
    ],
  },
  {
    date: "2024-07",
    type: "both",
    ver: "1.1.0",
    items: [
      {
        type: "new",
        content: "新功能：台鐵訂票導頁，可自動帶入車次資料",
      },
      {
        type: "new",
        content: "新增自動彈窗：台鐵首頁「訂票功能說明」",
      },
    ],
  },
  {
    date: "2024-07",
    type: "both",
    ver: "1.0.2",
    items: [
      {
        type: "fix",
        content: "修正「特色介紹」頁面在英文版自動跳轉中文版的問題",
      },
      {
        type: "update",
        content: "調整「更新公告」頁面顯示方式",
      },
    ],
  },
  {
    date: "2024-06",
    type: "both",
    ver: "1.0.1",
    items: [
      {
        type: "update",
        content: "「出發時間」選單改為 24 小時制",
      },
      {
        type: "update",
        content: "新增首頁下方「資料來源」說明",
      },
    ],
  },
  {
    date: "2024-06",
    type: "both",
    ver: "1.0.0",
    items: [
      {
        type: "new",
        content: "新功能：台鐵/高鐵時刻一鍵切換",
      },
      {
        type: "new",
        content: "新功能：亮色/暗色佈景一鍵切換",
      },
      {
        type: "new",
        content: "新功能：繁中/英文語言一鍵切換",
      },
      {
        type: "refactor",
        content: "重構前端系統，整合台鐵與高鐵查詢，提升使用者體驗",
      },
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
