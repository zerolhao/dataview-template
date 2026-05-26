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
  muted: { type: Boolean, default: true }, // 静音
})
const emits = defineEmits(['firstFrameDisplay', 'error'])
const { info, muted } = toRefs(props)

const videoId = ref(`video${randomString(62)}`)
const player = ref(null)
const token = ref(expirableLocalStorage.getItem('ys7Token') || '')
const deviceSerial = ref('')
const channelNo = ref('')

const isLoading = ref(!!props.loading)
const showPoster = ref(true)
const errMsg = ref('')

watch(
  () => info.value,
  () => {
    stop()
    if (!info.value.devId) return
    initOpts()
    if (props.autoPlay) getData().then(start)
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

  if (props.autoPlay) getData().then(start)
  else isLoading.value = false

  // generateWatermarkContainer();
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
  if (!info.value.devId) return Promise.reject(new Error('没有通道号'))

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
        errMsg.value = res.result?.msg || '未获取到视频流'

        throw new Error(errMsg.value)
      }
    })
}

const initVideo = () => {
  // ezopen://open.ys7.com/J45980713/1.hd.live 通道一直为1
  let url = `ezopen://open.ys7.com/${deviceSerial.value}/${channelNo.value}.live`
  if (props.url) url = props.url
  const option = {
    id: videoId.value, // 视频容器ID
    accessToken: token.value,
    url,
    muted: muted.value,
    // width: countPx(width.value),
    // height: countPx(height.value),
    // template: 'simple',
    template: 'f850b739ff32437eb30d9d3b3222bbe1', // 自定义播放模板
    decoderType: 'v1', // 解码模式，v1：兼容性优先模式，v3：性能优先模式
    handleSuccess: (err) => {
      console.log(info.value.devId, '## 播放成功', info.value.devId, err)
    },
    handleError: async (err) => {
      console.log(info.value.devId, '!! 播放错误', info.value.devId, err)
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
  if (player.value) {
    player.value.destroy()
    player.value = null
  }
}

const playSuccess = () => {
  showPoster.value = false
  isLoading.value = false
  errMsg.value = ''
}
const playFailed = (msg) => {
  showPoster.value = true
  isLoading.value = false
  errMsg.value = msg
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

.waterMark {
  z-index: 1;
}
</style>
