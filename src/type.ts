import type { StyleValue as VueStyleValue } from "vue";

/**
 * Style CSSproperties
 */
export type StyleValue = VueStyleValue;

/**
 * ClassName 基础类型
 */
export type ClassNameBaseType = string | false | undefined | null;

/**
 * ClassName 对象类型
 */
export type ClassNameRecord = Record<string, boolean>;

/**
 * ClassName 数组类型
 */
export type ClassNameArray = Array<ClassNameValue>;

/**
 * ClassName
 */
export type ClassNameValue =
  | ClassNameBaseType
  | ClassNameRecord
  | ClassNameArray;

/**
 * 语义化对象
 */
export type Semantic<S extends PropertyKey, V, R = false> = R extends true
  ? Record<S, V>
  : Partial<Record<S, V>>;

/**
 * 组件尺寸
 */
export type ComponentSize = "mini" | "small" | "medium" | "large";

/**
 * 文本对齐方式
 */
export type TextAlignType = "left" | "center" | "right";

/**
 * 按钮预设样式
 */
export type ButtonType = "primary" | "dashed" | "link" | "text" | "default";

/**
 * 按钮颜色
 */
export type ButtonColorType = "default" | "none" | string;

/**
 * 按钮变体类型
 */
export type ButtonVariantType =
  | "outlined"
  | "dashed"
  | "solid"
  | "filled"
  | "text"
  | "link";

/**
 * 按钮形状
 */
export type ButtonShapeType = "default" | "circle" | "round";

/**
 * 小程序开发能力
 *
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/button.html
 */
export type ButtonOpenActionType =
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
