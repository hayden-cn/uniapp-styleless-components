<template>
  <view
    class="page-container"
    :class="[classNames?.root]"
    :style="[styles?.root]"
  >
    <view v-if="waiting" class="page-container-waiting">
      <slot name="waiting">
        <view class="page-container-waiting-inner" :style="waitingStyles">
          <custom-waiting></custom-waiting>
        </view>
      </slot>
    </view>

    <view v-if="needShowCustomNavigationBar">
      <slot name="navigation-bar">
        <custom-navigation-bar
          :show-back-btn="needShowBackBtn"
          :title="currentRoute.style?.navigationBarTitleText"
          :styles="{
            root: {
              color: currentRoute.style?.navigationBarTextStyle,
              backgroundColor: currentRoute.style?.navigationBarBackgroundColor,
            },
          }"
        ></custom-navigation-bar>
      </slot>
    </view>

    <view
      class="page-container-content"
      :class="[
        scrollable
          ? 'page-container-scrollable'
          : 'page-container-overflow-hidden',
        classNames?.content,
      ]"
      :style="[styles?.content]"
    >
      <slot></slot>
    </view>

    <view class="page-container-footer">
      <!-- 自定义底部导航栏 -->
      <custom-tabbar
        v-if="needShowCustomTabbar"
        :route="currentRoute"
        :tabbar="tabBar"
      ></custom-tabbar>

      <!-- 底部安全区 -->
      <view
        v-if="needShowSafeBottomArea"
        class="page-container-safe-bottom"
        :style="[{ height: `${safeBottomHeight}px` }]"
      ></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { usePageContainer } from "../../hooks/usePageContainer";
import customNavigationBar from "./custom-navigation-bar.vue";
import customTabbar from "./custom-tabbar.vue";
import customWaiting from "./custom-waiting.vue";

interface Props {
  /**
   * 允许滚动
   *
   * @default false
   */
  scrollable?: boolean;
  /**
   * 显示导航栏
   *
   * @default true
   */
  showNavigationBar?: boolean;
  /**
   * 显示返回按钮
   *
   * @default true
   */
  showBackBtn?: boolean;
  /**
   * 显示底部安全区域
   *
   * @default true
   */
  showBottomSafeArea?: boolean;
  /**
   * 语义化 classname 结构
   *
   * - root 根元素
   * - content 内容区域
   */
  classNames?: Semantic<SemanticDOM, ClassNameValue>;
  /**
   * 语义化 style 结构
   *
   * - root 根元素
   * - content 内容区域
   */
  styles?: Semantic<SemanticDOM, StyleValue>;
  /**
   * 根元素 classname 相当于 classNames.root
   */
  class?: ClassNameValue;
  /**
   * 根元素 style 相当于 styles.root
   */
  style?: StyleValue;
}

type SemanticDOM = "root" | "content";

const props = withDefaults(defineProps<Props>(), {
  scrollable: false,
  showBackBtn: true,
  showNavigationBar: true,
  showBottomSafeArea: true,
});

defineOptions({
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

const { safeBottomHeight, currentRoute, tabBar, init } = usePageContainer();

const waiting = ref(true);

onMounted(async () => {
  await init?.();
  waiting.value = false;
});

const needShowCustomNavigationBar = computed(() => {
  return (
    currentRoute.value.style?.navigationStyle === "custom" &&
    props.showNavigationBar
  );
});

const needShowBackBtn = computed(() => {
  // 首页或者 tabBar 页面都不需要显示返回按钮
  // 其余页面有 props.showBackBtn 控制，默认为 true
  return (
    props.showBackBtn &&
    !(currentRoute.value.isHomePage || currentRoute.value.isTabBar)
  );
});

// 是否自定义 tabbar
const isCustomTabbar = computed(() => {
  return tabBar.value?.custom === true;
});

const needShowCustomTabbar = computed(() => {
  return isCustomTabbar.value && currentRoute.value.isTabBar && tabBar.value;
});

const needShowSafeBottomArea = computed(() => {
  // 如果是 tabbar 页面，交由是否自定义 tabbar 决定
  // 否则通过 props.showBottomSafeArea 手动控制
  return currentRoute.value.isTabBar
    ? isCustomTabbar.value
    : props.showBottomSafeArea;
});

const waitingStyles = computed(() => {
  const style: StyleValue = {
    backgroundColor: currentRoute.value.style?.navigationBarBackgroundColor,
  };
  return style;
});
</script>

<style>
.page-container {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
}

.page-container-waiting {
  z-index: 999;
  position: absolute;
  height: 100%;
  width: 100%;
}

.page-container-waiting-inner {
  height: 100%;
  width: 100%;
}

.page-container-content {
  flex: 1;
}

.page-container-scrollable {
  overflow-y: scroll;
}

.page-container-overflow-hidden {
  overflow: hidden;
}

.page-container-footer {
  width: 100%;
}

.page-container-safe-bottom {
  width: 100%;
}
</style>
