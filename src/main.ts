import '@/styles/app.scss'
import 'virtual:svg-icons-register'

import App from '@/App.vue'
import log from 'loglevel'

import VueToastificationPlugin from 'vue-toastification'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { createApp } from 'vue'
import { i18n } from '@/localization'
import { config } from '@config'
import { router } from '@/router'
import { store } from '@/store'
import MountedTeleport from '@/common/MountedTeleport.vue'

log.setDefaultLevel(config.LOG_LEVEL)

const app = createApp(App)
  .use(router)
  .use(store)
  .use(i18n)
  .use(VueToastificationPlugin)

app.config.globalProperties.$routes = ROUTE_NAMES
app.config.globalProperties.$config = config
app.config.globalProperties.$icons = ICON_NAMES

app.config.errorHandler = function (err, vm, info) {
  log.error(`Error: ${err}; Info: ${info}`)
}

app.component('mounted-teleport', MountedTeleport)
app.mount('#app')
