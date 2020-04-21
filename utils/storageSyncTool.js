// 定义登录token的key(键名),在获取/存储的时候,通过这个key获取和存储
const Access_TOKEN_KEY = 'accessToken'
const Refresh_TOKEN_KEY = 'refreshToken'
/**
 * 存入缓存
 * @param {缓存key} key 
 * @param {缓存value} value 
 */
const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    return false
  }
}
/**
 * 获取缓存值
 * @param {缓存key} key 
 */
const getStorage = (key) => {
  try {
    const value = wx.getStorageSync(key)
    return value
  } catch (e) {
    return false
  }
}
/**
 * 清除缓存
 * @param {缓存key} key 
 */
const clearStorage = key => {
  try {
    wx.clearStorageSync(key)
    return true
  } catch (e) {
    return false
  }
}
/**
 * 缓存AccessToken
 * @param {AccessToken} value 
 */
const setAccessToken = (value) => {
  return setStorage(Access_TOKEN_KEY, value)
}
/**
 * 获取缓存的AccessToken
 */
const getAccessToken = () => {
  return getStorage(Access_TOKEN_KEY)
}
/**
 * 清除Access_TOKEN_KEY
 */
const clearAccessToken = () => {
  return clearStorage(Access_TOKEN_KEY)
}

/**
 * 缓存Refresh_TOKEN_KEY
 * @param {Refresh_TOKEN_KEY} value 
 */
const setRefreshToken = (value) => {
  return setStorage(Refresh_TOKEN_KEY, value)
}

/**
 * 获取缓存的Refresh_TOKEN_KEY
 */
const getRefreshToken = () => {
  return getStorage(Refresh_TOKEN_KEY)
}
/**
 * 清除Refresh_TOKEN_KEY
 */
const clearRefreshToken = () => {
  return clearStorage(Refresh_TOKEN_KEY)
}

module.exports = {
  getStorage,
  setStorage,
  clearStorage,
  setAccessToken,
  getAccessToken,
  clearAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearRefreshToken
}
