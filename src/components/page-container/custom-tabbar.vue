<template>
  <view class="custom-tabbar">
    <view class="custom-tabbar-border"></view>
    <view
      v-for="item in tabbar.list"
      :key="item.pagePath"
      class="custom-tabbar-item"
    >
      <custom-tabbar-item
        :active="item.pagePath === route.route"
        :page-path="item.pagePath"
        :text="item.text"
        :color="tabbar.color"
        :selected-color="tabbar.selectedColor"
        :iconfont="item.iconfont"
        :icon-path="item.iconPath"
        :selected-icon-path="item.selectedIconPath"
        :badge="item.badge"
      >
      </custom-tabbar-item>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import customTabbarItem from "./custom-tabbar-item.vue";

interface Props {
  /**
   * 路由信息
   */
  route: Record<string, any>;
  /**
   * tabbar信息
   */
  tabbar: Record<string, any>;
}

defineProps<Props>();

defineOptions({
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

onMounted(() => {
  // #ifdef H5
  uni.hideTabBar();
  // #endif
});
</script>

<style>
.custom-tabbar {
  height: 3.25rem;
  position: relative;
  display: flex;
  width: 100%;
  background-color: white;
}

.custom-tabbar-border {
  position: absolute;
  left: 0;
  top: 0;
  height: 1px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}

.custom-tabbar-item {
  flex: 1;
}
</style>
