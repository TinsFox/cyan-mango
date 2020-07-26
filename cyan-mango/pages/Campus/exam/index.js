// pages/index/app/exam/exam.js

import { examModel } from "./exam";
const app = getApp();
var exam = new examModel();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        bind: true,
        hideNotice: true,
        loading: false,
        tip: "",
        list: {},
        title_color: [
            "gradual-red",
            "gradual-orange",
            "gradual-green",
            "gradual-blue",
            "gradual-purple",
            "gradual-pink",
        ],
        bg_color: [
            "bg-pink",
            "bg-brown",
            "bg-yellow",
            "bg-mauve",
            "bg-cyan",
            "bg-green",
            "bg-blue",
            "bg-red",
            "bg-orange",
        ],
    },
    access: true,
    hide_page: false,

    async _init() {
        let res = await exam.getInfo();
        if (res.error_code == 0) {
            this.setData({
                hideNotice: true,
                list: res.data,
                loading: false,
                show_page: true,
            });
        } else if (res.error_code == 1) {
            this.setData({
                hideNotice: false,
                loading: false,
                tip: "教务系统暂未发布期末考试信息，无法查询。",
                error: false,
                show_page: false,
            });
        } else {
          console.log(res.error_code)
            this.setData({
                hideNotice: false,
                loading: false,
                tip: res.msg,
                error: res.error_code == 504 ? '504' : true,
                show_page: false,
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        if (!this.access) {
            this.redirectToLogin();
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let rv = wx.getStorageSync("permission");
        if (!rv.education) {
            this.access = false;
        } else {
            this.access = true;
            this.setData({
                loading: true,
            });
            this._init();
        }
        if (this.hide_page && !this.access) {
            this.hide_page = true;
            this.redirectToLogin();
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.hide_page = true;
        this.setData({
            loading: false,
        });
    },

    redirectToLogin() {
        this.setData({
            bind: false,
        });
    },
    /**
     * 跳转登录页面
     * @param {*} e
     */
    redirectLogin(e) {
        wx.navigateTo({
            url: "/pages/Setting/login/login",
        });
    },
    /**
     * 跳转到首页
     * @param {*} e
     */
    redirectHomePage(e) {
        wx.switchTab({
            url: "/pages/Campus/index",
        });
    },
});
