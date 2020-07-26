import env from "env.js";
import { Token } from "token";
import { redis_get_token } from "./redis.js";
var log = require("../../log"); // 引用上面的log.js文件
class axios {
    constructor() {}

    /**
     * 设置统一的异常处理
     */
    setErrorHandler(handler, toast) {
        this._errorHandler = handler;
        console.log(handler);
        this.showToast(toast);
    }
    // 重新请求
    async _refetch(params) {
        var token = new Token();
        await token.getTokenFromServer();
        setTimeout(() => {
            this.axios(params, true);
        }, 3000);
    }

    axios(param, noRefetch) {
        return this.requestAll(param, noRefetch);
    }
    /**
     * 网络请求
     * @param {*} param
     * @param {*} noRefetch 当noRefech为true时，不做未授权重试机制
     */
    requestAll(param, noRefetch = false) {
        return new Promise((resolve, reject) => {
            var token = new Token();
            let verify = redis_get_token("token");
            let promise = null;
            if (verify == "needLogin") {
                promise = token.getTokenFromServer();
            } else if (verify == null) {
                promise = token._refresh_token();
            }
            if (promise != null) {
                promise.then((value) => {
                    this.wx_request(param, value, resolve, reject, noRefetch)
                });
            }
            else{
                this.wx_request(param, verify, resolve, reject, noRefetch)
            }
        }).catch((reason) => {
            return Promise.resolve({
                msg: "网络请求失败，请检查本地网络是否连接。",
                error_code: 504,
            });
        });
    }

    wx_request(param, token, resolve, reject, noRefetch){
        wx.request({
            url: env.host.baseUrl + param.url,
            data: param.data,
            header: {
                "content-type": "application/json",
                Authorization: "Bearer " + token,
            },
            method: param.method ? param.method : "GET",
            success: (res) => {
                let statusCode = res.statusCode;
                if (statusCode === 200) {
                    if (res.data.error_code == 5040) {
                        if (!noRefetch) {
                        this._refetch(param);
                        }
                    } else if (res.data.error_code === 5000) {
                        wx.showToast({
                            title: "网络异常，请稍后再试",
                            icon: "none",
                            duration: 3000,
                        });
                    }
                    resolve(res.data);
                } else {
                    wx.reportMonitor("0", 1);
                    reject(res.data);
                }
            },
            fail: (res) => {
                console.log(res);
                reject(res);
            },
        });
    }
}



export { axios };
