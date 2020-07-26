/**
 * 用户相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');
var fun_md5 = require('../utils/tools/Encrypt/md5')
import { decrypt } from '../utils/tools/Encrypt/main'
/**
 * 解密token
 */
function decryptToken(key,text) {
    var str_md5 = fun_md5.hex_md5(key)
    var tmp = str_md5.split('')
    var str1 = ""
    for (var i = 0; i < tmp.length; i++) {
      if (i % 2 != 0) {
        str1 = str1.concat(tmp[i])
      }
    }
    let token = decrypt(str1, text) || ''
    return token
}
/**
 * 调用微信登录
 */
function loginByWeixin() {
  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((code) => {
      //登录远程服务器
      util.request(api.AuthLoginByWeixin, { js_code: code, type: 2}, 'POST').then(res => {
        if (res.error_code === 0) {
          //存储用户信息
          const { access_token, refresh_token } = res.data
          let token = decryptToken(refresh_token,access_token)
          wx.setStorageSync('token', token)
          wx.setStorageSync('refresh_token', refresh_token)
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {

      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });

    } else {
      reject(false);
    }
  });
}
function checkPermission(){
  return new Promise(function (resolve, reject) {
    util.request(api.scope).then((res)=>{

    })
  });
}

function tmp(){
  return new Promise(function (resolve, reject) {

  });
}

module.exports = {
  loginByWeixin,
  checkLogin,
};