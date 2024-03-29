import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'
import { useAuthStore } from '@/store'

enum ROUTE_METAS {
  isRequiredAuth = 'isRequiredAuth',
  isRequiredUnAuth = 'isRequiredUnAuth',
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.app },
  },
  {
    path: '/login',
    name: ROUTE_NAMES.login,
    meta: {
      [ROUTE_METAS.isRequiredUnAuth]: true,
    },
    component: () => import('@/pages/LoginPage.vue'),
  },
  {
    path: '/',
    name: ROUTE_NAMES.app,
    component: () => import('@/layouts/AuthorizedLayout.vue'),
    children: [
      {
        path: '/nfts',
        name: ROUTE_NAMES.nfts,
        meta: {
          [ROUTE_METAS.isRequiredAuth]: true,
        },
        component: () => import('@/pages/NftsPage.vue'),
        redirect: { name: ROUTE_NAMES.nftsOverview },
        children: [
          {
            path: '/nfts/create',
            name: ROUTE_NAMES.nftsCreate,
            meta: {
              [ROUTE_METAS.isRequiredAuth]: true,
            },
            component: () => import('@/pages/CreateNftPage.vue'),
          },
          {
            path: '/nfts/overview',
            name: ROUTE_NAMES.nftsOverview,
            meta: {
              [ROUTE_METAS.isRequiredAuth]: true,
            },
            component: () =>
              import('@/pages/overview-nft-page/OverviewNfts.vue'),
          },
          {
            path: '/nfts/:id',
            name: ROUTE_NAMES.nftItem,
            component: () => import('@/pages/nft-item-page/NftItemPage.vue'),
            props: true,
            meta: {
              [ROUTE_METAS.isRequiredAuth]: true,
            },
          },
          {
            path: '/nfts/:id/edit',
            name: ROUTE_NAMES.nftItemEdit,
            component: () => import('@/pages/EditNftPage.vue'),
            props: true,
            meta: {
              [ROUTE_METAS.isRequiredAuth]: true,
            },
          },
        ],
      },
      {
        path: '/promocodes',
        name: ROUTE_NAMES.promocodes,
        meta: {
          [ROUTE_METAS.isRequiredAuth]: true,
        },
        component: () => import('@/pages/promocodes-page/PromocodesPage.vue'),
      },
      {
        path: '/vouchers',
        name: ROUTE_NAMES.vouchers,
        meta: {
          [ROUTE_METAS.isRequiredAuth]: true,
        },
        component: () => import('@/pages/vouchers-page/VouchersPage.vue'),
      },
      {
        path: '/roles',
        name: ROUTE_NAMES.roles,
        meta: {
          [ROUTE_METAS.isRequiredAuth]: true,
        },
        component: () =>
          import('@/pages/roles-manager-page/RolesManagerPage.vue'),
      },
      {
        path: '/withdrawals',
        name: ROUTE_NAMES.withdrawals,
        meta: {
          [ROUTE_METAS.isRequiredAuth]: true,
        },
        component: () => import('@/pages/withdrawals-page/WithdrawalsPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

router.beforeEach(async (to, from, next) => {
  if (to.name === ROUTE_NAMES.app) {
    redirectRouteGuard(to, from, next)
  } else if (
    to.matched.some(record => record.meta[ROUTE_METAS.isRequiredAuth])
  ) {
    inAppRouteGuard(to, from, next)
  } else if (
    to.matched.some(record => record.meta[ROUTE_METAS.isRequiredUnAuth])
  ) {
    authGuard(to, from, next)
  } else {
    next()
  }
})

function redirectRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const accountStore = useAuthStore()
  const isLoggedIn = accountStore.isLoggedIn

  if (isLoggedIn) {
    if (to.name === ROUTE_NAMES.app) {
      next({ name: ROUTE_NAMES.nfts })
    } else {
      next()
    }
  } else {
    next({ name: ROUTE_NAMES.login })
  }
}

function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const accountStore = useAuthStore()
  const isLoggedIn = accountStore.isLoggedIn

  if (isLoggedIn) {
    next({ name: ROUTE_NAMES.app })
  } else {
    next(next)
  }
}

function inAppRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const accountStore = useAuthStore()
  const isLoggedIn = accountStore.isLoggedIn

  if (isLoggedIn) {
    next()
  } else {
    next({ name: ROUTE_NAMES.login })
  }
}

export { router, useRouter, useRoute }
