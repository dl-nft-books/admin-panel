import {
  deserialize,
  isDeeperThanOneNesting,
  TJsonApiData,
} from '@distributedlab/jac'
import { isObject, cloneDeep } from 'lodash-es'

/**
 *
 * @param data - JsonApi data object, that has number of nestings
 *
 * eg. your raw response looks like this
 *
 * @example
 * ```
 * {
 *   "data": {
 *     "id": "",
 *     "type": "nested",
 *     "attributes": {
 *       "nested": [
 *         {
 *           "id": "",
 *           "type": "nested",
 *           "attributes": {
 *             "amount": 3,
 *             "chain_id": 137
 *           }
 *         }
 *       ],
 *       "total": 10
 *     }
 *   }
 * }
 * ```
 * First level will be parsed and flattened by `JsonApiClient` to this
 *
 * @example
 * ```
 * {
 *   "data": {
 *     "id": "",
 *     "type": "nested",
 *      "nested": [
 *         {
 *           "id": "",
 *           "type": "nested",
 *           "attributes": {
 *             "amount": 3,
 *             "chain_id": 137
 *           }
 *         }
 *       ],
 *      "total": 10
 *   }
 * }
 *```
 * This function will flatten object completely
 *
 * @example
 * ```
 * {
 *   "data": {
 *     "id": "",
 *     "type": "nested",
 *      "nested": [
 *         {
 *           "id": "",
 *           "type": "nested",
 *           "amount": 3,
 *           "chain_id": 137
 *         }
 *       ],
 *      "total": 10
 *   }
 * }
 *```
 *
 * @returns  - data object flattened to expected T type
 */
export function flattenNestedResponseData<T extends object>(data: T): T {
  const flattenedData = cloneDeep(data)

  for (const [key, value] of Object.entries(data)) {
    if (!isObject(value)) continue

    const flattenedValue = deserialize({ data: value as TJsonApiData })

    flattenedData[key as keyof T] = isDeeperThanOneNesting(flattenedValue)
      ? (flattenNestedResponseData(flattenedValue) as T[keyof T])
      : (flattenedValue as T[keyof T])
  }

  return flattenedData
}
