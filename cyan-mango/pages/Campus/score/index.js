import { GradeModel } from "./score";
import { config } from "../../../utils/config";
// var Data = require("../../../../utils/setting/data")
const app = getApp();
var grade = new GradeModel();
let height = 360;

Page({
    data: {
        modal_title: "成绩查询",
        tip_content: "",
        tip_error: 0,
        bind: true,
        grade_index: "",
        showDrawer: false,
        loading: false,
        hasGrade: false,
        // hideSyncTip: true,
        refleshTimes: 0,
        showTips: false,
        current_term: true,
        current: 0,
        showDetail: false,
        showModal: false,
        grade: "",
        sem_list: [],
        bg_color: [
            "bg-grey",
            "bg-brown",
            "bg-yellow",
            "bg-mauve",
            "bg-cyan",
            "bg-green",
        ],
        color: [
            "gradual-red",
            "gradual-orange",
            "gradual-green",
            "gradual-blue",
            "gradual-purple",
            "gradual-pink",
        ],
    },
    /**
     * 变量放在页面内，页面注销变量也会被注销，全局则保留
     */
    access: true,
    hide_page: false,
    load_semester: false,

    // 绑定的模态弹窗
    confirm() {
        this.putExamHistory(true);
    },

    showDetail(e) {
        let index = e.currentTarget.id;
        this.setData({
            showDetail: true,
            detail: this.data.grade.score[index],
        });
    },
    showModal(e) {
        this.setData({
            index: this.data.grade_index,
            showModal: true,
            grade: this.data.grade,
        });
    },
    // 打开侧边栏
    showItem() {
        if (this.data.hide_page || !this.load_semester) {
            this.setData({
                loading: true,
            });
            this.getSemester(true);
        } else {
            this.setData({
                showDrawer: true,
            });
        }
    },
    cancelModal() {},
    navBack() {
        wx.navigateBack();
    },

    async getGradeDatail(e) {
        let str = e.currentTarget.dataset.xnd.split("-");
        let data = {
            start: str[0],
            end: str[1],
            term: e.currentTarget.dataset.xqd,
        };
        let res = await grade.postGrade(data);

        this.setData({
            grade_index: e.currentTarget.id,
            grade: this.score_sort(res.data),
            hasGrade: true,
            loading: false,
            showDrawer: false,
        });
    },

    /**
     * 对于未使用过该功能的新用户有效。
     * 其它则是获取历史记录。
     * 数据更新，将抓取教务系统的成绩信息并存到数据库
     */
    async putExamHistory(modal = false) {
        /**
         * 弹窗提示数据加载
         */
        this.setData({
            loading: true,
        });

        /**
         * 模态窗触发，将会获取semester，为空才会更新数据
         */
        if (modal) {
            let res = await grade.semester();
            if (res.error_code == 0) {
                if (!res.data) {
                    /**
                     * 无任何数据，更新数据库
                     */
                    this.scoreSpider();
                } else {
                    /**
                     * 加载学期记录，存在着当本学期可以查询成绩时，用户尚第一次使用，将会不会自动更新数据库（手动）
                     */
                    this.setData({
                        loading: false,
                        showDrawer: true,
                        sem_list: this.drawer_sort(res.data),
                    });
                    this.load_semester = true;
                }
            } else {
                /**
                 * 服务器异常情况
                 */
                this.setData({
                    loading: false,
                    current_term: false,
                    tip_error: 500,
                    tip_content:
                        res.error_code == 504
                            ? res.msg
                            : "服务器发生异常，获取历年成绩信息失败，请联系管理员处理。",
                });
            }
        } else {
            this.getSemester(true);
        }
    },

    /**
     * 小程序页面生命周期函数
     */
    onHide() {
        /**
         * 页面隐藏时执行
         */
        this.hide_page = true;
        this.setData({
            loading: false,
        });
    },

    onShow: function () {
        /**
         * 页面显示执行
         */
        let rv = wx.getStorageSync("permission");
        if (!rv.education) {
            this.access = false;
        } else {
            this.access = true;
            this.setData({
                loading: true,
            });
            this.getScore();
        }

        if (this.hide_page && !this.access) {
            this.hide_page = true;
            this.redirectToLogin();
        }
    },
    onReady: function () {
        /**
         * 页面初次渲染被执行，只有页面加载后才触发
         */
        if (!this.access) {
            this.redirectToLogin();
        }
    },

    onShareAppMessage: function () {
        return {
            title: "成绩查询",
            desc: "",
            // path: '路径',
            imageUrl: "https://cos.ifeel.vip/gzhu-pi/images/pic/grade.png",
            success: function (res) {
                // 转发成功
                wx.showToast({
                    title: "分享成功",
                    icon: "none",
                });
            },
            fail: function (res) {
                // 转发失败
                wx.showToast({
                    title: "分享失败",
                    icon: "none",
                });
            },
        };
    },

    // 下拉刷新
    onPullDownRefresh: function () {
        this.setData({
            loading: true,
        });
        this.getScore();
        setTimeout(function () {
            wx.stopPullDownRefresh();
        }, 3000);
    },

    /**
     * 获取学期的记录
     */
    async getSemester(show_drawer = false) {
        console.log(show_drawer);
        let res = await grade.semester();
        if (res.error_code == 0) {
            this.setData({
                loading: false,
                showDrawer: show_drawer,
                sem_list: this.drawer_sort(res.data),
            });
            this.load_semester = true;
        } else {
            this.setData({
                loading: false,
                current_term: false,
                tip_error: 500,
                tip_content:
                    res.error_code == 504
                        ? res.msg
                        : "服务器发生异常，获取历年成绩信息失败，请联系管理员处理。",
            });
        }
    },

    /**
     * 获取期末成绩信息
     */
    async getScore() {
        let res = await grade.score();
        if (res.error_code == 0) {
            this.setData({
                grade: this.score_sort(res.data),
                hasGrade: true,
            });
        } else if (res.error_code == 1) {
            this.setData({
                current_term: false,
                tip_content:
                    "教务系统暂时还未发布本学期的成绩信息，暂时无法查询。",
                tip_error: 1,
            });
        } else if (res.error_code == 5250) {
            /**
             * 发生重定向，教务系统关闭成绩查询功能
             */
            this.setData({
                current_term: false,
                tip_content: "教务系统成绩查询功能已经被关闭，暂时无法查询。",
                tip_error: 302,
            });
        } else {
            this.setData({
                current_term: false,
                tip_content:
                    res.error_code == 504
                        ? res.msg
                        : "服务器发生异常，获取历年成绩信息失败，请联系管理员处理。",
                tip_error: 500,
            });
            this.getSemester();
        }
        this.setData({
            loading: false,
        });
    },

    /**
     * 页面跳转提示
     */
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
            url: "/pages/Setting/login/index",
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

    /**
     * 成绩排序
     * @param {*} data
     */
    score_sort(data) {
        let score = data.score;
        for (var i = 0; i < score.length; i++) {
            let min = i;

            for (var j = i + 1; j < score.length; j++) {
                let n = Number(score[min].grade);
                let m = Number(score[j].grade);
                if (isNaN(n)) {
                    if (score[min].grade == "不及格") n = 50;
                    else if (score[min].grade == "及格") n = 65;
                    else if (score[min].grade == "中等") n = 75;
                    else if (score[min].grade == "良好") n = 85;
                    else if (score[min].grade == "优秀") n = 95;
                    else n = 0;
                }
                if (isNaN(m)) {
                    if (score[j].grade == "不及格") m = 50;
                    else if (score[j].grade == "及格") m = 65;
                    else if (score[j].grade == "中等") m = 75;
                    else if (score[j].grade == "良好") m = 85;
                    else if (score[j].grade == "优秀") m = 95;
                    else m = 0;
                }
                if (n > m) {
                    min = j;
                }
            }
            let temp = score[i];
            score[i] = score[min];
            score[min] = temp;
        }
        return data;
    },

    /**
     * 侧栏排序
     * @param {*} arry
     */
    drawer_sort(arry) {
        return arry.sort((a, b) => {
            return a.xnd == b.xnd
                ? parseInt(b.xqd) - parseInt(a.xqd)
                : parseInt(b.xnd.split("-")[0]) - parseInt(a.xnd.split("-")[0]);
        });
    },

    /**
     * 更新数据库
     */
    async scoreSpider() {
        let spider = await grade.putExamHistory();
        if (spider.error_code == 0) {
            /**
             * 数据获取成功
             */
            let semester = await grade.semester();
            if (semester.error_code == 0) {
                /**
                 * 重新获取用户的成绩记录
                 */
                this.setData({
                    loading: false,
                    sem_list: this.drawer_sort(semester.data),
                    showDrawer: true,
                });
                this.load_semester = true;
            } else {
                this.setData({
                    loading: false,
                    current_term: false,
                    tip_error: 500,
                    tip_content:
                        "服务器发生异常，获取历年成绩信息失败，请联系管理员处理。",
                });
            }
        } else if (spider.error_code == 1) {
            /**
             * 大一新生，未产生任何数据的情况
             */
            this.setData({
                loading: false,
                tip_error: 1,
                current_term: false,
                tip_content: "你还未参加任何的考试项目，无法获取到成绩信息。",
            });
        } else {
            this.setData({
                loading: false,
                tip_error: 500,
                current_term: false,
                tip_content:
                    "服务器发生异常，获取历年成绩信息失败，请联系管理员处理。",
            });
        }
    },
});
