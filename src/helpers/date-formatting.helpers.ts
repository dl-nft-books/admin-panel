import { DateUtil } from '@/utils/date.util'

export function formatDMY(date: number | string) {
  return DateUtil.format(
    typeof date == 'number' ? DateUtil.fromTimestampSec(date) : date,
    'DD/MM/YYYY',
  )
}
