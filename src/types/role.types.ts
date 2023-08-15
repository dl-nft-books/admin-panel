export type FullUserRoleInfo = UserRoleAdditionalInfo &
  Omit<RoleBaseInfo, 'members'>

export type RoleBaseInfo = {
  roleName: string
  role: string
  members: Array<string>
}

export type UserRoleAdditionalInfo = {
  address: string
  name: string
  created_at: string
}
