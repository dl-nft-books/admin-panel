import { DateUtil, DataConfigType } from '@/utils/date.util'

export function formatMDY(date: DataConfigType) {
  return DateUtil.format(
    typeof date == 'number' ? DateUtil.fromTimestampSec(date) : date,
    'MMMM D, YYYY',
  )
}

export function formatDMY(date: DataConfigType) {
  return DateUtil.format(
    typeof date == 'number' ? DateUtil.fromTimestampSec(date) : date,
    'D MMM, YYYY',
  )
}
