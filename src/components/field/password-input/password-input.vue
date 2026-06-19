<template>
  <view :class="wrapperClassNames">
    <view v-if="icon" :class="[icon]"></view>
    <view v-if="readonly" :class="contentClassNames">
      {{ readonlyContent }}
    </view>
    <input
      v-else
      :type="checkPassword ? 'text' : 'password'"
      :value="modelValue"
      :password="!checkPassword"
      @input="handleChange"
      :class="contentClassNames"
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
    <view
      v-if="showVisibleBtn"
      :class="showVisibleClassNames"
      @click="handleToggle"
    ></view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useField } from "../../../hooks/useField";
import type { ClassNameValue } from "../../../types";
import { passwordInputProps } from "./password-input";

const props = defineProps(passwordInputProps);

const modelValue = defineModel<string>();

defineOptions({
  inheritAttrs: false,
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

const { wrapperClassNames, showClearBtn, allowClearClassNames, handleClear } =
  useField(props);

const contentClassNames = computed(() => {
  const classNames: ClassNameValue = ["field-content"];

  if (props.readonly) {
    classNames.push("field-content-readonly-hidden");
  }

  if (props.readonly && !checkPassword.value) {
    classNames.push("field-content-shift-y");
  }

  if (props.disabled) {
    classNames.push("field-disabled");
  }

  return classNames;
});

const showVisibleBtn = computed(() => {
  return modelValue.value && props.showVisible;
});

const showVisibleClassNames = computed(() => {
  const classNames: ClassNameValue = ["field-clear-icon"];
  if (checkPassword.value) {
    classNames.push("field-eye-icon");
  } else {
    classNames.push("field-eye-closed-icon");
  }
  return classNames;
});

const handleChange = (e: any) => {
  props.onInput?.(e);
  const val = e.detail.value;
  modelValue.value = val;
  props.onChange?.(val);
};

const onClear = () => {
  handleClear(modelValue, props.onChange);
};

type EventTarget = "onFocus" | "onBlur";

const bindEvent = (target: EventTarget, e: any) => {
  props[target]?.(e);
};

const checkPassword = ref(false);

const readonlyContent = computed(() => {
  const value = modelValue.value;

  if (!value || value.length === 0) {
    return props.emptyValue;
  }

  if (checkPassword.value) {
    return value;
  }

  return "*".repeat(value.length);
});

const handleToggle = () => {
  checkPassword.value = !checkPassword.value;
};
</script>

<style>
.field-content-readonly-hidden {
  overflow-y: hidden;
}

.field-content-shift-y {
  transform: translateY(0.25rem);
}

.field-eye-icon {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0M21 12c-2.4 4-5.4 6-9 6c-3.6 0-6.6-2-9-6c2.4-4 5.4-6 9-6c3.6 0 6.6 2 9 6'/%3E%3C/svg%3E");
  mask: var(--un-icon) no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
}

.field-eye-closed-icon {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10.585 10.585a2 2 0 1 0 2.829 2.829M16.248 16.249A9.993 9.993 0 0 1 12 18c-3.6 0-6.6-2-9-6c1.016-1.662 2.355-3.221 4-4.44M2 2l20 20M8.5 8.563a9.969 9.969 0 0 0 3.434 3.435M12 6c3.6 0 6.6 2 9 6c-.676 1.112-1.448 2.145-2.312 3.086'/%3E%3C/svg%3E");
  mask: var(--un-icon) no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
}
</style>
