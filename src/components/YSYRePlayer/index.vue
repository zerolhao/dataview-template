<script setup>
import {
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref,
  toRefs,
  useTemplateRef,
  watch,
} from 'vue'

// 截图
import EZUIKit from 'ezuikit-js'
import { debounce } from 'lodash'

import { getToken } from '@/api/dataview'
import { expirableLocalStorage } from '@/utils/expirableStorage'
import { randomString } from '@/utils/tools.js'

const props = defineProps({
  url: { type: String, default: '' },
  info: { type: Object, default: () => {} },
  loading: { type: Boolean, default: true },
  autoPlay: { type: Boolean, default: true },
  audio: {
    type: Number,
    default: 0,
  },
  footer: {
    type: [Boolean, Array],
    default: () => ['hd', 'fullScreen'],
  },
  show: { type: Boolean, default: true },
})
const emits = defineEmits(['firstFrameDisplay', 'error'])
const { info, audio, show } = toRefs(props)

const videoId = ref(randomString(62))
const player = ref(null)
const token = ref(expirableLocalStorage.getItem('ys7Token') || '')
const deviceSerial = ref('')
const channelNo = ref('')

watch(
  () => info.value,
  () => {
    stop()
    if (!info.value.devId) return
    initOpts()
    if (props.autoPlay) getData().then(start, playFailed)
  },
)

const ysyWrapRef = useTemplateRef('ysyWrapRef')
const resizeObserver = new ResizeObserver(
  debounce(() => {
    resizePlayer()
  }, 50),
)

const resizePlayer = () => {
  // console.log('!!!!!!resize 萤石云', ysyWrapRef.value.offsetWidth, ysyWrapRef.value.offsetHeight)
  if (player.value && ysyWrapRef.value?.offsetWidth && ysyWrapRef.value?.offsetHeight)
    player.value.reSize(ysyWrapRef.value.offsetWidth, ysyWrapRef.value.offsetHeight)
}

onMounted(async () => {
  if (!info.value.devId) return
  initOpts()

  if (props.autoPlay) getData().then(start, playFailed)

  // token.value = 'at.d0jbw0s7bi0kf89w1ma09s0dbn0zwtvt-13m2t9xhq7-13cwkba-rdxzqfilf'
  // initVideo()
  // start()

  // 设置播放容器的宽高并监听窗口大小变化
  window.addEventListener('resize', resizePlayer)

  if (ysyWrapRef.value) resizeObserver.observe(ysyWrapRef.value)
})
onUnmounted(() => {
  window.removeEventListener('resize', resizePlayer)
  resizeObserver.disconnect()
  stop()
})
onActivated(() => {
  console.log('activated ysy player 继续播放')
  start()
})
onDeactivated(() => {
  if (player.value) player.value.stop()
})

const initOpts = () => {
  player.value = null

  deviceSerial.value = info.value.devId
  channelNo.value = info.value.gbExternalIndexCode || 1
}

const getData = () => {
  if (!info.value.devId) return Promise.reject(new Error('缺少设备ID，无法获取视频token'))

  if (token.value) {
    // console.log('已有token，直接播放');
    initVideo()
    return Promise.resolve(true)
  } else
    return getToken().then((res) => {
      const { accessToken, expireTime } = res
      token.value = accessToken || ''
      if (token.value) {
        expirableLocalStorage.setItem('ys7Token', token.value, expireTime)
        initVideo()

        return true
      } else {
        throw new Error('未获取到视频流')
      }
    })
}

const initVideo = () => {
  // ezopen://open.ys7.com/FQ4343862/1.hd.local.rec?begin=20260315000000&end=20260315235959

  let url = `ezopen://open.ys7.com/${deviceSerial.value}/${channelNo.value}.hd.local.rec`
  if (props.url) url = props.url
  // console.log('init player', videoId.value, url, token.value);
  const option = {
    id: videoId.value, // 视频容器ID
    accessToken: token.value,
    url,
    audio: audio.value,
    // width: countPx(width.value),
    // height: countPx(height.value),
    template: 'pcRec',
    handleSuccess: (err) => {
      console.log('## 播放成功', err)

      playSuccess()
    },
    handleError: async (err) => {
      console.log('!! 播放错误', err)
      playFailed('播放失败！')
    },
  }
  // if (footer.value && footer.value.length) option.footer = footer.value
  player.value = new EZUIKit.EZUIKitPlayer(option)
}
const start = () => {
  // console.log('开启', )
  // 首次打开就点进视频，必须参数请求数据还没返回
  if (!token.value) {
    // console.log('请求过慢，第2次请求获取token再播放');
    return getData().then(start)
  }
  if (!player.value) initVideo()
}
const stop = () => {
  // console.log('关闭');
  if (player.value) {
    player.value.destroy()
    player.value = null
  }
}

const playSuccess = () => {}
const playFailed = (msg) => {
  emits('error', msg)
}
</script>
<template>
  <div class="ysyVideoWrap relative h-full w-full" ref="ysyWrapRef">
    <div :id="videoId" class="video"></div>
  </div>
</template>
<style lang="less" scoped>
.ysyVideoWrap {
  background: gray;
}

.poster {
  z-index: 1;
  object-fit: cover;
  /* object-fit: contain; */
}

.video {
  width: 100%;
  height: 100%;
  // :deep(iframe) {
  //   width: 100% !important;
  //   height: 100% !important;
  // }
  // :deep(.audio-controls) {
  //   position: absolute;
  //   bottom: 0;
  //   left: 0;
  //   height: 48px;
  //   display: inline-flex;
  //   align-items: center;
  //   background: rgba(0, 0, 0, 0.6);
  //   .contros {
  //     top: auto;
  //     display: inline-flex;
  //     align-items: baseline;
  //     #video-hd {
  //       font-size: 16px;
  //       line-height: 16px;
  //       margin-right: 10px;
  //     }
  //   }
  // }
}
</style>
