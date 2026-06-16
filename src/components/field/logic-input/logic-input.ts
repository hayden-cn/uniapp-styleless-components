import type { ComponentObjectPropsOptions, PropType } from "vue";
import { baseProps } from "../base";

type LogicValue = string | number | boolean;

export const logicInputProps = {
  ...baseProps,
  /**
   * 值改变时回调
   */
  onChange: {
    type: Function as PropType<(value: LogicValue | undefined) => void>,
  },
  /**
   * 渲染模式
   */
  mode: {
    type: String as PropType<"switch" | "checkbox" | "radio">,
    default: "switch",
  },
  /**
   * 真值
   */
  trueValue: {
    type: [String, Number, Boolean] as PropType<LogicValue>,
    default: true,
  },
  /**
   * 真值显示文本
   */
  trueText: {
    type: String,
    default: "是",
  },
  /**
   * 假值
   */
  falseValue: {
    type: [String, Number, Boolean] as PropType<LogicValue>,
    default: false,
  },
  /**
   * 假值显示文本
   */
  falseText: {
    type: String,
    default: "否",
  },
} satisfies ComponentObjectPropsOptions;
