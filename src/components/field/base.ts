import type { ComponentObjectPropsOptions, PropType } from "vue";

export const baseProps = {
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
  },
  /**
   * 是否只读
   */
  readonly: {
    type: Boolean,
  },
  /**
   * 只读模式下，当值为空时的占位符
   */
  emptyValue: {
    type: String,
  },
  /**
   * 提示文字
   */
  placeholder: {
    type: String,
  },
  /**
   * 同一表单或同一行的数据信息
   */
  fieldData: {
    type: Object as PropType<Record<string, any>>,
  },
  /**
   * 图标
   */
  icon: {
    type: String,
  },
  /**
   * 是否显示清除按钮
   */
  allowClear: {
    type: Boolean,
  },
  /**
   * 值改变时回调
   */
  onChange: {
    type: Function as PropType<(value: any) => void>,
  },
} satisfies ComponentObjectPropsOptions;
