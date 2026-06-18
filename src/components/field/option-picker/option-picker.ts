import type { ComponentObjectPropsOptions, PropType } from "vue";
import { baseProps } from "../base";

type Value = string | number;

type OptionItem = {
  label: string;
  value: Value;
};

export const optionPickerProps = {
  ...baseProps,
  /**
   * 值改变时回调
   */
  onChange: {
    type: Function as PropType<(value: Value | undefined) => void>,
  },
  /**
   * 选项
   */
  options: {
    type: Array as PropType<OptionItem[]>,
    default: () => [],
  },
} satisfies ComponentObjectPropsOptions;
