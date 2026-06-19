<template>
  <view :class="wrapperClassNames">
    <view v-if="icon" :class="[icon]"></view>
    <view class="field-reference-body" @click="handleChange">
      <view class="field-reference-inner">
        <view class="field-reference-text-wrapper">
          <view class="field-reference-text-container">
            <view class="field-reference-tags">
              <view v-show="content" :class="contentClassNames">
                {{ content }}
              </view>
              <view v-show="multipleCount" :class="multipleCountClassNames">
                {{ multipleCount }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view
      v-if="showClearBtn"
      v-show="modelValue"
      :class="allowClearClassNames"
      @click="onClear"
    ></view>
  </view>
</template>

<script setup lang="ts">
import { isNil } from "lodash-es";
import { computed, toValue } from "vue";
import { useField } from "../../../hooks/useField";
import type { ClassNameValue } from "../../../types";
import { stringifyQueryParams } from "../../../utils";
import { referencePickerProps } from "./reference-picker";

const props = defineProps(referencePickerProps);

const modelValue = defineModel<string | string[]>();

defineOptions({
  inheritAttrs: false,
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

const { wrapperClassNames, showClearBtn, allowClearClassNames, handleClear } =
  useField(props);

const mergedDefaultProps = computed(() => {
  const defaults = { id: "id", code: "code", name: "name" };
  return Object.assign(defaults, props.defaultProps);
});

const fieldCode = computed(() => {
  if (typeof props.fieldCode === "string") {
    return props.fieldCode;
  }
  if (typeof props.fieldCode === "function") {
    return props.fieldCode(props.field);
  }
  return `${props.field}Code`;
});

const fieldName = computed(() => {
  if (typeof props.fieldName === "string") {
    return props.fieldName;
  }
  if (typeof props.fieldName === "function") {
    return props.fieldName(props.field);
  }
  return `${props.field}Name`;
});

const propsId = computed(() => mergedDefaultProps.value.id);
const propsCode = computed(() => mergedDefaultProps.value.code);
const propsName = computed(() => mergedDefaultProps.value.name);

const selectedItems = computed(() => {
  const fieldDatas = Object.assign({}, props.fieldData);

  if (props.parseValue) {
    return props.parseValue(toValue(modelValue), fieldDatas);
  }

  const loopTrim = (value: string[]) => value.map((v) => v.trim());
  const loopValidate = (value: string[]) =>
    value.filter((v) => !isNil(v) && v.length > 0);

  const _arrays = (val: string | string[] | undefined) => {
    if (typeof val === "string") {
      return loopValidate(loopTrim(val.split(",")));
    }
    if (Array.isArray(val)) {
      return loopValidate(val);
    }
    return [];
  };

  const arrayValue = _arrays(toValue(modelValue));
  const arrayValueCode = _arrays(fieldDatas[toValue(fieldCode)]);
  const arrayValueName = _arrays(fieldDatas[toValue(fieldName)]);

  const result: Record<string, any>[] = [];
  for (let index = 0; index < arrayValue.length; index++) {
    result.push({
      [toValue(propsId)]: arrayValue[index],
      [toValue(propsCode)]: arrayValueCode[index],
      [toValue(propsName)]: arrayValueName[index] ?? arrayValue[index],
    });
  }

  return props.multiple ? result : result.slice(0, 1);
});

const content = computed(() => {
  const firstItem = selectedItems.value[0];
  const label = firstItem?.[toValue(propsName)];

  if (props.readonly) {
    return label ?? props.emptyValue;
  }

  return label || props.placeholder;
});

const contentClassNames = computed(() => {
  const classNames: ClassNameValue = ["field-content field-reference-content"];

  if (selectedItems.value.length === 0) {
    classNames.push("field-content-empty");
  } else if (props.multiple) {
    classNames.push("field-reference-tag");
  }

  if (props.disabled) {
    classNames.push("field-disabled");
  }

  return classNames;
});

const multipleCount = computed(() => {
  if (props.multiple && selectedItems.value.length > 1) {
    return `+${selectedItems.value.length - 1}`;
  }
  return false;
});

const multipleCountClassNames = computed(() => {
  const classNames: ClassNameValue = ["field-reference-tag"];
  if (props.multiple) {
    classNames.push("field-reference-tag");
  }

  if (props.disabled) {
    classNames.push("field-disabled");
  }

  return classNames;
});

const handleChange = async () => {
  if (props.readonly) {
    return;
  }

  if (props.disabled) {
    return;
  }

  const field = props.field;

  const params: PageReferenceParameters = {
    scene: "reference",
    field: field,
    title: props.title,
    multiple: props.multiple,
    multipleMode: props.multipleMode,
    multipleMax: props.multipleMax,
    defaultProps: mergedDefaultProps.value,
    showSearch: props.showSearch,
  };
  const options: PageReferenceOptions = {
    dataSource: props.dataSource ?? "",
    requestMethod: props.requestMethod,
    queryParams: props.queryParams,
    value: selectedItems.value,
    requestOptions: props.requestOptions ?? {},
    searchOptions: props.searchOptions ?? {},
    listOptions: props.listOptions ?? {},
  };

  const res = await uni.navigateTo({
    url: `${props.referencePageUrl}?${stringifyQueryParams(params)}`,
    events: {
      [`${field}-reference-confirm`]: (data: Record<string, any>[]) => {
        const fieldData = props.fieldData || {};
        let join = (items: string[]): any => items;
        let items = data;

        if (!props.multiple) {
          items = data.slice(0, 1);
          join = (items: string[]) => items[0];
        }

        if (props.multiple && props.multipleMode === "comma") {
          join = (items: string[]) => items.join(",");
        }

        const id = (item: Record<string, any>) => item[toValue(propsId)];
        const code = (item: Record<string, any>) => item[toValue(propsCode)];
        const name = (item: Record<string, any>) => item[toValue(propsName)];

        const value = join(items.map((item) => id(item)));
        modelValue.value = value;
        fieldData[toValue(fieldCode)] = join(items.map((item) => code(item)));
        fieldData[toValue(fieldName)] = join(items.map((item) => name(item)));
        props.onChange?.(value, items);
      },
    },
  });
  res.eventChannel.emit(`${field}-reference-options`, options);
};

const onClear = () => {
  if (props.disabled) {
    return;
  }

  modelValue.value = undefined;
  props.onChange?.(undefined, []);
};
</script>

<style>
.field-reference-body {
  height: 100%;
  flex: 1;
  overflow: hidden;
}

.field-reference-inner {
  display: flex;
  height: 100%;
  align-items: center;
}

.field-reference-text-wrapper {
  font-size: 0;
  width: 100%;
}

.field-reference-text-container {
  font-size: 16px;
  display: inline-block;
  max-width: 100%;
}

.field-reference-tags {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.field-reference-content {
  white-space: nowrap;
}

.field-reference-tag {
  border-radius: 0.25rem;
  padding: 0 0.5rem;
  padding-top: 0;
  padding-bottom: 0;
  border: 1px solid;
  color: var(--color-primary, #1677ff);
  border-color: var(--color-primary, #1677ff);
  background-color: var(--color-primary-light, rgba(22, 119, 255, 0.1));
}
</style>
