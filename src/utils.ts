import { SilenceError } from "./errors";

export const stringifyQueryParams = (params: Record<string, any>) => {
  const results: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    const parsed = typeof value === "object" ? JSON.stringify(value) : value;
    results.push(`${key}=${parsed}`);
  }
  return results.join("&");
};

const getErrorMessage = (err: unknown, defaultMsg = "未知错误") => {
  const errMsg = err instanceof Error ? err.message : String(err);
  return errMsg || defaultMsg;
};

export const toastError = async (err: unknown, defaultMsg = "未知错误") => {
  if (err instanceof SilenceError) {
    return;
  }
  const title = getErrorMessage(err, defaultMsg);
  const size = title.replace(/[\u4e00-\u9fa5]/g, "**").length;
  const icon = size > 14 ? "none" : "error";
  await uni.showToast({
    title: title,
    icon: icon,
    duration: 3000,
  });
};

export const toastSuccess = async (msg: string) => {
  await uni.showToast({
    title: msg,
    icon: "success",
    duration: 2000,
  });
};

export const toastConfirm = async (msg: string) => {
  return uni.showModal({
    title: "提示",
    content: msg,
  });
};

export const toastWarning = async (msg: string) => {
  return uni.showModal({
    title: "警告",
    content: msg,
    showCancel: false,
  });
};
