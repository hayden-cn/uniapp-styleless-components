<template>
  <view :class="wrapperClassNames">
    <view v-if="icon" :class="[icon]"></view>
    <view v-if="readonly" :class="contentClassNames">
      {{ content }}
    </view>
    <picker
      v-else
      mode="selector"
      :range="options"
      range-key="label"
      class="field-picker"
      :value="selectedIndex"
      @change="handleChange"
      :disabled="disabled"
    >
      <view :class="contentClassNames">
        {{ content }}
      </view>
    </picker>
    <view
      v-if="showClearBtn"
      v-show="modelValue"
      :class="allowClearClassNames"
      @click="onClear"
    ></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ClassNameValue } from "@/types";
import { useField } from "../../../hooks/useField";
import { optionPickerProps } from "./option-picker";

const props = defineProps(optionPickerProps);

const modelValue = defineModel<string | number>();

defineOptions({
  inheritAttrs: false,
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

const { wrapperClassNames, showClearBtn, allowClearClassNames, handleClear } =
  useField(props);

const selectedIndex = computed(() => {
  return props.options.findIndex((item) => item.value === modelValue.value);
});

const content = computed(() => {
  const index = selectedIndex.value;
  const label = props.options[index]?.label;

  if (props.readonly) {
    return label || props.emptyValue;
  }

  return label || props.placeholder;
});

const contentClassNames = computed(() => {
  const classNames: ClassNameValue = ["field-content field-content-full"];

  if (!modelValue.value) {
    classNames.push("field-content-empty");
  }

  if (props.disabled) {
    classNames.push("field-disabled");
  }

  return classNames;
});

const handleChange = (e: any) => {
  const index = e.detail.value;
  const item = props.options[index];
  const value = item?.value;
  modelValue.value = value;
  props.onChange?.(value);
};

const onClear = () => {
  handleClear(modelValue, props.onChange);
};
</script>

<style>
.field-content-full {
  width: 100%;
}

.field-picker {
  width: 100%;
}
</style>
