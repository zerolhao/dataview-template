import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/font/index.css'
import '@/assets/styles/main.css'
import './assets/styles/index.less'

import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import NoData from '@/components/NoData/index.vue'
import CountTo from 'vue3-count-to'
import { Form, FormItem, Input, Checkbox, InputNumber, Button, Pagination } from 'ant-design-vue'

// 设置rem适配
import '@/utils/rem.js'

// dayjs 设置中文
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const app = createApp(App)
const pinia = createPinia()

// 全局注册组件
app.component('NoData', NoData)
app.use(CountTo)
app.use(Form)
app.use(FormItem)
app.use(Input)
app.use(Checkbox)
app.use(InputNumber)
app.use(Button)
app.use(Pagination)

// 持久化插件，持久化pinia数据
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
