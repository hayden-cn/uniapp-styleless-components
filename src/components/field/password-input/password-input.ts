import type { ComponentObjectPropsOptions } from "vue";
import { baseProps } from "../base";
import { inputEventProps } from "../input-event-props";

export const passwordInputProps = {
  ...baseProps,
  ...inputEventProps,
  /**
   * 是否显示密码可见
   */
  showVisible: {
    type: Boolean,
  },
} satisfies ComponentObjectPropsOptions;
