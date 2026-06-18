<template>
  <view
    class="custom-tabbar-item-root"
    :style="{ color: active ? selectedColor : color }"
    @click="onTabbarClick"
  >
    <view class="custom-tabbar-item-inner">
      <view v-if="iconfont" class="tabbar_iconfont" :style="iconfontStyle">
        <view
          v-if="iconfont.length === 1"
          class="custom-tabbar-item-icon-text"
          >{{ iconfont }}</view
        >
        <view
          v-else
          :class="iconfont"
          class="custom-tabbar-item-icon-text"
        ></view>
      </view>
      <view v-else-if="iconPath">
        <image
          class="custom-tabbar-item-icon-image"
          :src="iconPath"
          mode="scaleToFill"
        />
      </view>
      <view
        :class="[iconfont || iconPath ? 'custom-tabbar-item-text-small' : '']"
        >{{ text }}</view
      >
      <view v-if="badge" class="custom-tabbar-item-badge-wrapper">
        <view
          v-if="isDotBadge"
          class="custom-tabbar-item-badge-dot"
          style="transform: translate(100%, 0.5rem)"
        ></view>
        <view
          v-else
          class="custom-tabbar-item-badge-count"
          style="transform: translate(100%, 0.25rem)"
        >
          {{ badge }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { StyleValue } from "@/types";

interface Props {
  active: boolean;
  pagePath: string;
  text?: string;
  iconfont?: Record<string, any>;
  iconPath?: string;
  selectedIconPath?: string;
  color?: string;
  selectedColor?: string;
  badge?: boolean | string;
}

const props = defineProps<Props>();

defineOptions({
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

const iconfont = computed(() => {
  const defaultIconfont = props.iconfont?.text;
  const selectedIconFont = props.iconfont?.selectedText ?? defaultIconfont;
  return props.active ? selectedIconFont : defaultIconfont;
});

const iconfontStyle = computed<StyleValue>(() => {
  const iconfont = props.iconfont;
  const style: StyleValue = {};

  const fontSize = iconfont?.fontSize;
  if (fontSize) {
    style.fontSize = fontSize;
  }

  const specialColor = props.active ? iconfont?.selectedColor : iconfont?.color;
  if (specialColor) {
    style.color = specialColor;
  }
  return style;
});

const iconPath = computed(() => {
  const defaultIconPath = props.iconPath ? `/${props.iconPath}` : undefined;
  const selectedIconPath = props.selectedIconPath
    ? `/${props.selectedIconPath}`
    : defaultIconPath;

  return props.active ? selectedIconPath : defaultIconPath;
});

const isDotBadge = computed(() => {
  return typeof props.badge === "boolean";
});

const onTabbarClick = () => {
  if (props.active) return;

  uni.switchTab({
    url: `/${props.pagePath}`,
  });
};
</script>

<style>
.tabbar_iconfont {
  font-family: UniTabbarIconFont, sans-serif;
}

.custom-tabbar-item-root {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.custom-tabbar-item-inner {
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.custom-tabbar-item-icon-text {
  font-size: 1.5rem;
}

.custom-tabbar-item-icon-image {
  display: block;
  height: 1.5rem;
  width: 1.5rem;
}

.custom-tabbar-item-text-small {
  font-size: 0.75rem;
}

.custom-tabbar-item-badge-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 0.75rem;
}

.custom-tabbar-item-badge-dot {
  background-color: red;
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
}

.custom-tabbar-item-badge-count {
  background-color: red;
  min-width: 1rem;
  border-radius: 0.25rem;
  padding: 0 0.25rem;
  text-align: center;
  color: white;
}
</style>
