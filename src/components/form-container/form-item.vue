<template>
  <view :key="item.field" :class="itemClassNames" :style="itemStyles">
    <view class="form-item-relative">
      <view :class="requiredClassNames" :style="requiredStyles">*</view>

      <view :class="titleClassNames" :style="titleStyles">
        <view :class="labelClassNames" :style="labelStyles">
          <slot
            v-if="_slots[`${item.field.toString()}-label`]"
            :name="`${item.field.toString()}-label`"
          ></slot>
          <template v-else>{{ item.label }}</template>
        </view>
        <view class="form-item-label-suffix">
          <slot
            v-if="_slots[`${item.field.toString()}-label-suffix`]"
            :name="`${item.field.toString()}-label-suffix`"
          ></slot>
        </view>
      </view>

      <view
        v-if="showLabel && labelPosition === 'top'"
        class="form-item-top-spacer"
      ></view>

      <view class="form-item-row">
        <view
          v-if="showLabel && labelPosition === 'left'"
          :class="labelClassNames"
          :style="labelStyles.concat({ width: labelWidth })"
        ></view>
        <slot
          v-if="_slots[`${item.field.toString()}-prefix`]"
          :name="`${item.field.toString()}-prefix`"
        ></slot>
        <view :class="contentClassNames" :style="contentStyles">
          <view class="form-item-content-inner">
            <slot :name="item.field.toString()"></slot>
          </view>
        </view>
        <slot
          v-if="_slots[`${item.field.toString()}-suffix`]"
          :name="`${item.field.toString()}-suffix`"
        ></slot>
      </view>

      <view :class="errorMessageClassNames" :style="errorMessageStyles">
        {{ errorMessage?.message }}
      </view>
    </view>
  </view>
</template>

<script lang="ts">
/**
 * 获取指定类型的字段配置项
 */
type FieldItemWithType<T extends FieldType> = { type: T } & FieldItem[T];

/**
 * 表单字段
 */
type FormItemFieldProps = {
  [T in FieldType]: FieldItemWithType<T>;
}[FieldType];

declare global {
  /**
   * 表单项配置
   */
  type FormItemField<Data extends Record<string, any> = any> = {
    /**
     * 字段名
     */
    field: keyof Data | `_${string}`;
  } & FormItemFieldProps &
    BaseFormItem;
}
</script>

<script setup lang="ts" generic="Data extends Record<string, any> = object">
import { isNil } from "lodash-es";
import {
  computed,
  getCurrentInstance,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watch,
} from "vue";

export interface Props {
  /**
   * 表单项配置
   */
  item: FormItemField<Data>;
  /**
   * 表单配置
   */
  config: FormCommonProps;
  /**
   * 表单错误信息
   */
  errorMessage?: FormItemErrorMessage;
}

const props = withDefaults(defineProps<Props>(), {
  item: () => ({}) as FormItemField<Data>,
  config: () => ({}) as FormCommonProps,
});

defineOptions({
  inheritAttrs: false,
});

const slots = useSlots();
const attrs = useAttrs();

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};
type Slots = Mutable<ReturnType<typeof useSlots>>;

const _slots = computed(() => {
  const $field = attrs.field as string | undefined;
  const $slots = attrs.slots as Slots | undefined;
  if (!isNil($field) && $slots) {
    const slotsname = new RegExp(
      `^${$field}(-label|-label-suffix|-prefix|-suffix)?$`,
    );
    const _slots: Slots = {};
    for (const key of Object.keys($slots)) {
      if (slotsname.test(key)) {
        _slots[key] = $slots[key];
      }
    }
    return _slots;
  }
  return slots;
});

/**
 * 表单项 class
 */
const itemClassNames = computed(() => {
  const classNames: ClassNameValue = ["form-item"];

  const itemBottomBorder =
    props.item.itemBottomBorder ?? props.config.itemBottomBorder;
  if (itemBottomBorder) {
    classNames.push("form-item-border-bottom");
  }

  if (props.item.classNames?.item) {
    classNames.push(props.item.classNames.item);
  }
  if (props.config.classNames?.item) {
    classNames.push(props.config.classNames.item);
  }

  return classNames;
});

/**
 * 表单项样式
 */
const itemStyles = computed(() => {
  const style: StyleValue = {};
  const styles: StyleValue = [style];

  if (props.item.styles?.item) {
    styles.push(props.item.styles.item);
  }
  if (props.config.styles?.item) {
    styles.push(props.config.styles.item);
  }

  return styles;
});

/**
 * 必填标签 class
 */
const requiredClassNames = computed(() => {
  const classNames: ClassNameValue = ["form-item-required"];
  if (props.item.classNames?.required) {
    classNames.push(props.item.classNames.required);
  }
  if (props.config.classNames?.required) {
    classNames.push(props.config.classNames.required);
  }
  return classNames;
});

/**
 * 必填标签样式
 */
const requiredStyles = computed(() => {
  const style: StyleValue = {
    display: props.item.required ? "" : "none",
  };
  const styles: StyleValue = [style];
  if (props.item.styles?.required) {
    styles.push(props.item.styles.required);
  }
  if (props.config.styles?.required) {
    styles.push(props.config.styles.required);
  }
  return styles;
});

/**
 * 是否显示标签
 */
const showLabel = computed(() => {
  return props.item.label !== false;
});

/**
 * 表单标签位置
 */
const labelPosition = computed(
  () => props.item.labelPosition ?? props.config.labelPosition,
);

const labelWidth = ref<string>();
const updateLabelWidth = (query: UniNamespace.SelectorQuery) => {
  query
    .select(".form-item-label")
    .boundingClientRect((rect) => {
      const { width } = rect as UniApp.NodeInfo;
      labelWidth.value = width ? `${width}px` : "auto";
    })
    .exec();
};

const selectorQuery = ref<UniNamespace.SelectorQuery>();
onMounted(() => {
  const instance = getCurrentInstance()?.proxy;
  selectorQuery.value = uni.createSelectorQuery().in(instance);
  updateLabelWidth(selectorQuery.value);
});
watch(
  () => props.item.label,
  () => {
    if (selectorQuery.value) {
      updateLabelWidth(selectorQuery.value);
    }
  },
);

/**
 * 表单标题 class
 */
const titleClassNames = computed(() => {
  const classNames: ClassNameValue = ["form-item-title"];
  if (props.item.classNames?.title) {
    classNames.push(props.item.classNames.title);
  }
  if (props.config.classNames?.title) {
    classNames.push(props.config.classNames.title);
  }
  return classNames;
});

/**
 * 表单标题 style
 */
const titleStyles = computed(() => {
  const style: StyleValue = {};
  const styles: StyleValue = [style];

  if (!showLabel.value) {
    style.display = "none";
  }

  if (props.item.styles?.title) {
    styles.push(props.item.styles.title);
  }
  if (props.config.styles?.title) {
    styles.push(props.config.styles.title);
  }
  return styles;
});

/**
 * 表单标签 class
 */
const labelClassNames = computed(() => {
  const classNames: ClassNameValue = ["form-item-label"];
  if (props.item.classNames?.label) {
    classNames.push(props.item.classNames.label);
  }
  if (props.config.classNames?.label) {
    classNames.push(props.config.classNames.label);
  }
  return classNames;
});

/**
 * 表单标签样式，合并了配置属性和自定义属性
 */
const labelStyles = computed(() => {
  const style: StyleValue = {};
  const styles: StyleValue = [style];

  const width = props.item.labelWidth ?? props.config.labelWidth;
  if (width) {
    style.width = width;
  }
  const textAlign = props.item.labelAlign ?? props.config.labelAlign;
  if (textAlign) {
    style.textAlign = textAlign;
  }
  // 添加自定义样式
  if (props.item.styles?.label) {
    styles.push(props.item.styles.label);
  }
  if (props.config.styles?.label) {
    styles.push(props.config.styles.label);
  }
  return styles;
});

const contentAlign = computed(() => {
  const defaultAlign = labelPosition.value === "left" ? "right" : "left";
  return props.item.contentAlign ?? props.config.contentAlign ?? defaultAlign;
});

/**
 * 表单内容 class
 */
const contentClassNames = computed(() => {
  const classNames: ClassNameValue = ["form-item-content"];

  if (props.item.classNames?.content) {
    classNames.push(props.item.classNames.content);
  }
  if (props.config.classNames?.content) {
    classNames.push(props.config.classNames.content);
  }
  return classNames;
});

/**
 * 表单内容样式，合并了配置属性和自定义属性
 */
const contentStyles = computed(() => {
  const style: StyleValue = {
    textAlign: contentAlign.value,
  };
  const styles: StyleValue = [style];

  if (props.item.styles?.content) {
    styles.push(props.item.styles.content);
  }
  if (props.config.styles?.content) {
    styles.push(props.config.styles.content);
  }
  return styles;
});

/**
 * 错误提示信息 class
 */
const errorMessageClassNames = computed(() => {
  const classNames: ClassNameValue = ["form-item-error"];

  if (props.item.classNames?.errorMessage) {
    classNames.push(props.item.classNames.errorMessage);
  }
  if (props.config.classNames?.errorMessage) {
    classNames.push(props.config.classNames.errorMessage);
  }
  return classNames;
});

/**
 * 错误提示信息 style
 */
const errorMessageStyles = computed(() => {
  const style: StyleValue = {
    textAlign: contentAlign.value,
  };
  const styles: StyleValue = [style];

  if (props.item.styles?.errorMessage) {
    styles.push(props.item.styles.errorMessage);
  }
  if (props.config.styles?.errorMessage) {
    styles.push(props.config.styles.errorMessage);
  }
  return styles;
});
</script>

<style>
.form-item {
  position: relative;
  min-height: 3rem;
  padding: 0 1rem;
}

.form-item-border-bottom {
  border-bottom: 1px solid #e5e7eb;
}

.form-item-relative {
  position: relative;
}

.form-item-required {
  position: absolute;
  color: red;
  height: 3rem;
  display: flex;
  align-items: center;
  top: 0;
  left: -0.75rem;
}

.form-item-title {
  position: absolute;
  left: 0;
  display: flex;
  height: 3rem;
  width: 100%;
  align-items: center;
}

.form-item-label-suffix {
  flex: 1;
}

.form-item-label {
  flex-shrink: 0;
  margin-right: 0.5rem;
}

.form-item-top-spacer {
  pointer-events: none;
  height: 3rem;
}

.form-item-row {
  position: relative;
  display: flex;
  min-height: 3rem;
  width: 100%;
  align-items: center;
}

.form-item-content {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.form-item-content-inner {
  flex: 1;
  overflow: hidden;
}

.form-item-error {
  color: red;
  font-size: 0.75rem;
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
