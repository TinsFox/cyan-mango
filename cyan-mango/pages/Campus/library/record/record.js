import { checkPermission } from "../../../../utils/tools/permission";
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        borrow_count: 0,
        books: [],
        books_history: [],
        bg_color: [
            "bg-pink",
            "bg-mauve",
            "bg-purple",
            "bg-blue",
            "bg-cyan",
            "bg-green",
            "bg-olive",
            "bg-yellow",
            "bg-orange",
            "bg-red",
        ],
        page: 1,
        max_page: 1,
        data_length: 0,
        bind: true,
        loading: false,
        open: false,
        last_current: 1,
    },
    request_book_record: function () {
        return app.http.axios({
            url: app.API.book_record,
            method: "GET",
        });
    },
    /**
     * 获取图书的在借书籍数据
     */
    getBorrowBook: async function () {
        this.loadingProcess();
        const res = await this.request_book_record();
        if (res.error_code == 0) {
            /**
             * 获取数据成功
             */
            this.setData({
                borrow_count: res.data.count,
                books: res.data.record,
                max_page: res.data.max_page,
            });
        }
        this.cancelLoading();
    },
    /**
     * 图书续借
     */
    bookeRenew: async function (e) {
        this.loadingProcess();
        const barcode = e.currentTarget.id;
        const res = await app.http.axios({
            url: app.API.book_renew,
            method: "POST",
            data: {
                barcode: barcode,
            },
        });
        if (res.error_code == 0) {
            /**
             * 图书续借成功
             */
            const response = await this.request_book_record();
            if (response.error_code == 0) {
                /**
                 * 获取数据成功
                 */
                this.setData({
                    borrow_count: response.data.count,
                    books: response.data.record,
                });
            }
            wx.showToast({
                title: res.msg,
                icon: "none",
                duration: 2500,
                mask: true,
            });
        } else if (res.error_code == 5210) {
            /**
             * 图书续借失败
             */
            wx.showToast({
                title: res.msg,
                icon: "none",
                duration: 2500,
                mask: true,
            });
        } else {
            /**
             * 服务异常
             */
        }
        this.cancelLoading();
    },

    /**
     * 获取图书借阅的历史记录
     * @param {*} e
     */
    getHistoryRecord: async function () {
        this.loadingProcess();
        const response = await app.http.axios({
            url: app.API.book_history,
            method: "POST",
            data: {
                page: this.data.page,
            },
        });
        if (response.error_code == 0) {
            this.setData({
                books_history: response.data.record,
                data_length:
                    Object.keys(response.data.record).length * 80 + 120,
                max_page: response.data.max_page,
                open: true,
            });
        } else {
            /**
             * 服务异常
             */
            this.setData({
                open: false,
            });
            wx.showToast({
                title: response.msg,
                icon: "none",
                duration: 1500,
                mask: true,
            });
        }
        this.cancelLoading();
    },
    /**
     * 打开页面
     * @param {*} e
     */
    openHistoryRecord: async function (e) {
        if (!this.data.open) {
            /**
             * 发起请求
             */

            this.getHistoryRecord();
        } else {
            /**
             * 关闭页面
             */
            this.setData({
                open: false,
            });
        }
    },
    /**
     * 换页
     * @param {*} e
     */
    switchPage: async function (e) {
        const current = e.detail.current;
        const value = current - this.data.last_current;
        let current_page = this.data.page;
        if (value == 2 || value == -1) {
            /**
             * 屏幕向左翻
             */
            let page = current_page - 1;
            if (page <= 0) {
                wx.showToast({
                    title: "这是第一页~~",
                    icon: "none",
                    duration: 1500,
                    mask: true,
                });
            } else {
                this.setData({
                    page: page,
                });
                this.getHistoryRecord();
            }
        } else {
            /**
             * 屏幕向右翻
             */
            let page = current_page + 1;
            if (page > this.data.max_page) {
                wx.showToast({
                    title: "已经是最后一页~~",
                    icon: "none",
                    duration: 1500,
                    mask: true,
                });
            } else {
                this.setData({
                    page: page,
                });
                this.getHistoryRecord();
            }
        }
        this.setData({
            last_current: current,
        });
    },
    /**
     * 无权限，跳转登录页面
     */
    navToLogin: function () {
        wx.navigateTo({
            url: "/pages/Setting/login/login",
        });
    },

    /**
     * 取消登录，跳转回原页面
     */
    navBack: function () {
        wx.navigateBack({});
    },
    cancelLoading: function () {
        this.setData({
            loading: false,
        });
    },
    loadingProcess: function () {
        this.setData({
            loading: true,
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        /**
         * 权限校验
         */
        let auth = wx.getStorageSync("permission");
        if (auth instanceof Object) {
            if (auth.library) {
                this.setData({
                    bind: true,
                });
                this.getBorrowBook();
            } else {
                this.setData({
                    bind: false,
                });
            }
        } else {
            checkPermission().then((value) => {
                if (value.library) {
                    this.setData({
                        bind: true,
                    });
                    this.getBorrowBook();
                } else {
                    this.setData({
                        bind: false,
                    });
                }
            });
        }

        /**
         * 获取导航栏高度
         */
        const that = this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    nav_height: res.statusBarHeight + 45,
                });
            },
        });
    },
});
