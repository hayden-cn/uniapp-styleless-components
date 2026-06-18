<template>
  <button
    :class="buttonClassNames"
    :styles="buttonStyles"
    :size="size"
    :disabled="disabled"
    :hover-class="hoverClass"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    :open-type="openType"
    @click="bindtap('click', $event)"
    @getphonenumber="bindtap('getphonenumber', $event)"
    @getuserinfo="bindtap('getuserinfo', $event)"
    @error="bindtap('error', $event)"
    @opensetting="bindtap('opensetting', $event)"
    @launchapp="bindtap('launchapp', $event)"
    @contact="bindtap('contact', $event)"
    @chooseavatar="bindtap('chooseavatar', $event)"
  >
    <view class="flex h-full w-full items-center justify-center gap-2">
      <text
        v-show="icon || loading"
        :class="buttonIconClassNames"
        :style="buttonIconStyles"
      ></text>
      <text v-if="label || $slots.default" class="whitespace-nowrap">
        <slot>{{ label }}</slot>
      </text>
    </view>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {
  ButtonColorType,
  ButtonOpenActionType,
  ButtonShapeType,
  ButtonType,
  ButtonVariantType,
  ClassNameValue,
  ComponentSize,
  Semantic,
  StyleValue,
} from "@/types";

interface Props {
  /**
   * 设置按钮的颜色
   */
  color?: ButtonColorType;
  /**
   * 设置按钮的变体
   */
  variant?: ButtonVariantType;
  /**
   * 预设样式：主按钮、次按钮、虚线按钮、文本按钮和链接按钮。
   *
   * color 与 variant 的语法糖，当设置 color 与 variant 时以后者为准
   */
  type?: ButtonType;
  /**
   * color 的语法糖，当设置 color 时以后者为准
   */
  danger?: boolean;
  /**
   * 设置按钮大小
   */
  size?: ComponentSize;
  /**
   * 设置按钮形状
   */
  shape?: ButtonShapeType;
  /**
   * 幽灵属性，使按钮背景透明
   */
  ghost?: boolean;
  /**
   * 设置按钮文字，当设置 children 时以后者为准
   */
  label?: string;
  /**
   * 设置按钮载入状态
   */
  loading?: boolean;
  /**
   * 使用 classname icon 设置载入图标
   */
  loadingIcon?: string;
  /**
   * 使用 classname icon 设置按钮的图标
   */
  icon?: string;
  /**
   * 禁用按钮
   */
  disabled?: boolean;
  /**
   * 指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果
   */
  hoverClass?: string;
  /**
   * 按住后多久出现点击态，单位毫秒，默认 0
   */
  hoverStartTime?: number;
  /**
   * 手指松开后点击态保留时间，单位毫秒，默认 200
   */
  hoverStayTime?: number;
  /**
   * 开放能力，小程序和公众号内有效
   *
   * @see https://developers.weixin.qq.com/miniprogram/dev/component/button.html
   */
  openType?: ButtonOpenActionType;
  /**
   * 语义化结构 class
   */
  classNames?: Semantic<SemanticDOM, ClassNameValue>;
  /**
   * 语义化结构 style
   */
  styles?: Semantic<SemanticDOM, StyleValue>;
}

type SemanticDOM = "root" | "icon" | "label" | "loading";

const props = withDefaults(defineProps<Props>(), {
  type: "default",
  size: "medium",
  shape: "default",
  hoverClass: "none",
  hoverStartTime: 0,
  hoverStayTime: 200,
});

defineOptions({
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

type Emit = {
  click: [event: PointerEvent];
  getphonenumber: [event: PointerEvent];
  getuserinfo: [event: PointerEvent];
  error: [event: PointerEvent];
  opensetting: [event: PointerEvent];
  launchapp: [event: PointerEvent];
  contact: [event: PointerEvent];
  chooseavatar: [event: PointerEvent];
};

const emit = defineEmits<Emit>();

/**
 * 按钮图标 class
 */
const buttonIconClassNames = computed(() => {
  const classNames: ClassNameValue = [];
  if (props.loading) {
    classNames.push("btn-spinning");
    classNames.push(props.loadingIcon || "btn-loading");
    classNames.push(props.classNames?.loading);
  } else if (props.icon) {
    classNames.push(props.icon);
    classNames.push(props.classNames?.icon);
  }
  return classNames;
});

/**
 * 按钮图标 style
 */
const buttonIconStyles = computed(() => {
  const style: StyleValue = { fontSize: "1.2em" };
  const styles: StyleValue = [style];

  if (props.loading && props.styles?.loading) {
    styles.push(props.styles.loading);
  } else if (props.icon && props.styles?.icon) {
    styles.push(props.styles.icon);
  }

  return styles;
});

/**
 * 解析按钮颜色和变体
 */
const resolvedColorAndVariant = computed(() => {
  let { color, variant, danger, type } = props;

  interface TypeLegacyItem {
    color: Props["color"];
    variant: Props["variant"];
  }

  type LegacyType = NonNullable<Props["type"]>;

  const typeLegacyMap: Record<LegacyType, TypeLegacyItem> = {
    default: { color: "default", variant: "outlined" },
    primary: { color: "primary", variant: "solid" },
    dashed: { color: "default", variant: "dashed" },
    text: { color: "default", variant: "text" },
    link: { color: "primary", variant: "link" },
  };

  color ||= danger ? "danger" : undefined;
  color ||= type ? typeLegacyMap[type]?.color : undefined;

  if (color === "default") {
    color = "black";
  }

  variant = variant || (type ? typeLegacyMap[type]?.variant : "filled");

  return { color, variant };
});

/**
 * 按钮 class
 */
const buttonClassNames = computed(() => {
  let { shape, size, disabled } = props;
  const classNames: ClassNameValue = ["btn"];

  // 设置按钮大小
  if (size) {
    classNames.push(`btn-${size}`);
  }

  // 禁用按钮
  if (disabled) {
    classNames.push("btn-disabled");
  }

  // 设置按钮载入状态
  if (props.loading) {
    classNames.push("btn-loading");
  }

  // 幽灵属性，使按钮背景透明
  if (props.ghost) {
    classNames.push("btn-ghost");
  }

  // 设置按钮样式
  if (shape) {
    classNames.push(`btn-shape-${shape}`);
  }

  // 设置按钮颜色及变体
  classNames.push(`btn-color-${resolvedColorAndVariant.value.color}`);
  classNames.push(`btn-variant-${resolvedColorAndVariant.value.variant}`);

  // 添加自定义样式
  if (props.classNames?.root) {
    classNames.push(props.classNames.root);
  }

  return classNames;
});

/**
 * 按钮 style
 */
const buttonStyles = computed(() => {
  const styles: StyleValue = [];

  let { color, variant } = resolvedColorAndVariant.value;

  if (color) {
    /**
     * 对颜色进行突变
     */
    const m = (original: string, mutation: string) => {
      return color === original ? mutation : color;
    };

    if (variant === "solid") {
      styles.push({
        "--btn-color": `white`,
        "--btn-bg-color": `--color-${color}`,
        "--btn-border-color": `--color-${color}`,
        "--btn-active-bg-color": `--color-${color}-light`,
        "--btn-active-border-color": `--color-${color}-light`,
      });
    }

    if (variant === "outlined") {
      styles.push({
        "--btn-color": `--color-${color}`,
        "--btn-bg-color": `white`,
        "--btn-border-color": `--color-${m("black", "gray")}`,
        "--btn-active-color": `--color-${m("black", "primary")}`,
        "--btn-active-bg-color": `--color-${m("black", "primary")}`,
      });
    }

    if (variant === "dashed") {
      styles.push({
        "--btn-color": `--color-${color}`,
        "--btn-bg-color": `white`,
        "--btn-border-color": `--color-${m("black", "gray")}`,
        "--btn-border-style": `dashed`,
        "--btn-active-color": `--color-${m("black", "primary")}`,
        "--btn-active-border-color": `--color-${m("black", "primary")}`,
      });
    }

    if (variant === "filled") {
      styles.push({
        "--btn-color": `--color-${color}`,
        "--btn-bg-color": `--color-${color}/10`,
        "--btn-border-color": `transparent`,
        "--btn-active-color": `--color-${color}-light`,
        "--btn-active-bg-color": `--color-${color}/50`,
      });
    }

    if (variant === "text") {
      styles.push({
        "--btn-color": `--color-${color}`,
        "--btn-bg-color": `transparent`,
        "--btn-border-color": `transparent`,
        "--btn-active-bg-color": `--color-${color}/50`,
      });
    }

    if (variant === "link") {
      styles.push({
        "--btn-color": `--color-${color}`,
        "--btn-bg-color": `transparent`,
        "--btn-border-color": `transparent`,
        "--btn-active-color": `--color-${m("black", "primary")}`,
      });
    }
  }

  if (props.styles?.root) {
    styles.push(props.styles.root);
  }

  return styles;
});

const bindtap = (type: keyof Emit, event: any) => {
  if (!props.loading) {
    emit(type as any, event);
  }
};
</script>

<style>
button.btn {
  --btn-control-height: 3rem;
  display: block;
  line-height: var(--btn-line-height);
  font-size: var(--btn-font-size);
  padding: var(--btn-padding);
  color: var(--btn-color);
  background-color: var(--btn-bg-color);
  height: var(--btn-control-height);
  min-width: var(--btn-control-height);
  border-radius: var(--btn-border-radius);
  &::after {
    width: 100%;
    height: 100%;
    transform: scale(1);
    border-style: var(--btn-border-style);
    border-color: var(--btn-border-color);
    border-width: var(--btn-border-width, 1px);
    border-radius: var(--btn-border-radius);
  }
  &.active,
  &:active {
    color: var(--btn-active-color);
    background-color: var(--btn-active-bg-color);
    &::after {
      border-color: var(--btn-active-border-color);
    }
  }
}

button.btn-mini {
  --btn-control-height: 2rem;
  --btn-line-height: 2.1;
  --btn-font-size: 15px;
  --btn-padding: 0 0.44em;
}

button.btn-small {
  --btn-control-height: 2.5rem;
  --btn-line-height: 2.4;
  --btn-font-size: 15px;
  --btn-padding: 0 0.84em;
}

button.btn-large {
  --btn-control-height: 3.5rem;
  --btn-line-height: 2.6;
  --btn-font-size: 21px;
  --btn-padding: 0 1.24em;
}

button.btn-disabled {
  --btn-border-color: rgba(0, 0, 0, 0.3);
  opacity: 0.5;
}

button.btn-icon-only {
  width: var(--btn-control-height);
  --btn-padding: 0 0.2em;
}

button.btn-loading {
  opacity: 0.5;
}

button.btn-shape-default {
  --btn-border-radius: 0.25rem;
}

button.btn-shape-circle {
  --btn-border-radius: 9999px;
}

button.btn-shape-round {
  --btn-border-radius: 0.5rem;
}

button.btn-ghost {
  --btn-bg-color: transparent;
}

button .btn-spinning {
  animation: spinning 1s linear infinite;
}

@keyframes spinning {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

button .btn-loading {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 3a9 9 0 1 0 9 9'/%3E%3C/svg%3E");
  mask: var(--un-icon) no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: inherit;
  width: 1em;
  height: 1em;
}
</style>
