export const IS_PRODUCTION = import.meta.env.PROD
export const IS_REM = IS_PRODUCTION ? true : true
export const IS_MOCK = IS_PRODUCTION ? false : true // 无内网使用mock
export const PAGE_SIZE = 3840

export const GD_SECURITYJSCODE = 'b08d5a3239e0136a9131cb5453db479f' // '6729afc1444e1b0de054bb828152b2a9'
export const GD_KEY = '4dcce987a17bee84e48e70bffbec815c' // '9c53d64ea919d68d06ca8e29cb2211bd'

export default {
  PAGE_SIZE,
  IS_REM,
  IS_MOCK,
  IS_PRODUCTION,
  GD_SECURITYJSCODE,
  GD_KEY,
}
