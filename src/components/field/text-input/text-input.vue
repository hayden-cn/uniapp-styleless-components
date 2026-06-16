<template>
  <view :class="wrapperClassNames">
    <view v-if="icon" :class="[icon]"></view>
    <view v-if="readonly" :class="contentClassNames">
      {{ modelValue ?? emptyValue }}
    </view>
    <input
      v-else
      type="text"
      :class="contentClassNames"
      :value="modelValue"
      @input="handleChange"
      :placeholder="placeholder"
      :disabled="disabled"
      @focus="bindEvent('onFocus', $event)"
      @blur="bindEvent('onBlur', $event)"
    />
    <view
      v-if="showClearBtn"
      v-show="modelValue"
      :class="allowClearClassNames"
      @click="onClear"
    ></view>
  </view>
</template>

<script setup lang="ts">
import { computed, type ExtractPropTypes } from "vue";
import { useField } from "../../../hooks/useField";
import type { ClassNameValue } from "../../../type";
import { textInputProps } from "./text-input";

declare global {
  interface FieldItem {
    text: ExtractPropTypes<typeof textInputProps>;
  }
}

const props = defineProps(textInputProps);

const modelValue = defineModel<string>();

defineOptions({
  inheritAttrs: false,
});

const { wrapperClassNames, showClearBtn, allowClearClassNames, handleClear } =
  useField(props);

const contentClassNames = computed(() => {
  const classNames: ClassNameValue = ["field-content"];

  if (!modelValue.value) {
    classNames.push("field-content-empty");
  }

  if (props.disabled) {
    classNames.push("field-disabled");
  }

  return classNames;
});

const handleChange = (e: any) => {
  props.onInput?.(e);
  const value = e.detail.value;
  modelValue.value = value;
  props.onChange?.(value);
};

const onClear = () => {
  handleClear(modelValue, props.onChange);
};

type EventTarget = "onFocus" | "onBlur";

const bindEvent = (target: EventTarget, e: any) => {
  props[target]?.(e);
};
</script>

<style>
@import "../field.css";
</style>
