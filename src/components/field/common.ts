import type { ExtractPropTypes } from "vue";
import type { datePickerProps } from "./date-picker/date-picker";
import type { logicInputProps } from "./logic-input/logic-input";
import type { numberInputProps } from "./number-input/number-input";
import type { optionPickerProps } from "./option-picker/option-picker";
import type { passwordInputProps } from "./password-input/password-input";
import type { referencePickerProps } from "./reference-picker/reference-picker";
import type { textInputProps } from "./text-input/text-input";
import type { textareaInputProps } from "./textarea-input/textarea-input";

export interface FieldItem {
  /**
   * 文本
   */
  text: ExtractPropTypes<typeof textInputProps>;
  /**
   * 大文本
   */
  textarea: ExtractPropTypes<typeof textareaInputProps>;
  /**
   * 数字
   */
  number: ExtractPropTypes<typeof numberInputProps>;
  /**
   * 密码
   */
  password: ExtractPropTypes<typeof passwordInputProps>;
  /**
   * 逻辑值
   */
  logic: ExtractPropTypes<typeof logicInputProps>;
  /**
   * 日期
   */
  date: ExtractPropTypes<typeof datePickerProps>;
  /**
   * 选项
   */
  option: ExtractPropTypes<typeof optionPickerProps>;
  /**
   * 参照
   */
  reference: ExtractPropTypes<typeof referencePickerProps>;
  /**
   * 定义一个空类型，用于表示一个空字段或者自定义字段
   *
   * @alias custom
   */
  empty: Record<string, any>;
  /**
   * 自定义字段
   */
  custom: Record<string, any>;
}

export type FieldType = Prettify<keyof FieldItem>;
