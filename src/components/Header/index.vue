<template>
  <img
    src="@/assets/imgs/header/bg.png"
    class="absolute top-0 left-0 headerBg animate__animated animate__fadeInDown"
  />
  <div class="absolute top-0 left-0 headerWrap animate__animated animate__fadeInDown">
    <div class="relative flex items-center justify-between content">
      <div class="flex items-center weather">
        <img
          v-if="weatherIcon"
          :src="weatherIcon"
          @error="removeFaildLoadImg"
          class="icon_1 w-7 h-7 mr-3.5"
        />
        <span class="text_normal mr-3.5">{{ weathertext }}</span>
        <span class="mr-5 text_normal">{{ weathertemp }}°</span>
        <img
          v-if="airIcon"
          :src="airIcon"
          @error="removeFaildLoadImg"
          class="icon_1 w-7 h-7 block mr-3.5"
        />
        <div :style="{ color: aircolor }">
          <span class="text_normal mr-3.5">{{ aircategory }}</span>
          <span class="mr-5 text_normal">{{ airaqi }}</span>
        </div>
        <div class="flex items-center">
          <img
            v-for="(item, index) in warningData"
            :key="index"
            :src="getWarningImg(item)"
            @error="removeFaildLoadImg"
            class="icon_2 h-5.5 block mr-3.5"
          />
        </div>
      </div>
      <div class="flex items-center time">
        <span class="mr-5 text_normal">{{ month }}</span>
        <span class="mr-5 text_normal">{{ week }}</span>
        <span class="text_normal">{{ time }}</span>
        <!-- <img class="ml-12 companyLogo" src="@/assets/imgs/header/company-logo.png" /> -->
        <!-- <img src="@/assets/imgs/btn-ai.png" class="ml-7 aiBtn" @click="openAiDialog" /> -->

        <div @click="changeRecord" class="px-2 ml-3 cursor-pointer recordBtn">
          <span>
            {{ screenRecorder?.status === 1 ? '停止录制' : '开始录制' }}
          </span>
        </div>
        <div
          class="flex items-center pl-2 ml-4 cursor-pointer urgentInfoBtn"
          @click="openUregentAlarmRecord"
        >
          <span>历史应急信息</span>
          <!-- <span class="arrow"></span> -->
          <img src="@/assets/imgs/icon-arrow.png" class="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { removeFaildLoadImg } from '@/utils/tools.js'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const router = useRouter()

// --- 页面切换
const curRouteName = computed(() => {
  console.log('cur route name', router.currentRoute.value.name)
  return router.currentRoute.value.name
})
const showHeaderLink = computed(() => {
  return ['login', 'home'].indexOf(curRouteName.value) === -1
})
const jumpPage = (name) => {
  router.push({ name })
}

// ---天气
var weatherIcon = ref(null) // 天气icon码 对应 assets/weatherImg
var weathertext = ref(null) // 天气描述
var weathertemp = ref(null) // 温度
var airaqi = ref(null) // 	空气质量指数
var aircategory = ref(null) //	空气质量指数级别
var airIcon = ref(null)
var aircolor = ref(null)
var warningData = ref([])

const getWeater = () => {
  //和风天气api 获取天气
  //dev.qweather.com/docs/api/weather/weather-now/
  axios
    .get(
      `https://devapi.qweather.com/v7/weather/now?location=121.446091,30.901693&key=bff8cdf327dd43a6b88d9b15351db01b`,
    )
    .then((res) => {
      if (res.data.code == 200) {
        weatherIcon.value = new URL(
          `../../assets/imgs/weatherImg/${res.data.now.icon}@2x.png`,
          import.meta.url,
        ).href
        weathertext.value = res.data.now.text
        weathertemp.value = res.data.now.temp
      }
    })
  //和风天气api 获取空气指数
  //https://dev.qweather.com/docs/api/air/air-now/
  axios
    .get(
      `https://devapi.qweather.com/v7/air/now?location=121.446091,30.901693&key=bff8cdf327dd43a6b88d9b15351db01b`,
    )
    .then((res) => {
      if (res.data.code == 200) {
        airaqi.value = res.data.now.aqi
        aircategory.value = res.data.now.category
        switch (res.data.now.category) {
          case '优':
            airIcon.value = 'you'
            aircolor.value = '#04E600'
            break
          case '良':
            airIcon.value = 'liang'
            aircolor.value = '#FEFF00'
            break
          case '轻度污染':
            airIcon.value = 'qing'
            aircolor.value = '#FF7D01'
            break
          case '中度污染':
            airIcon.value = 'zhong'
            aircolor.value = '#FE0000'
            break
          case '重度污染':
            airIcon.value = 'zhong2'
            aircolor.value = '#9B024D'
            break
          case '严重污染':
            airIcon.value = 'yan'
            aircolor.value = '#7B0024'
            break
        }
        airIcon.value = new URL(
          `../../assets/imgs/airImg/${airIcon.value}.png`,
          import.meta.url,
        ).href
      }
    })
  //和风天气api 灾害预警
  //https://dev.qweather.com/docs/api/warning/weather-warning/
  axios
    .get(
      `https://devapi.qweather.com/v7/warning/now?location=121.446091,30.901693&key=bff8cdf327dd43a6b88d9b15351db01b`,
    )
    .then((res) => {
      if (res.data.code == 200) {
        if (res.data.warning.length > 0) {
          warningData.value = res.data.warning
        }
      }
    })
}

const getWarningImg = (item) => {
  return new URL(
    `../../assets/imgs/warningImg/${item.typeName}-${item.level[0]}@2x.png`,
    import.meta.url,
  ).href
}
// 调用
getWeater()

// --- 时间
const today = dayjs(new Date())
const month = ref(today.format('YYYY年M月D日')) //月份
const time = ref(today.format('HH:mm:ss')) //时间
const week = ref(today.format('ddd')) //周

const refreshTime = () => {
  setTimeout(() => {
    const now = dayjs(new Date())
    month.value = now.format('YYYY年M月D日')
    time.value = now.format('HH:mm:ss')
    week.value = now.format('ddd')
    refreshTime()
  }, 1000)
}
refreshTime()

// 打开应急信息记录
import { useDetailStore } from '@/stores/Control/Detail/index.js'
import { useDetailStore as useVQLDetailStore } from '@/stores/VideoQuickLink/Detail/index.js'
const detailStore = useDetailStore()
const vqlDetailStore = useVQLDetailStore()
const openUregentAlarmRecord = () => {
  if (curRouteName.value === 'Control') detailStore.showDetail({ key: 'UrgentAlarmRecord' })
  else vqlDetailStore.showDetail({ key: 'UrgentAlarmRecord' })
}

// --- 录屏
// 该方案废弃，太卡了
// import { Recorder, Player } from 'timecatjs'
// let recorder = null
// let player = null
// // 需要安装 npm i timecatjs
// const changeRecord2 = () => {
//   if (recorder) {
//     recorder?.destroy() // 当组件销毁的时候，把 Recorder 销毁掉，停止录制视频

//     document.querySelector('#app').innerHTML = ''
//     // 当组件挂载的时候，实例化 Player，开始播放视频
//     player = new Player({
//       target: '#app'
//     })
//   } else {
//     recorder = new Recorder() // 实例化 Recorder即开始录制视频
//   }
// }

import { ScreenRecorder } from '@/utils/record.js'
const screenRecorder = new ScreenRecorder()
const changeRecord = async () => {
  if (screenRecorder.status === 0) {
    await screenRecorder.getScreenStream()
    screenRecorder.start()
  } else {
    screenRecorder.stop()
  }
}
</script>
<style scoped lang="less">
.headerBg {
  width: 3840px;
  height: 180px;
  z-index: 190;
  pointer-events: none;
}

.headerWrap {
  width: 3840px;
  // height: 180px;
  z-index: 1010;

  .content {
    height: 78px;
    white-space: nowrap;
    position: relative;

    .text_normal {
      // font-family: PingFangSC-Regular;
      font-family: PingFang;
      font-weight: 400;
      font-size: 24px;
      color: #839cb9;
      letter-spacing: 1px;
      line-height: 24px;
    }
  }

  .weather {
    margin-left: 30px;

    .icon_2 {
      width: 32px;
    }

    .icon_1 {
      width: 32px;
    }
  }

  .ctrls {
    &.left {
      left: 675px;
      width: 530px;
    }

    &.right {
      right: 650px;
      width: 580px;
    }

    &_item {
      opacity: 0.4;
      font-family: Source-KeynoteartHans-Regular;
      font-weight: 400;
      font-size: 26px;
      color: #dbf0ff;
      letter-spacing: 1px;
      line-height: 30px;
      text-shadow: 0 0 8px #70b0ffa6;
      cursor: pointer;
      transition: color 0.4s;

      &.active {
        opacity: 1;
        color: #a9f1ff;
      }
    }
  }

  .time {
    margin-right: 30px;

    .companyLogo {
      width: 140px;
      height: 46px;
    }

    .recordBtn,
    .urgentInfoBtn {
      // width: 114px;
      height: 30px;
      background:
        linear-gradient(180deg, rgba(12, 65, 207, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%), #010a1e;
      border-radius: 2px;
      border: 1px solid rgba(30, 123, 214, 0.4);
      span {
        font-family: AlibabaPuHuiTi, AlibabaPuHuiTi;
        font-weight: 400;
        font-size: 22px;
        color: #d4edfd;
        line-height: 28px;
      }
      .arrow {
        width: 28px;
        height: 28px;
      }
    }
  }
}
</style>
