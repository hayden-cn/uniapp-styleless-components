import type { ComponentObjectPropsOptions } from "vue";
import { baseProps } from "../base";
import { inputEventProps } from "../input-event-props";

export const numberInputProps = {
  ...baseProps,
  ...inputEventProps,
  /**
   * 是否允许输入小数
   */
  decimal: {
    type: Boolean,
  },
} satisfies ComponentObjectPropsOptions;
