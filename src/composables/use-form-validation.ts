import { computed, UnwrapNestedRefs } from 'vue'
import useVuelidate, { ChildStateLeafs, ValidationArgs } from '@vuelidate/core'
import { get } from 'lodash-es'

import { i18n } from '@/localization'

const { t } = i18n.global || i18n

export const useFormValidation = (
  state: UnwrapNestedRefs<ChildStateLeafs>,
  rules: ValidationArgs,
) => {
  const validationRules = computed(() => rules)

  const validationController = useVuelidate(validationRules, state)

  const isFieldsValid = computed(() => !validationController.value.$invalid)

  const isFormValid = (): boolean => {
    validationController.value.$touch()

    return !validationController.value.$invalid
  }

  const getFieldErrorMessage = (fieldPath: string): string => {
    let errorMessage = ''
    if (!validationController.value || !validationController.value.$invalid) {
      errorMessage = ''
    }

    const field = get(validationController.value, fieldPath)

    if (!field || !Object.keys(field).length) {
      throw new Error(
        `getFieldErrorMessage: Cannot find vuelidate field by '${fieldPath}'`,
      )
    }

    if (!field.$dirty) errorMessage = ''

    errorMessage = field.$errors.length
      ? (field.$errors[0].$message as string)
      : ''

    return errorMessage
  }

  const touchField = (fieldPath: string): void => {
    const field = get(validationController.value, fieldPath)

    if (field) {
      field.$touch()
    }
  }

  const getFieldArrayErrorMessage = (
    fieldPath: string,
    index: number,
    fieldName: string,
  ): string => {
    let errorMessage = ''
    if (
      !validationController.value ||
      !validationController.value.$invalid ||
      !validationController.value[fieldPath] ||
      !validationController.value[fieldPath][index]
    ) {
      errorMessage = ''
    }

    const field = get(validationController.value, fieldPath)

    if (!field || !Object.keys(field).length) {
      throw new Error(
        `getFieldArrayErrorMessage: Cannot find vuelidate field by '${fieldPath}[${index}].${fieldName}'`,
      )
    }

    if (!field.$dirty) errorMessage = ''

    if (
      !field.$each.$response.$errors.length ||
      !field.$each.$response.$errors[index][fieldName].length
    ) {
      return ''
    }

    const errorPath = field.$each.$response.$errors[index][fieldName][0]
    const processedError = [
      errorPath.$message.split('_')[0],
      errorPath.$validator,
    ].join('_')

    errorMessage = t(processedError as string)

    return errorMessage
  }

  return {
    isFieldsValid,
    getFieldErrorMessage,
    getFieldArrayErrorMessage,
    touchField,
    isFormValid,
  }
}
