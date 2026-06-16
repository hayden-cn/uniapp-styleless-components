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

    <view v-if="isCustomNavigationBar && showNavigationBar">
      <slot name="navigation-bar">
        <custom-navigation-bar
          :show-back-btn="showBackBtn && !(route.isHomePage || route.isTabBar)"
          :title="route.style.navigationBarTitleText"
          :styles="{
            root: {
              color: route.style.navigationBarTextStyle,
              backgroundColor: route.style.navigationBarBackgroundColor,
            },
          }"
        ></custom-navigation-bar>
      </slot>
    </view>

    <view
      class="page-container-content"
      :class="[
        scrollable ? 'page-container-scrollable' : 'page-container-overflow-hidden',
        classNames?.content,
      ]"
      :style="[styles?.content]"
    >
      <slot></slot>
    </view>

    <view class="page-container-footer">
      <!-- 自定义底部导航栏 -->
      <custom-tabbar
        v-if="isCustomTabbar && route.isTabBar && tabBar"
        :route="route"
        :tabbar="tabBar"
      ></custom-tabbar>

      <!-- 底部安全区 -->
      <view
        v-if="route.isTabBar ? isCustomTabbar : showBottomSafeArea"
        class="page-container-safe-bottom"
        :style="[{ height: `${safeBottomHeight}px` }]"
      ></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import customNavigationBar from './custom-navigation-bar.vue'
import customTabbar from './custom-tabbar.vue'
import customWaiting from './custom-waiting.vue'

interface Props {
  scrollable?: boolean
  showNavigationBar?: boolean
  showBackBtn?: boolean
  showBottomSafeArea?: boolean
  classNames?: Semantic<SemanticDOM, ClassNameValue>
  styles?: Semantic<SemanticDOM, StyleValue>
}

type SemanticDOM = 'root' | 'content'

withDefaults(defineProps<Props>(), {
  scrollable: false,
  showBackBtn: true,
  showNavigationBar: true,
  showBottomSafeArea: true,
})

const { init } = useInit() // auto-import: provide useInit composable in consuming app

const waiting = ref(true)

onMounted(async () => {
  await init()
  waiting.value = false
})

const { safeBottomHeight } = usePageContainer()

const { route, tabBar } = useRoute() // auto-import: provide useRoute composable in consuming app

const isCustomNavigationBar = computed(() => {
  return route.value.style.navigationStyle === 'custom'
})

const isCustomTabbar = computed(() => {
  return tabBar.value?.custom === true
})

const waitingStyles = computed(() => {
  const style: StyleValue = {
    backgroundColor: route.value.style.navigationBarBackgroundColor,
  }
  return style
})
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
