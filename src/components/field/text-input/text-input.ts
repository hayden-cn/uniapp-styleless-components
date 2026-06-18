import type { ComponentObjectPropsOptions, PropType } from "vue";
import { baseProps } from "../base";

export const textInputProps = {
  ...baseProps,
  /**
   * 值改变时回调
   */
  onChange: {
    type: Function as PropType<(value: string | undefined) => void>,
  },
  /**
   * 输入时回调
   */
  onInput: {
    type: Function as PropType<(event: PointerEvent) => void>,
  },
  /**
   * 获取焦点时回调
   */
  onFocus: {
    type: Function as PropType<(event: PointerEvent) => void>,
  },
  /**
   * 失去焦点时回调
   */
  onBlur: {
    type: Function as PropType<(event: PointerEvent) => void>,
  },
} satisfies ComponentObjectPropsOptions;
