<template>
  <view class="custom-waiting">
    <view class="custom-waiting-inner">
      <view class="custom-waiting-spinner"></view>
      <view class="">加载中...</view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineOptions({
  options: {
    styleIsolation: "apply-shared",
    virtualHost: true,
  },
});
</script>

<style>
.custom-waiting {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.custom-waiting-inner {
  color: gray;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.custom-waiting-spinner {
  --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 24 24' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 3a9 9 0 1 0 9 9'/%3E%3C/svg%3E");
  mask: var(--un-icon) no-repeat;
  mask-size: 100% 100%;
  background-color: currentColor;
  animation: spinning 2.4s linear infinite;
}

@keyframes spinning {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
