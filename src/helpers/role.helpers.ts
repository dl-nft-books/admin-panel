import { ROUTE_NAMES } from '@/enums'
import { router } from '@/router'
import { useRolesStore, useAuthStore } from '@/store'
import { watch } from 'vue'

const waitUntilLoaded = (): Promise<void> => {
  const rolesStore = useRolesStore()

  return new Promise(resolve => {
    const stopWatching = watch(
      () => rolesStore.isLoadingRoles,
      () => {
        if (rolesStore.isLoadingRoles) return

        stopWatching()
        resolve()
      },
    )
  })
}

export const redirectByAccessLevel = async () => {
  const rolesStore = useRolesStore()
  const authStore = useAuthStore()

  if (rolesStore.isLoadingRoles) await waitUntilLoaded()

  if (rolesStore.hasMarkerplaceManagerRole) {
    router.push({ name: ROUTE_NAMES.nfts })
    return
  }

  if (rolesStore.hasRoleManagerRole) {
    router.push({ name: ROUTE_NAMES.roles })
    return
  }

  if (rolesStore.hasWithdrawalManagerRole) {
    router.push({ name: ROUTE_NAMES.withdrawals })
    return
  }

  if (rolesStore.hasNoRoles) {
    router.push({ name: ROUTE_NAMES.login })
    authStore.logout()
  }
}
