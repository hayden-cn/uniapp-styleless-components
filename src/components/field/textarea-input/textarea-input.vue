<template>
  <view :class="wrapperClassNames">
    <view v-if="readonly" :class="readonlyClassNames">
      {{ modelValue ?? emptyValue }}
    </view>
    <view v-else :class="editorWrapperClassNames">
      <textarea
        :value="modelValue"
        @input="handleChange"
        :class="contentClassNames"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :auto-height="autoHeight"
        :cursor-spacing="cursorSpacing"
        @focus="bindEvent('onFocus', $event)"
        @blur="bindEvent('onBlur', $event)"
      ></textarea>
      <view :class="footerBarClassNames">
        <view v-if="showCount" :class="countClassNames">
          {{ modelValue?.length ?? 0 }} / {{ maxlength }}
        </view>
        <view
          v-if="showClearBtn"
          v-show="modelValue"
          :class="allowClearClassNames"
          @click="onClear"
        ></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, type ExtractPropTypes } from "vue";
import { useField } from "../../../hooks/useField";
import type { ClassNameValue } from "../../../type";
import { textareaInputProps } from "./textarea-input";

declare global {
  interface FieldItem {
    textarea: ExtractPropTypes<typeof textareaInputProps>;
  }
}

const props = defineProps(textareaInputProps);

const modelValue = defineModel<string>();

defineOptions({
  inheritAttrs: false,
});

const { wrapperClassNames, showClearBtn, allowClearClassNames, handleClear } =
  useField(props);

const readonlyClassNames = computed(() => {
  const classNames: ClassNameValue = ["textarea-readonly"];
  return classNames;
});

const editorWrapperClassNames = computed(() => {
  const classNames: ClassNameValue = ["textarea-editor"];
  return classNames;
});

const contentClassNames = computed(() => {
  const classNames: ClassNameValue = ["textarea-content"];

  if (props.disabled) {
    classNames.push("field-disabled");
  }

  return classNames;
});

const footerBarClassNames = computed(() => {
  const classNames: ClassNameValue = ["textarea-footer"];
  return classNames;
});

const countClassNames = computed(() => {
  const classNames: ClassNameValue = ["textarea-count"];
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

.textarea-readonly {
  word-break: break-all;
  padding: 0.75rem 0;
}

.textarea-editor {
  position: relative;
  width: 100%;
  padding: 0.75rem 0;
}

.textarea-content {
  width: 100%;
}

.textarea-footer {
  color: gray;
  position: absolute;
  bottom: 0.75rem;
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.textarea-count {
  pointer-events: none;
}
</style>
