<template>
  <view class="list-container" :class="classNames?.root" :style="styles?.root">
    <scroll-view
      class="list-container-scroll"
      :scroll-y="true"
      :scroll-top="scrollTop"
      :lower-threshold="lowerThreshold"
      :refresher-enabled="refresherEnabled"
      :refresher-threshold="refresherThreshold"
      :refresher-triggered="refresherTriggered"
      :refresher-background="refresherBackground"
      @refresherrefresh="refresh"
      @scrolltolower="loadMore"
      @scroll="onScroll"
    >
      <view
        class="list-container-content"
        :class="classNames?.content"
        :style="styles?.content"
      >
        <view
          v-for="(item, index) in items"
          :key="item[rowKey]"
          :class="classNames?.item"
          :style="styles?.item"
        >
          <slot name="item" :item="item" :index="index"></slot>
        </view>

        <view v-show="items.length === 0" class="list-container-empty">
          <view class="list-container-empty-inner">
            <slot name="empty">
              <view class="list-container-empty-content">
                <view class="list-container-empty-icon"></view>
                <view class="">{{ locale.noData }}</view>
              </view>
            </slot>
          </view>
        </view>

        <view v-show="items.length > 0" class="list-container-footer">
          <view v-show="loadMoreTriggered" class="list-container-footer-inner">
            <text>{{ locale.loading }}</text>
          </view>
          <view
            v-show="!loadMoreTriggered"
            class="list-container-footer-inner"
            :class="noMoreTriggered ? '' : 'list-container-footer-box'"
          >
            <text>{{ noMoreTriggered ? noMoreContent : loadMoreContent }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
interface ListContainerOptions<Data extends AnyObject> {
  items?: Data[];
  rowKey?: string;
  lowerThreshold?: number | string;
  refresherEnabled?: boolean;
  scrollTop?: number | string;
  refresherThreshold?: number;
  refresherBackground?: string;
  refresherTriggered?: boolean;
  refresh?: (e?: UniEvent) => Promise<void>;
  loadMoreTriggered?: boolean;
  noMoreTriggered?: boolean;
  noMoreContent?: string;
  loadMoreContent?: string;
  loadMore?: (e: UniEvent) => Promise<void>;
  onScroll?: (e: UniEvent) => void | Promise<void>;
}

declare global {
  type ListContainerProps<Data extends AnyObject> = ListContainerOptions<Data>;
}
</script>

<script setup lang="ts" generic="Data extends AnyObject">
import { useConfig } from "../../plugins/config-provider";

export interface Props extends ListContainerOptions<Data> {
  classNames?: Semantic<SemanticDOM, ClassNameValue>;
  styles?: Semantic<SemanticDOM, StyleValue>;
}

type SemanticDOM = "root" | "content" | "item";

const locale = useConfig("locale", {
  noData: "暂无数据",
  loading: "加载中...",
  unknownError: "未知错误",
  notice: "提示",
  warning: "警告",
});

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  lowerThreshold: 50,
  refresherThreshold: 50,
  refresherEnabled: true,
  rowKey: "id",
  refresherBackground: "transparent",
  noMoreContent: "-- 没有更多了 --",
  loadMoreContent: "上拉加载更多",
});

defineOptions({
  inheritAttrs: false,
});
</script>

<style>
.list-container {
  height: 100%;
  width: 100%;
}

.list-container-scroll {
  height: 100%;
  width: 100%;
}

.list-container-content {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.list-container-empty {
  position: relative;
  display: flex;
  height: 100%;
  justify-content: center;
}

.list-container-empty-inner {
  position: absolute;
  top: 25%;
  color: #9ca3af;
}

.list-container-empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.list-container-empty-icon {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 8v4M12 16h.01'/%3E%3C/svg%3E");
  mask: var(--un-icon) no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
  margin: 0 auto;
  font-size: 3.125rem;
}

.list-container-footer {
  flex: 1;
  padding-top: 1rem;
  color: #9ca3af;
}

.list-container-footer-inner {
  height: 100%;
  padding-bottom: 1rem;
  text-align: center;
}

.list-container-footer-box {
  box-sizing: content-box;
}
</style>
