import en from './resources/en.json'
import enConfig from './resources/en.config.json'
import { DateTimeFormat } from '@intlify/core-base'

export default {
  messages: { en },
  datetimeFormats: {
    en: enConfig.datetimeFormats as DateTimeFormat,
  },
}
