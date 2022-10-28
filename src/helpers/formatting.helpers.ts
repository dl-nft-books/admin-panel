export function cropAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-4)}`
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}
