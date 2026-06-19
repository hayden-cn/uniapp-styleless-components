<template>
  <view :class="wrapperClassNames">
    <text v-if="readonly" :class="contentClassNames">{{ renderedValue }}</text>
    <view v-else :class="contentClassNames" @click="handleChange">
      <view :class="inputClassNames.wrapper">
        <view :class="inputClassNames.inner"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { logicInputProps } from "./logic-input";

type LogicValue = string | number | boolean;

const props = defineProps(logicInputProps);

const modelValue = defineModel<LogicValue>();

defineOptions({
  inheritAttrs: false,
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

const checked = computed(() => {
  return modelValue.value === props.trueValue;
});

const renderedValue = computed(() => {
  return checked.value ? props.trueText : props.falseText;
});

const wrapperClassNames = computed(() => {
  const classNames: ClassNameValue = ["logic"];

  if (props.disabled) {
    classNames.push("field-disabled");
  }

  return classNames;
});

const contentClassNames = computed(() => {
  const classNames: ClassNameValue = ["logic-content"];

  if (props.disabled) {
    classNames.push("field-disabled");
  }

  return classNames;
});

const inputClassNames = computed(() => {
  const wrapper: ClassNameValue = ["logic-switch"];
  const inner: ClassNameValue = ["logic-switch-inner"];

  if (props.mode === "switch") {
    wrapper.push("logic-switch-track");
    inner.push("logic-switch-thumb");

    if (checked.value) {
      wrapper.push("logic-switch-track-active");
      inner.push("logic-switch-thumb-active");
    } else {
      inner.push("logic-switch-thumb-inactive");
    }
  } else if (props.mode === "checkbox") {
    wrapper.push("logic-checkbox");
    inner.push("logic-checkbox-icon");
    if (checked.value) {
      wrapper.push("logic-checkbox-active");
    }
  } else if (props.mode === "radio") {
    wrapper.push("logic-radio");
    inner.push("logic-checkbox-icon");
    if (checked.value) {
      wrapper.push("logic-checkbox-active");
    }
  }

  return { wrapper, inner };
});

const handleChange = () => {
  if (props.readonly) {
    return;
  }

  if (props.disabled) {
    return;
  }

  const value = checked.value ? props.falseValue : props.trueValue;
  modelValue.value = value;
  props.onChange?.(value);
};
</script>

<style>
.logic {
  display: inline-block;
}

.logic-content {
  font-size: 16px;
}

.field-disabled {
  opacity: 0.7;
}

.logic-switch {
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  border: 1px solid transparent;
  margin-right: 1px;
}

.logic-switch-track {
  border-radius: 9999px;
  height: 2rem;
  width: 3.25rem;
  background-color: rgba(128, 128, 128, 0.2);
}

.logic-switch-track-active {
  background-color: var(--color-primary, #1677ff);
  border-color: var(--color-primary, #1677ff);
}

.logic-switch-inner {
  transition: all 0.2s;
  border-radius: 9999px;
  height: 2rem;
  width: 2rem;
  border: 1px solid;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.logic-switch-thumb {
  transform: translateX(0);
}

.logic-switch-thumb-active {
  transform: translateX(1.25rem);
  border-width: 1px;
  border-color: var(--color-primary, #1677ff);
}

.logic-switch-thumb-inactive {
  transform: translateX(0);
}

.logic-checkbox {
  border-radius: 0.375rem;
  height: 1.5rem;
  width: 1.5rem;
  justify-content: center;
}

.logic-radio {
  border-radius: 9999px;
  height: 1.5rem;
  width: 1.5rem;
  justify-content: center;
}

.logic-checkbox-active {
  background-color: var(--color-primary, #1677ff);
  border-color: var(--color-primary, #1677ff);
}

.logic-checkbox-icon {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M20 6L11 17l-5-5'/%3E%3C/svg%3E");
  mask: var(--un-icon) no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
  color: white;
  font-size: 1.25rem;
}
</style>
