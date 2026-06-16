import { SilenceError } from "./errors";

type Many<T> = T | readonly T[];

const isPlainObject = (value: any): value is Record<string, any> => {
  return value != null && typeof value === "object" && !Array.isArray(value);
};

export const stringifyQueryParams = (params: Record<string, any>) => {
  const results: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    const parsed = typeof value === "object" ? JSON.stringify(value) : value;
    results.push(`${key}=${parsed}`);
  }
  return results.join("&");
};

export const defaultsDeep = (object: any, ...sources: any[]): any => {
  for (const source of sources) {
    if (!isPlainObject(source)) {
      continue;
    }
    for (const key of Object.keys(source)) {
      const sourceVal = source[key];
      const targetVal = object[key];
      if (isPlainObject(sourceVal)) {
        object[key] = defaultsDeep(
          isPlainObject(targetVal) ? targetVal : {},
          sourceVal,
        );
      } else if (targetVal === undefined) {
        object[key] = sourceVal;
      }
    }
  }
  return object;
};

export const cloneDeep = <T>(value: T): T => {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as T;
  }
  const result = {} as T;
  for (const key in value) {
    if (Object.hasOwn(value, key)) {
      result[key] = cloneDeep((value as any)[key]);
    }
  }
  return result;
};

export const isNil = <T>(value: T): value is T & (null | undefined) => {
  return value === null || value === undefined;
};

export const omit = <T extends object, K extends keyof T>(
  object: T | null | undefined,
  ...paths: K[]
): Omit<T, K> => {
  if (object == null) {
    return {} as Omit<T, K>;
  }
  const result = { ...object };
  for (const path of paths) {
    delete result[path];
  }
  return result as Omit<T, K>;
};

export const pick = <T extends object, U extends keyof T>(
  object: T,
  ...paths: Array<Many<U>>
): Pick<T, U> => {
  const result: any = {};
  const flatPaths = paths.flat();
  for (const path of flatPaths) {
    const key = path as keyof T;
    if (key in object) {
      result[key] = object[key];
    }
  }
  return result;
};

type ListIteratee<T> = (value: T, index: number, array: T[]) => boolean;

export const remove = <T>(array: T[], predicate: ListIteratee<T>): T[] => {
  const removed: T[] = [];
  let i = array.length;
  while (i--) {
    if (predicate(array[i], i, array)) {
      removed.push(array.splice(i, 1)[0]);
    }
  }
  return removed;
};

interface DebounceSettings {
  /**
   * @see _.leading
   */
  leading?: boolean | undefined;
  /**
   * @see _.maxWait
   */
  maxWait?: number | undefined;
  /**
   * @see _.trailing
   */
  trailing?: boolean | undefined;
}

interface DebouncedFunc<T extends (...args: any[]) => any> {
  /**
   * Call the original function, but applying the debounce rules.
   *
   * If the debounced function can be run immediately, this calls it and returns its return
   * value.
   *
   * Otherwise, it returns the return value of the last invocation, or undefined if the debounced
   * function was not invoked yet.
   */
  (...args: Parameters<T>): ReturnType<T> | undefined;

  /**
   * Throw away any pending invocation of the debounced function.
   */
  cancel(): void;

  /**
   * If there is a pending invocation of the debounced function, invoke it immediately and return
   * its return value.
   *
   * Otherwise, return the value from the last invocation, or undefined if the debounced function
   * was never invoked.
   */
  flush(): ReturnType<T> | undefined;
}

export const debounce = <T extends (...args: any) => any>(
  func: T,
  wait: number = 0,
  options: DebounceSettings = {},
): DebouncedFunc<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastResult: ReturnType<T> | undefined;
  const { leading = false, trailing = true, maxWait } = options;
  const maxWaitMs = maxWait != null ? Math.max(maxWait, wait) : undefined;
  let lastInvokeTime = 0;

  const invoke = (time: number, args: Parameters<T>) => {
    lastInvokeTime = time;
    lastResult = func.apply(null, args);
    return lastResult;
  };

  const timerExpired = () => {
    const now = Date.now();
    if (maxWaitMs !== undefined && now - lastInvokeTime >= maxWaitMs) {
      if (lastArgs) {
        return invoke(now, lastArgs);
      }
    }
    if (trailing && lastArgs) {
      return invoke(now, lastArgs);
    }
    lastArgs = null;
    timeoutId = null;
  };

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastInvokeTime = 0;
    lastArgs = null;
  };

  const flush = () => {
    if (timeoutId !== null && lastArgs) {
      const result = invoke(Date.now(), lastArgs);
      cancel();
      return result;
    }
    return lastResult;
  };

  const debounced = function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const isInvoking = shouldInvoke(now);

    lastArgs = args;

    if (isInvoking && timeoutId === null) {
      if (leading) {
        return invoke(now, args);
      }
    }

    if (maxWaitMs !== undefined) {
      timeoutId = setTimeout(timerExpired, wait);
      return lastResult;
    }

    if (trailing) {
      timeoutId = setTimeout(timerExpired, wait);
    }
    return lastResult;
  } as DebouncedFunc<T>;

  const shouldInvoke = (time: number) => {
    const timeSinceLastInvoke = time - lastInvokeTime;
    return (
      lastInvokeTime === 0 ||
      timeSinceLastInvoke >= wait ||
      timeSinceLastInvoke < 0
    );
  };

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
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
