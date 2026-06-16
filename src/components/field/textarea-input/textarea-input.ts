import type { ComponentObjectPropsOptions } from "vue";
import { baseProps } from "../base";
import { inputEventProps } from "../input-event-props";

export const textareaInputProps = {
  ...baseProps,
  ...inputEventProps,
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
