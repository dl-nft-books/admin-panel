import { api } from '@/api'
import { Statistics, StatisticByBook } from '@/types'

export function useStatistics() {
  const getStatistics = () => {
    return api.get<Statistics>('/integrations/tracker/statistics')
  }

  const getStatisticByBookId = (id: string) => {
    return api.get<StatisticByBook>(`/integrations/tracker/statistics/${id}`)
  }

  return {
    getStatistics,
    getStatisticByBookId,
  }
}
