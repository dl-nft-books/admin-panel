import { ref } from 'vue'
import { Contract, ContractInterface } from 'ethers'
import { ERC20ABI } from '@/constants'
import { UseProvider } from '@/types'
import { BN } from '@/utils/math.util'

export const useErc20 = (
  provider: UseProvider,
  address?: string,
  abi?: ContractInterface,
) => {
  const _instance = ref<Contract | undefined>()
  const _instance_rw = ref<Contract | undefined>()

  if (address) {
    _instance.value = new Contract(
      address,
      abi || ERC20ABI,
      provider.currentProvider.value,
    )
    _instance_rw.value = new Contract(
      address,
      abi || ERC20ABI,
      provider.currentSigner.value,
    )
  }

  const init = (address: string, abi: ContractInterface) => {
    _instance.value = new Contract(
      address,
      abi || ERC20ABI,
      provider.currentProvider.value,
    )
    _instance_rw.value = new Contract(
      address,
      abi || ERC20ABI,
      provider.currentSigner.value,
    )
  }

  const allowance = ref('')

  const decimals = ref('')

  const name = ref('')

  const owner = ref('')

  const symbol = ref('')

  const totalSupply = ref('')

  const balance = ref('')

  const loadDetails = async () => {
    if (!_instance.value) return

    await Promise.all([
      getDecimals(),
      getName(),
      getOwner(),
      getSymbol(),
      getTotalSupply(),
    ])
    if (provider.currentSigner.value) {
      balance.value = await getBalanceOf(
        await provider.currentSigner.value?.getAddress(),
      )
    }
  }

  const approve = async (spender: string, amount: number) => {
    await _instance_rw.value?.approve(spender, amount)
  }

  const decreaseAllowance = async (
    spender: string,
    subtractedValue: number,
  ) => {
    await _instance_rw.value?.decreaseAllowance(spender, subtractedValue)
  }

  const increaseAllowance = async (spender: string, addedValue: number) => {
    await _instance_rw.value?.increaseAllowance(spender, addedValue)
  }

  const mint = async (to: string, amount: number) => {
    await _instance_rw.value?.mint(
      to,
      new BN(amount).toFraction(+decimals.value).toString(),
    )
  }

  const renounceOwnership = async () => {
    await _instance_rw.value?.renounceOwnership()
  }

  const transfer = async (address: string, amount: number) => {
    await _instance_rw.value?.transfer(
      address,
      new BN(amount).toFraction(+decimals.value).toString(),
    )
  }

  const transferFrom = async (from: string, to: string, amount: number) => {
    await _instance_rw.value?.transferFrom(from, to, amount)
  }

  const getAllowance = async (owner: string, spender: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    allowance.value = await _instance.value?.allowance(owner, spender)
  }

  const getBalanceOf = async (address: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return _instance.value.balanceOf(address)
  }

  const getDecimals = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    decimals.value = await _instance.value.decimals()
  }

  const getName = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    name.value = await _instance.value.name()
  }

  const getOwner = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    owner.value = await _instance.value.owner()
  }

  const getSymbol = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    symbol.value = await _instance.value.symbol()
  }

  const getTotalSupply = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    totalSupply.value = await _instance.value.totalSupply()
  }

  return {
    allowance,
    decimals,
    name,
    owner,
    symbol,
    totalSupply,
    balance,

    init,
    loadDetails,

    useErc20,
    approve,
    decreaseAllowance,
    increaseAllowance,
    mint,
    renounceOwnership,
    transfer,
    transferFrom,

    getAllowance,
    getBalanceOf,
    getDecimals,
    getName,
    getOwner,
    getSymbol,
    getTotalSupply,
  }
}
