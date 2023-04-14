import { api } from '@/api'
import { Statistics } from '@/types'

export function useStatistics() {
  const getStatistics = () => {
    return api.get<Statistics[]>('/integrations/tracker/statistics')
  }

  return {
    getStatistics,
  }
}
