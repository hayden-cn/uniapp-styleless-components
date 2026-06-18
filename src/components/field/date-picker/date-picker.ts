import type { ComponentObjectPropsOptions, PropType } from "vue";
import { baseProps } from "../base";

export const datePickerProps = {
  ...baseProps,
  /**
   * 值改变时回调
   */
  onChange: {
    type: Function as PropType<(value: string | undefined) => void>,
  },
  /**
   * 开始日期
   */
  start: {
    type: String,
  },
  /**
   * 结束日期
   */
  end: {
    type: String,
  },
  /**
   * 日期选择器颗粒度
   */
  fields: {
    type: String as PropType<"year" | "month" | "day">,
  },
} satisfies ComponentObjectPropsOptions;
