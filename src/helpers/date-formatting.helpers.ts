import { DateUtil } from '@/utils/date.util'
import { ConfigType } from 'dayjs'

export function formatMDY(date: ConfigType) {
  return DateUtil.format(
    typeof date == 'number' ? DateUtil.fromTimestampSec(date) : date,
    'MMMM D, YYYY',
  )
}

export function formatDMY(date: ConfigType) {
  return DateUtil.format(
    typeof date == 'number' ? DateUtil.fromTimestampSec(date) : date,
    'D MMM, YYYY',
  )
}
