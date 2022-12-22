import { getCurrentInstance } from 'vue'
import { VueI18nTranslation, VueI18nDateTimeFormatting, Locale } from 'vue-i18n'
import { config } from '@config'
import { ROUTE_NAMES, ICON_NAMES } from '@/enums'

export const useContext = (): {
  $t: VueI18nTranslation
  $d: VueI18nDateTimeFormatting
  $locale: Locale
  $config: typeof config
  $routes: typeof ROUTE_NAMES
  $icons: typeof ICON_NAMES
} => {
  const app = getCurrentInstance()

  if (!app) throw new Error('No app')

  const { $t, $d, $locale, $config, $routes, $icons } =
    app.appContext.config.globalProperties

  return {
    $t,
    $d,
    $locale,
    $config,
    $routes,
    $icons,
  }
}
