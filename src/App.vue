<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN.js'
</script>

<template>
  <ConfigProvider :locale="zhCN">
    <!-- Header组件 -->

    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </ConfigProvider>
</template>

<style lang="less">
// z-index
// detail ---1020
// header ---1010(需要高于loading)
// loading - 990
// map - static
//       1. top -----300 (高于left、right，避免被其背景图覆盖)
//       2. bottom --300 (同上)
//       3. fullBtn --300 (同上)
// slide module 200
// header-bg ---190(因为背景图片可能遮住左右两侧内容)
// page Mask - 130
// slide module bg 120

.pageMask {
  z-index: 130;
  pointer-events: none;
}
.slideMopduleBgZIndex {
  z-index: 120;
}
.slideModuleZIndex {
  z-index: 200;
}
.slideModulePopupZIndex {
  // 左右侧模块内如圆形选点选择类型，在离线更多等下拉框
  z-index: 290;
}
</style>
