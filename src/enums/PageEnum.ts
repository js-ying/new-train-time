export enum PageEnum {
  TR = "tr",
  THSR = "thsr",
  TYMC = "tymc",
  FEATURES = "features",
  UPDATES = "updates",
  PRIVACY = "privacy",
  TERMS = "terms",
}

// 非交通工具頁面：不會有 Search，homePath 會 fallback 回台鐵首頁
export const notTransportPage = [
  PageEnum.FEATURES,
  PageEnum.UPDATES,
  PageEnum.PRIVACY,
  PageEnum.TERMS,
];
