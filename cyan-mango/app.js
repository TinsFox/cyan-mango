//app.js
import { Token } from "./utils/tools/netWork/token";
import { axios } from "./utils/tools/netWork/axios";
import API from "./utils/tools/netWork/apiMap";
import {checkPermission} from "./utils/tools/permission"
require("./utils/tools/app_param");
var Config = require("./utils/config");
var token = new Token();
require("./utils/tools/wx");
App({
    API,
    http: new axios(),
    Config,
    globalData: {
        isAuthorized: false,
        bindStatus: undefined,
        nav: [],
    },
    onLaunch: function () {
        /**
         *调试模式开关
         */
        wx.setStorageSync("current_week", '');
        wx.setStorageSync("course", '');

        token.verify()
        checkPermission().then(res=>{
            this.globalData.auth = res
        })
        if (wx.cloud) {
            wx.cloud.init({
                env: "rc-qrqw6",
                traceUser: true,
            });
        }
        Config.init();
        this.getAuthStatus();
        this.getAppParam();
         // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function(res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function() {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经上线啦~，为了获得更好的体验，建议立即更新',
                showCancel: false,
                confirmColor: "#5677FC",
                success: function(res) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              })
            })
            updateManager.onUpdateFailed(function() {
              // 新的版本下载失败
              wx.showModal({
                title: '更新失败',
                content: '新版本更新失败，为了获得更好的体验，请您删除当前小程序，重新搜索打开',
                confirmColor: "#5677FC",
                showCancel: false
              })
            })
          }
        })
      } else {
        // 当前微信版本过低，无法使用该功能
      }
    },
    getAppParam() {
        let that = this;
        wx.cloud
            .callFunction({
                name: "getAppParam",
                data: {},
            })
            .then((res) => {
                if (res.result.errMsg == "collection.get:ok") {
                    // console.log("debug:", res.result.data[0].data.debug);
                    if (res.result.data[0].data.debug) {
                        // debug模式控制
                        wx.setEnableDebug({
                            enableDebug: true,
                        });
                    }
                    let param = res.result.data[0].data;
                    wx.setStorageSync("app_param", param);
                    Config.set("param", param);
                }
            });
    },
    // 获取认证状态
    getAuthStatus(data = {}) {
        let that = this;
        wx.getSetting({
            success: (res) => {
                if (res.authSetting["scope.userInfo"]) {
                    // console.log("已授权微信", res);
                    wx.getUserInfo({
                        complete: (res) => {
                            wx.setStorageSync("wxInfo", res.userInfo);
                        },
                    });
                    this.globalData.isAuthorized = true;
                    wx.checkSession({
                        fail() {
                            wx.login(); // 重新登录
                        },
                    });
                }
                // console.log("微信未授权",res)
            },
            // 检测授权状态后 检测绑定状态
            complete(res) {},
        });
    }
});
