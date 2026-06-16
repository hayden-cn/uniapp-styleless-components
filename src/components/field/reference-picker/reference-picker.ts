import type { ComponentObjectPropsOptions, PropType } from "vue";
import { baseProps } from "../base";
import type { textInputProps } from "../text-input/text-input";

/**
 * 参照字段
 */
interface ReferenceFieldProps {
  id?: string;
  code?: string;
  name?: string;
}

/**
 * 通过 url 查询参数透传的设置
 */
interface ReferenceParameters {
  title?: string;
  multiple?: boolean;
  multipleMode?: "array" | "comma";
  multipleMax?: number;
  defaultProps?: ReferenceFieldProps;
  showSearch?: boolean;
}

/**
 * 通过 event channel 透传的设置
 */
interface ReferenceOptions {
  dataSource?: string;
  queryParams?: Record<string, any>;
  requestMethod?: "get" | "post";
  requestOptions?: Record<string, any>;
  searchOptions?: FieldItem["text"] & {
    field?: string;
  };
  listOptions?: GlobalConfig["listContainerHook"];
}

declare global {
  /**
   * 通过 url 查询参数透传的设置
   */
  type PageReferenceParameters = Required<ReferenceParameters> & {
    scene: "reference" | string;
    field: string;
  };
  /**
   * 通过 event channel 透传的设置
   */
  type PageReferenceOptions = Required<ReferenceOptions> & {
    value: Record<string, any>[];
  };
}

export const referencePickerProps = {
  ...baseProps,
  /**
   * 值改变时回调
   */
  onChange: {
    type: Function as PropType<
      (
        value: string | string[] | undefined,
        items: Record<string, any>[],
      ) => void
    >,
  },
  /**
   * 参照页面地址
   */
  referencePageUrl: {
    type: String,
    default: "/pages/common/reference",
  },
  /**
   * 字段名
   */
  field: {
    type: String,
    required: true,
  },
  /**
   * 如何从 fieldData 中获取参照字段编码，默认为 field + 'Code'
   */
  fieldCode: {
    type: [String, Function] as PropType<string | ((field: string) => string)>,
  },
  /**
   * 如何从 fieldData 中获取参照字段名称，默认为 field + 'Name'
   */
  fieldName: {
    type: [String, Function] as PropType<string | ((field: string) => string)>,
  },
  /**
   * 自定义解析值
   */
  parseValue: {
    type: Function as PropType<
      (
        value: string | string[] | undefined,
        fieldData: Record<string, any>,
      ) => Record<string, any>[]
    >,
  },
  /**
   * 参照页面标题
   */
  title: {
    type: String,
    default: "参照",
  },
  /**
   * 是否多选
   */
  multiple: {
    type: Boolean,
    default: false,
  },
  /**
   * 多选模式下，值的存储形式
   */
  multipleMode: {
    type: String as PropType<"array" | "comma">,
    default: "array",
  },
  /**
   * 多选模式下，最多可选择的个数，不填或者填 0 则不限制
   */
  multipleMax: {
    type: Number,
    default: 0,
  },
  /**
   * 参照字段映射，用于改变非标准参照字段名称
   */
  defaultProps: {
    type: Object as PropType<ReferenceFieldProps>,
    default: () => ({ id: "id", code: "code", name: "name" }),
  },
  /**
   * 是否显示搜索框
   */
  showSearch: {
    type: Boolean,
    default: false,
  },
  /**
   * 数据源
   */
  dataSource: {
    type: String,
  },
  /**
   * 自定义查询参数
   */
  queryParams: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  /**
   * 请求方式
   */
  requestMethod: {
    type: String as PropType<"get" | "post">,
    default: "get",
  },
  /**
   * 请求透传参数
   */
  requestOptions: {
    type: Object as PropType<Record<string, any>>,
  },
  /**
   * 查询组件参数透传
   */
  searchOptions: {
    type: Object as PropType<
      ExtractPropTypes<typeof textInputProps> & { field?: string }
    >,
  },
  /**
   * 列表组件参数透传
   */
  listOptions: {
    type: Object as PropType<Record<string, any>>,
  },
} satisfies ComponentObjectPropsOptions;
