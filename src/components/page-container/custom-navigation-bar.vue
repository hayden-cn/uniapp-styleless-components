<template>
  <view :class="containerClassNames" :style="containerStyles">
    <view :style="{ height: `${statusBarHeight}px` }"></view>
    <view
      class="custom-nav-bar"
      :style="{ height: `${navigationBarHeight}px` }"
    >
      <view v-if="showBackBtn" class="custom-nav-bar-back">
        <view class="custom-nav-bar-back-btn">
          <view
            class="custom-nav-bar-back-icon"
            :style="{ '--un-icon': `url(${backBtnImage})` }"
            @click="goBack"
          ></view>
        </view>
      </view>
      <view>
        <slot>{{ title }}</slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePageContainer } from "../../hooks/usePageContainer";

type SemanticDOM = "root";

interface Props {
  /**
   * 是否显示返回按钮，仅使用自定义导航栏时生效
   */
  showBackBtn?: boolean;
  /**
   * 标题
   */
  title?: string;
  /**
   * 语义化结构 class
   */
  classNames?: Semantic<SemanticDOM, ClassNameValue>;
  /**
   * 语义化结构 style
   */
  styles?: Semantic<SemanticDOM, StyleValue>;
}

const props = withDefaults(defineProps<Props>(), {
  showBackBtn: true,
});

defineOptions({
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});

const backBtnImage = computed(() => {
  const svg = `
  <svg width="26" height="26" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z"
      fill="currentColor"
    ></path>
  </svg>`;
  return `data:image/svg+xml;uft8,${encodeURIComponent(svg)}`;
});

const { statusBarHeight, navigationBarHeight } = usePageContainer();

const containerClassNames = computed(() => {
  const classNames: ClassNameValue = ["custom-nav-bar-root"];
  if (props.classNames?.root) {
    classNames.push(props.classNames.root);
  }
  return classNames;
});

const containerStyles = computed(() => {
  const styles: StyleValue = [];
  if (props.styles?.root) {
    styles.push(props.styles.root);
  }
  return styles;
});

const goBack = () => {
  uni.navigateBack();
};
</script>

<style>
.custom-nav-bar-root {
  font-size: 1rem;
}

.custom-nav-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-nav-bar-back {
  position: absolute;
  left: 0.25rem;
}

.custom-nav-bar-back-btn {
  display: flex;
  height: 1.75rem;
  width: 1.75rem;
  align-items: center;
  justify-content: center;
}

.custom-nav-bar-back-icon {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 18l-6-6l6-6'/%3E%3C/svg%3E");
  mask: var(--un-icon) no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
  font-size: 1.875rem;
}
</style>
