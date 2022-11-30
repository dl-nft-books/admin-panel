import { JsonApiClient } from '@/api/json-api'
import { config } from '@config'
import {
  attachBearerInjector,
  attachStaleTokenHandler,
} from '@/api/apiInterceptors'
import axios from 'axios'

const axiosInstance = axios.create()
attachBearerInjector(axiosInstance)
attachStaleTokenHandler(axiosInstance)

export const api = new JsonApiClient({
  baseUrl: config.API_URL,
  axios: axiosInstance,
})

export * from './utils'
export * from './requests'
