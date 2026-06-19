<template>
  <view :class="semanticStyle.root.classes" :style="semanticStyle.root.styles">
    <view
      :class="semanticStyle.header.classes"
      :style="semanticStyle.header.styles"
    >
      <view
        v-for="item in items"
        :key="`${item.value}`"
        class="tabs-header-item"
        :class="[
          semanticStyle.item.classes,
          active === item.value ? semanticStyle.active.classes : '',
        ]"
        :style="[
          semanticStyle.item.styles,
          active === item.value ? semanticStyle.active.styles : '',
        ]"
        @click="handleClick(item)"
      >
        <text :class="[item.icon]"></text>
        <text>{{ item.label }}</text>
      </view>
      <view
        v-if="type !== 'button'"
        :class="semanticStyle.indicator.classes"
        :style="semanticStyle.indicator.styles"
      ></view>
    </view>
    <view
      :class="semanticStyle.content.classes"
      :style="semanticStyle.content.styles"
    >
      <view
        v-for="item in items"
        v-show="active === item.value"
        :key="`${item.value}`"
      >
        <slot :name="item.value"></slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
declare global {
  interface TabItem<Value = string | number> {
    label: string;
    value: Value;
    icon?: string;
    disabled?: boolean;
  }

  type TabStyleType = "line" | "button" | "card";
}
</script>

<script setup lang="ts" generic="Value = string | number">
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  watch,
} from "vue";
import type {
  ClassNameValue,
  ComponentSize,
  Semantic,
  StyleValue,
} from "../../types";

export interface Props {
  defaultValue?: Value;
  items: TabItem<Value>[];
  type?: TabStyleType;
  size?: ComponentSize;
  classNames?: Semantic<SemanticDOM, ClassNameValue>;
  styles?: Semantic<SemanticDOM, StyleValue>;
}

const semantics = [
  "root",
  "header",
  "item",
  "active",
  "indicator",
  "content",
] as const;
type SemanticDOM = (typeof semantics)[number];

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  type: "line",
  size: "medium",
});

const active = defineModel<Value>();

const emits = defineEmits<{
  change: [value: Value];
}>();

onMounted(() => {
  if (!active.value) {
    active.value = props.defaultValue || props.items[0]?.value;
  }
});

const activeIndex = computed(() =>
  props.items.findIndex((item) => item.value === active.value),
);

const itemsDomInfo = ref<UniApp.NodeInfo[]>([]);

const selectorQuery = ref<UniApp.SelectorQuery>();

const calcTabItemsDomInfo = (query: UniApp.SelectorQuery) => {
  nextTick(() => {
    query
      .selectAll(".tabs-header-item")
      .boundingClientRect((res) => {
        itemsDomInfo.value = res as UniApp.NodeInfo[];
      })
      .exec();
  });
};

onMounted(() => {
  const instance = getCurrentInstance()?.proxy;
  if (instance) {
    selectorQuery.value = uni.createSelectorQuery().in(instance);
    calcTabItemsDomInfo(selectorQuery.value);
  }
});

watch(
  () => props.items,
  () => {
    if (selectorQuery.value) calcTabItemsDomInfo(selectorQuery.value);
  },
);

const semanticStyle = computed(() => {
  interface SemanticStyle {
    classes: ClassNameValue[];
    styles: StyleValue[];
  }

  const generateStyleObject = (): SemanticStyle => {
    return { classes: [], styles: [] };
  };

  const collection = Object.fromEntries(
    semantics.map((name) => [name, generateStyleObject()]),
  ) as Record<SemanticDOM, SemanticStyle>;

  const { header, item, active, indicator } = collection;

  const indicatorInfo = itemsDomInfo.value[activeIndex.value];

  header.classes.push("tabs-header");
  item.classes.push("tabs-item");

  if (props.size === "mini") {
    item.classes.push("tabs-item-mini");
  }

  if (props.size === "small") {
    item.classes.push("tabs-item-small");
  }

  if (props.size === "medium") {
    item.classes.push("tabs-item-medium");
  }

  if (props.size === "large") {
    item.classes.push("tabs-item-large");
  }

  if (props.type === "button") {
    header.classes.push("tabs-header-button");
    item.classes.push("tabs-item-button");
    active.classes.push("tabs-active-button");
  }

  if (props.type === "line") {
    header.classes.push("tabs-header-line");
    active.classes.push("tabs-active-line");
  }

  if (props.type === "card") {
    header.classes.push("tabs-header-card");
    item.classes.push("tabs-item-card");
    active.classes.push("tabs-active-card");
  }

  indicator.classes.push("tabs-indicator");
  if (props.type === "line") {
    indicator.classes.push("tabs-indicator-line");
  }
  if (props.type === "card") {
    indicator.classes.push("tabs-indicator-card");
  }
  indicator.styles.push({
    width: `${(indicatorInfo?.width || 0) - 2}px`,
    left: `${(indicatorInfo?.left || 0) + 1}px`,
  });

  for (const [name, item] of Object.entries(collection)) {
    item.classes.push(props.classNames?.[name as SemanticDOM]);
    item.styles.push(props.styles?.[name as SemanticDOM]);
  }

  return collection;
});

const handleClick = (item: TabItem<Value>) => {
  active.value = item.value;
  emits("change", item.value);
};
</script>

<style>
.tabs-header {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
}

.tabs-item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.tabs-item-mini {
  height: 2rem;
  font-size: 0.875rem;
  padding: 0 0.25rem;
}

.tabs-item-small {
  height: 2.5rem;
  font-size: 0.875rem;
  padding: 0 0.5rem;
}

.tabs-item-medium {
  height: 3rem;
  font-size: 1rem;
  padding: 0 0.75rem;
}

.tabs-item-large {
  height: 3.5rem;
  font-size: 1.125rem;
  padding: 0 1rem;
}

.tabs-header-button {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.tabs-item-button {
  border-right: 1px solid #e5e7eb;
}

.tabs-item-button:last-child {
  border-right: none;
}

.tabs-active-button {
  background-color: var(--color-primary, #1677ff);
  color: white;
}

.tabs-header-line {
  border-bottom: 1px solid #e5e7eb;
}

.tabs-active-line {
  color: var(--color-primary, #1677ff);
  font-weight: 500;
}

.tabs-header-card {
  gap: 0.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.tabs-item-card {
  border-top: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  border-radius: 0.5rem 0.5rem 0 0;
  background-color: #f3f4f6;
}

.tabs-active-card {
  background-color: white;
  color: var(--color-primary, #1677ff);
  font-weight: 500;
}

.tabs-indicator {
  position: absolute;
  transition: all 0.2s;
}

.tabs-indicator-line {
  height: 2px;
  bottom: -1px;
  background-color: var(--color-primary, #1677ff);
  border-radius: 9999px;
}

.tabs-indicator-card {
  height: 0.25rem;
  bottom: -4px;
  background-color: white;
}
</style>
