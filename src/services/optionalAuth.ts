/**
 * 公開查詢 API 的選擇性登入 header。
 * 動態 import userApi。
 */
export const optionalAuthHeader = async (): Promise<Record<string, string>> => {
  const { getOptionalAuthHeader } = await import("./userApi");
  return getOptionalAuthHeader();
};
