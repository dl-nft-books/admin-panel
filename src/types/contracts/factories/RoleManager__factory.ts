/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { RoleManager, RoleManagerInterface } from "../RoleManager";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "ADMINISTRATOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MARKETPLACE_MANAGER",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ROLE_SUPERVISOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SIGNATURE_MANAGER",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_FACTORY_MANAGER",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_MANAGER",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN_REGISTRY_MANAGER",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WITHDRAWAL_MANAGER",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "roleAdmin",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "roleName",
            type: "string",
          },
        ],
        internalType: "struct IRoleManager.BaseRoleData[]",
        name: "rolesInitData_",
        type: "tuple[]",
      },
    ],
    name: "__RoleManager_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllRolesBaseInfo",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "roleAdmin",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "roleName",
            type: "string",
          },
        ],
        internalType: "struct IRoleManager.BaseRoleData[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllRolesDetailedInfo",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "roleAdmin",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "roleName",
                type: "string",
              },
            ],
            internalType: "struct IRoleManager.BaseRoleData",
            name: "baseRoleData",
            type: "tuple",
          },
          {
            internalType: "address[]",
            name: "members",
            type: "address[]",
          },
        ],
        internalType: "struct IRoleManager.DetailedRoleInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllSupportedRoles",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getInjector",
    outputs: [
      {
        internalType: "address",
        name: "injector_",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role_",
        type: "bytes32",
      },
    ],
    name: "getRoleMembers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role_",
        type: "bytes32",
      },
    ],
    name: "getRoleMembersCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "roles_",
        type: "bytes32[]",
      },
    ],
    name: "getRolesBaseInfo",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "roleAdmin",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "roleName",
            type: "string",
          },
        ],
        internalType: "struct IRoleManager.BaseRoleData[]",
        name: "rolesBaseInfo_",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "offset_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit_",
        type: "uint256",
      },
    ],
    name: "getRolesBaseInfoPart",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "roleAdmin",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "roleName",
            type: "string",
          },
        ],
        internalType: "struct IRoleManager.BaseRoleData[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "roles_",
        type: "bytes32[]",
      },
    ],
    name: "getRolesDetailedInfo",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "roleAdmin",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "roleName",
                type: "string",
              },
            ],
            internalType: "struct IRoleManager.BaseRoleData",
            name: "baseRoleData",
            type: "tuple",
          },
          {
            internalType: "address[]",
            name: "members",
            type: "address[]",
          },
        ],
        internalType: "struct IRoleManager.DetailedRoleInfo[]",
        name: "rolesDetailedInfo_",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "offset_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit_",
        type: "uint256",
      },
    ],
    name: "getRolesDetailedInfoPart",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "bytes32",
                name: "role",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "roleAdmin",
                type: "bytes32",
              },
              {
                internalType: "string",
                name: "roleName",
                type: "string",
              },
            ],
            internalType: "struct IRoleManager.BaseRoleData",
            name: "baseRoleData",
            type: "tuple",
          },
          {
            internalType: "address[]",
            name: "members",
            type: "address[]",
          },
        ],
        internalType: "struct IRoleManager.DetailedRoleInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSupportedRolesCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "offset_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit_",
        type: "uint256",
      },
    ],
    name: "getSupportedRolesPart",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddr_",
        type: "address",
      },
    ],
    name: "getUserRoles",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role_",
        type: "bytes32",
      },
      {
        internalType: "address[]",
        name: "accounts_",
        type: "address[]",
      },
    ],
    name: "grantRoles",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "roles_",
        type: "bytes32[]",
      },
      {
        internalType: "address[][]",
        name: "accounts_",
        type: "address[][]",
      },
    ],
    name: "grantRolesBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
    ],
    name: "hasAnyRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role_",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "roles_",
        type: "bytes32[]",
      },
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
    ],
    name: "hasSpecificRoles",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "admin_",
        type: "address",
      },
    ],
    name: "isAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "manager_",
        type: "address",
      },
    ],
    name: "isMarketplaceManager",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role_",
        type: "bytes32",
      },
    ],
    name: "isRoleExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "supervisor_",
        type: "address",
      },
    ],
    name: "isRoleSupervisor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "manager_",
        type: "address",
      },
    ],
    name: "isSignatureManager",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "manager_",
        type: "address",
      },
    ],
    name: "isTokenFactoryManager",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "manager_",
        type: "address",
      },
    ],
    name: "isTokenManager",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "manager_",
        type: "address",
      },
    ],
    name: "isTokenRegistryManager",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "manager_",
        type: "address",
      },
    ],
    name: "isWithdrawalManager",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "rolesToRemove_",
        type: "bytes32[]",
      },
    ],
    name: "removeRoles",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role_",
        type: "bytes32",
      },
      {
        internalType: "address[]",
        name: "accounts_",
        type: "address[]",
      },
    ],
    name: "revokeRoles",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "roles_",
        type: "bytes32[]",
      },
      {
        internalType: "address[][]",
        name: "accounts_",
        type: "address[][]",
      },
    ],
    name: "revokeRolesBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractsRegistry_",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    name: "setDependencies",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "injector_",
        type: "address",
      },
    ],
    name: "setInjector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "roleAdmin",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "roleName",
            type: "string",
          },
        ],
        internalType: "struct IRoleManager.BaseRoleData[]",
        name: "rolesData_",
        type: "tuple[]",
      },
    ],
    name: "updateRolesParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class RoleManager__factory {
  static readonly abi = _abi;
  static createInterface(): RoleManagerInterface {
    return new utils.Interface(_abi) as RoleManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RoleManager {
    return new Contract(address, _abi, signerOrProvider) as RoleManager;
  }
}
