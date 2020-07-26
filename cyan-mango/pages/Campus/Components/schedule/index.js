var utils = require("../../../../utils/util");
var Data = require("./data");
var Config = require("../../../../utils/config");
import { checkPermission } from "../../../../utils/tools/permission";
var showTimes = 0;
import { courseModel } from "./scheduleModel";
var course = new courseModel();
const app = getApp();
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        show: {
            type: Boolean,
            value: false,
        },
    },

    data: {
        hideTimeLine: true,
        showDetail: false,
        current: 1,
        dis: "none",
        today: new Date().getDate(), //日期
        week: -1, //周数
        schoolWeek: "", //校历周
        weekDate: utils.setWeekDate(), //一周日期
        bg: Config.get("schedule_bg"), // 获取背景
        blur: Config.get("blur"), //高斯模糊

        weekDays: Data.weekDays,
        timeLine: Data.timeLine,
        colors: Data.colors,
        // kbList: Data.course_sample,
        kbList: [],
    },

    observers: {
        show: function (bool) {
            /**
             * 监听该组件是否被打开，加载数据
             */
            if (bool) {
                let permission = wx.getStorageSync("permission");
                if (permission instanceof Object) {
                    if (!permission.education) {
                        this.setData({
                            tip: true,
                        });
                    } else {
                        this.setData({
                            tip: false,
                        });
                        this.getCourse('', true)
                    }
                } else {
                    checkPermission().then((value) => {
                        if (!value.education) {
                            this.setData({
                                tip: true,
                            });
                        } else {
                            this.setData({
                                tip: false,
                            });
                            this.getCourse('', true)
                        }
                    });
                }
            }
        },
    },

    methods: {
        async getCourse(week, current_week=false) {
            // 获取课程表
            let postWeek = week ? week : "";
            let res = await course.getCourse(postWeek);
            if (res.error_code == 0) {
                this.setData({
                    kbList: res.data.schedule,
                    week: res.data.current_week,
                });
                if(current_week){
                    wx.setStorageSync('current_week', res.data.current_week);
                    this.setData({
                        schoolWeek: res.data.current_week
                    })
                }
            } else if (res.error_code == 1) {
            } else {
                /* 获取课程表数据失败 */
                wx.showToast({
                    title: res.msg,
                    icon: "none",
                    duration: 2000,
                });
            }
        },
        // 恢复校历周
        resetWeek() {
            /**
             * TODO
             */
            let week = wx.getStorageSync("current_week");
            let char = (new getDate().getMonth() + 1) > 6 ? "暑假": "寒假";
            if(week){
                char = String(week) + " 周"
            }
            this.setData({
                week: week,
                weekDate: utils.setWeekDate(),
            });
            wx.showToast({
                title: "校历 " + char,
                icon: "none",
                duration: 1000,
            });
        },
        // 左右滑动切换周数
        switchWeek(e) {
            let value = e.detail.current - this.data.current;
            let week;
            if (value == 1 || value == -2) {
                // 下一周
                if (this.data.week + 1 > 20) {
                    week = 1;
                } else {
                    week = this.data.week + 1;
                }
            } else {
                // 上一周
                if (this.data.week - 1 < 1) {
                    week = 20;
                } else {
                    week = this.data.week - 1;
                }
            }
            this.setData({
                weekDate: utils.setWeekDate(week - this.data.schoolWeek),
                week: week == 0 ? utils.getSchoolWeek() : week,
                current: e.detail.current,
            });

            wx.showToast({
                title: "第 " + String(week) + " 周",
                icon: "none",
                duration: 1000,
            });
            this.getCourse(week);
        },
        // 展开时间轴
        tapSlideBar() {
            this.setData({
                hideTimeLine: !this.data.hideTimeLine,
            });

            // 修改时间轴不展开
            let tips = Config.get("tips");
            tips.time_line = false;
            Config.set("tips", tips);
        },

        // 课程详情弹窗
        showDetail(e) {
            let that = this;
            let id = Number(e.currentTarget.id);
            let day = this.data.kbList[id].weekday;
            let start = this.data.kbList[id].start;
            let detail = [this.data.kbList[id]];
            // 遍历课表，找出星期和开始节相同的课程
            this.data.kbList.forEach(function (item) {
                if (item.weekday == day && item.start == start) {
                    if (that.data.kbList.indexOf(item) != id) detail.push(item);
                }
            });
            detail[0]["time"] = Data.timeLine[Number(detail[0].start) - 1];
            this.setData({
                detail: detail,
                showDetail: true,
                currentIndex: 0, //恢复滑动视图索引
            });
            this.showCourseId(0);
        },
        // 左右滑动切换课程
        switchCourse(e) {
            this.showCourseId(e.detail.current);
        },
        // 打开或者切换时更新显示的课程数组索引
        showCourseId(current) {
            let course = this.data.detail[current];
            for (let i = 0; i < this.data.kbList.length; i++) {
                if (course == this.data.kbList[i]) {
                    this.data.openTarget = i;
                }
            }
        },

        // 关闭课程详情弹窗
        cancelModal() {
            this.setData({
                showDetail: false,
            });
        },

        // 编辑课表
        navTo(e) {
            switch (e.currentTarget.id) {
                case "0": //编辑
                    wx.navigateTo({
                        url: "/pages/Campus/home/addCourse/addCourse",
                    });
                    break;
                case "1": //添加
                    wx.navigateTo({
                        url: "/pages/Campus/evaluation/evaluation",
                    });
                    break;
                case "2": //删除
                    this.deleteCourse();
                    break;
            }
        },

        // 删除课程
        deleteCourse() {
            let that = this;
            let id = this.data.openTarget;
            let obj = wx.getStorageSync("course");
            if (obj == "") return;
            obj.course_list.splice(id, 1);
            wx.showModal({
                title: "提醒",
                content: "是否删除当前课程?",
                success: function (e) {
                    if (e.confirm) {
                        wx.setStorage({
                            key: "course",
                            data: obj,
                            success: function () {
                                that.setData({
                                    kbList: obj.course_list,
                                    showDetail: false,
                                });
                            },
                        });
                    }
                },
            });
        },

        // 更新背景视图使用
        updateBg() {
            this.setData({
                bg: Config.get("schedule_bg"),
                blur: Config.get("blur"),
            });
        },
        viewUpdate() {
            let course = wx.getStorageSync("course");
            if (course != "") {
                let kbList = course == "" ? [] : course;
                this.setData({
                    kbList: kbList,
                });
            }
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
            /**
             * 触发父组件的事件，关闭课程表
             */
            this.triggerEvent("back", false);
        },
    },
});
