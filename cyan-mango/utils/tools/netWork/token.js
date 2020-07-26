import env from "env.js";
import API from "./apiMap";
import { encrypt, decrypt } from "../Encrypt/main";
var fun_md5 = require("../../tools/Encrypt/md5");
import { redis_set_token, redis_get_token } from "./redis.js";
// import  {Encrypt,Decrypt}  from '../encryption/main'
class Token {
    constructor() {
        (this.tokenUrl = env.host.baseUrl + API.token),
            (this.tokenRefreshUrl = env.host.baseUrl + API.refresh);
    }

    /**
     * 调用 API 接口，校验 token 是否有效
     */
    verify() {
        var token = redis_get_token("token");
        if (token == "needLogin") {
            /**
             * 不存在token，即用户第一次使用或本地数据被清空，需要登录服务器
             */
            this.getTokenFromServer();
        } else if (token == null) {
            /**
             * token过期，需要重新刷新
             */
          
            this._refresh_token();
        }
    }

    /**
     * 请求API接口，校验token的合法性
     * 如果不合法，会自动调用 getTokenFromServer 方法请求 token
     */
    _refresh_token() {
        var that = this;
        var Retoken = wx.getStorageSync("refresh_token");
        return new Promise((resolve, reject) => {
            wx.request({
                url: that.tokenRefreshUrl,
                method: "POST",
                header: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + Retoken,
                },
                success: function (res) {
                    var flag = res.statusCode === 200 ? true : false;
                    if (flag && res.data.error_code == 0) {
                        let newToken = that.getToken(
                            Retoken,
                            res.data.data.access_token
                        );
                        redis_set_token("token", newToken);
                        resolve(newToken);
                    } else if (res.data.error_code == 5040) {
                        that.getTokenFromServer();
                    } else {
                        reject(res.data);
                        wx.showToast({
                            title: "网络错误，请重试",
                        });
                    }
                },
            });
        });
    }
    /**
     * 解密token
     * @param {*} ket
     * @param {*} text
     */
    getToken(ket, text) {
        var str_md5 = fun_md5.hex_md5(ket);
        var tmp = str_md5.split("");
        var str1 = "";
        for (var i = 0; i < tmp.length; i++) {
            if (i % 2 != 0) {
                str1 = str1.concat(tmp[i]);
            }
        }
        let token = decrypt(str1, text);
        return token;
    }

    /**
     * 请求API接口，获取新的token
     */
    getTokenFromServer() {
        var that = this;
        return new Promise((resolve, reject) => {
            wx.login({
                success: function (res) {
                    wx.request({
                        url: that.tokenUrl,
                        method: "POST",
                        data: {
                            js_code: res.code,
                            type: 2,
                        },
                        success: function (res) {
                            if (res.statusCode === 200) {
                                if (res.data.error_code == 0) {
                                    resolve(res.data.data);
                                } else {
                                    // 系统登录出错，上报错误
                                    reject(res.data);
                                    wx.showToast({
                                        title: "系统维护中！",
                                        icon: "none",
                                    });
                                }
                            } else {
                                reject("网络错误，请重试");
                            }
                        },
                        fail: function (res) {
                            reject("网络请求失败");
                        },
                    });
                },
            });
        }).then(
            (value) => {
                const { access_token, refresh_token } = value;
                console.log(env.host.label)
                // 非生产环境不解密token
                if(env.host.label!='prod'){
                    redis_set_token("token", access_token);
                    wx.setStorageSync("refresh_token", refresh_token);
                    return Promise.resolve(access_token);
                }else{
                    let token = that.getToken(refresh_token, access_token);
                    redis_set_token("token", token);
                    wx.setStorageSync("refresh_token", refresh_token);
                    return Promise.resolve(token);
                }
                
            },
            (reason) => {
                wx.showToast({
                    title: reason,
                    icon: "none",
                });
            }
        );
    }
}

export { Token };
