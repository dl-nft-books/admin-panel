import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { PROVIDERS, ROUTE_NAMES } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler } from '@/helpers'

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
      },
      {
        path: '/nfts/:id',
        name: ROUTE_NAMES.nftItem,
        component: () => import('@/pages/NftItemPage.vue'),
        meta: {
          [ROUTE_METAS.isRequiredAuth]: true,
        },
      },
      {
        path: '/nfts/:id/edit',
        name: ROUTE_NAMES.nftItemEdit,
        component: () => import('@/pages/NftFormPage.vue'),
        meta: {
          [ROUTE_METAS.isRequiredAuth]: true,
        },
      },
      {
        path: '/ui-kit',
        name: ROUTE_NAMES.uiKit,
        component: () => import('@/pages/UiKitPage.vue'),
      },
      {
        path: '/web3',
        name: ROUTE_NAMES.web3,
        component: () => import('@/pages/Web3Page.vue'),
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
  const web3ProviderStore = useWeb3ProvidersStore()
  const isLoggedIn = web3ProviderStore.provider.selectedAddress

  if (!isLoggedIn) {
    try {
      await web3ProviderStore.detectProviders()

      // temporary
      const metamaskProvider = web3ProviderStore.providers.find(
        provider => provider.name === PROVIDERS.metamask,
      )

      if (metamaskProvider) {
        await web3ProviderStore.provider.init(metamaskProvider)
      }
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
  }

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
  const web3ProviderStore = useWeb3ProvidersStore()
  const isLoggedIn = web3ProviderStore.provider.selectedAddress

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
  const web3ProviderStore = useWeb3ProvidersStore()
  const isLoggedIn = web3ProviderStore.provider.selectedAddress

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
  const web3ProviderStore = useWeb3ProvidersStore()
  const isLoggedIn = web3ProviderStore.provider.selectedAddress

  if (isLoggedIn) {
    next()
  } else {
    next({ name: ROUTE_NAMES.login })
  }
}

export { router, useRouter, useRoute }
