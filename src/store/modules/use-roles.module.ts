import { ROLES, useRolesManager } from '@/composables'
import { defineStore } from 'pinia'

export const useRolesStore = defineStore('roles', {
  state: () => ({
    rolesManager: useRolesManager(),
  }),
  actions: {
    async grantRole(role: ROLES, address: string) {
      await this.rolesManager.grantRole(role, address)
    },
  },

  getters: {
    hasAdminRole: state => state.rolesManager.hasAdminRole,
    hasRoleManagerRole: state => state.rolesManager.hasRolesManagerRole,
    hasMarkerplaceManagerRole: state =>
      state.rolesManager.hasMarketplaceManagerRole,
    hasWithdrawalManagerRole: state =>
      state.rolesManager.hadWithdrawalManagerRole,
    isLoadingRoles: state => state.rolesManager.isLoadingRoles,
    hasNoRoles: state =>
      state.rolesManager.isLoadingFailed || state.rolesManager.hasNoRoles,
  },
})
