import type { StyleValue as VueStyleValue } from "vue";

declare global {
  /**
   * Style CSSproperties
   */
  type StyleValue = VueStyleValue;

  /**
   * ClassName 基础类型
   */
  type ClassNameBaseType = string | false | undefined | null;

  /**
   * ClassName 对象类型
   */
  type ClassNameRecord = Record<string, boolean>;

  /**
   * ClassName 数组类型
   */
  type ClassNameArray = Array<ClassNameValue>;

  /**
   * ClassName
   */
  type ClassNameValue = ClassNameBaseType | ClassNameRecord | ClassNameArray;

  /**
   * 语义化对象
   */
  type Semantic<S extends PropertyKey, V, R = false> = R extends true
    ? Record<S, V>
    : Partial<Record<S, V>>;

  /**
   * 组件尺寸
   */
  type ComponentSize = "mini" | "small" | "medium" | "large";

  /**
   * 文本对齐方式
   */
  type TextAlignType = "left" | "center" | "right";

  /**
   * 按钮预设样式
   */
  type ButtonType = "primary" | "dashed" | "link" | "text" | "default";

  /**
   * 按钮颜色
   */
  type ButtonColorType = "default" | "none" | string;

  /**
   * 按钮变体类型
   */
  type ButtonVariantType =
    | "outlined"
    | "dashed"
    | "solid"
    | "filled"
    | "text"
    | "link";

  /**
   * 按钮形状
   */
  type ButtonShapeType = "default" | "circle" | "round";

  /**
   * 小程序开发能力
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/component/button.html
   */
  type ButtonOpenActionType =
    | "contact"
    | "liveActivity"
    | "share"
    | "getPhoneNumber"
    | "getRealtimePhoneNumber"
    | "getUserInfo"
    | "launchApp"
    | "openSetting"
    | "feedback"
    | "chooseAvatar"
    | "agreePrivacyAuthorization";
}
