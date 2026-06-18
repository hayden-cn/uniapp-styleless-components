import type { ComponentObjectPropsOptions, PropType } from "vue";
import { baseProps } from "../base";

export const textareaInputProps = {
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
  /**
   * 最大长度
   */
  maxlength: {
    type: Number,
    default: 140,
  },
  /**
   * 显示字数统计
   */
  showCount: {
    type: Boolean,
  },
  /**
   * 是否自动增高输入区域
   */
  autoHeight: {
    type: Boolean,
  },
  /**
   * 指定光标与键盘的距离
   */
  cursorSpacing: {
    type: Number,
  },
} satisfies ComponentObjectPropsOptions;
