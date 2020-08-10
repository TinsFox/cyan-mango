var app = getApp();
import { Bind } from "./bind";
var bind = new Bind();
import { checkPermission } from "../../../utils/tools/permission";

Page({
    data: {
        password: "",
        bindtype: 1,
        bindTitle: "教务系统",
        checked: false,
        showGuide: false,
        show: false,
        login_tip: false,
    },
    userName(e) {
        this.setData({
            userName: e.detail.value,
        });
        console.log(e)
    },
    password(e) {
        this.setData({
            password: e.detail.value,
        });
    },
    // 登录请求
    login() {
        var that = this;
        let loginForm = {
            sid: this.data.userName,
            pwd: this.data.password,
            type: this.data.bindtype,
        };
        if (!that.data.checked) {
            wx.showToast({
                title: "请同意用户协议",
                icon: "none",
                duration: 5000,
            });
            return;
        }
        if (loginForm.sid == "" || loginForm.pwd == "") {
            wx.showToast({
                title: "请检查用户名/密码",
                icon: "none",
                duration: 3000,
            });
            return;
        } else {
            // 执行登录
            that.loginRequest(loginForm);
        }
    },
    async untieBind(e) {
        let res = await bind.untieBind({
            type: Number(e.currentTarget.dataset.bindtype),
        });
        if (res.error_code == 0) {
            wx.removeStorage({
                key: "course",
            });
            checkPermission();
        }
        this.setData({
            login_tip: true,
            error: res.error_code,
            tip_content: res.msg,
            success_content: "您将会失去部分页面的访问权限。",
        });
    },
    // 登录绑定学号
    async loginRequest(data) {
        let that = this;
        that.dialogHander();
        let res = await bind.bindSys(data);

        let code = res.error_code;
        if (code === 0) {
            //绑定成功
            checkPermission().then((value) => {
                app.globalData.auth = value;
            });
            
            this.setData({
                login_tip: true,
                error: res.error_code,
                tip_content: res.msg,
                success_content: "成功解锁有关的功能。",
                flag: true
            });
        } else if (code === 5020) {
            // 密码错误
            console.log(res)
            that.setData({
                msg: res.msg,
                login_tip: true,
                error: res.error_code,
                tip_content: res.msg,
                flag: false
            });
        } else if (code == 5200) {
            wx.showToast({
                title: "请勿重复绑定",
                icon: "none",
                duration: 4000,
                flag: true
            });
        } else {
            this.setData({
                login_tip: true,
                error: res.error_code,
                tip_content: res.msg,
                flag: false
            });
        }
        this.dialogHander();
    },
    // dialog 控制
    dialogHander() {
        let that = this;
        setTimeout(() => {
            that.setData(
                {
                    loading: !that.data.loading,
                    hideLoginBtn1: !that.data.hideLoginBtn1,
                    hideLoginBtn2: !that.data.hideLoginBtn2,
                },
                200
            );
        });
    },
    onShow() {
        this.setData({
            auth: app.globalData.auth,
            isAuthorized: !app.globalData.isAuthorized,
        });
    },
    agree() {
        this.setData({
            checked: !this.data.checked,
        });
    },
    navToAgreement() {
        wx.navigateTo({
            url: "/pages/Setting/agreement/agreement",
        });
    },
    // 获取微信用户信息
    async userInfoHandler(data) {
        let that = this;
        if (data.detail.errMsg == "getUserInfo:ok") {
            app.globalData.isAuthorized = true;
            let userinfo = data.detail.userInfo;
            let wxInfo = await bind.wxinfo(userinfo);
            wx.setStorageSync("wxInfo", userinfo);
            that.setData({
                isAuthorized: false,
            });
        } else {
            wx.showToast({
                title: "授权失败，可退出重试",
                icon: "none",
            });
            that.setData({
                show: false,
                showGuide: true,
            });
        }
    },
    cancelAuth() {
        this.setData({
            showGuide: !this.data.showGuide,
        });
    },
    showOtherLogin() {
        this.setData({
            bindTitle:
                this.data.bindTitle === "教务系统" ? "图书馆" : "教务系统",
            bindtype: this.data.bindtype === 1 ? 2 : 1,
        });
    },

    redirectHomePage(e) {
        wx.switchTab({
            url: "/pages/Campus/index",
        });
    },

    redirectBackPage(e) {
        wx.navigateBack({
            fail: () => {
                wx.switchTab({
                    url: "/pages/Campus/index",
                });
            },
        });
    },
});
