var utils = require("../../../../../utils/util");
const amap = require("../../../../../utils/tools/amap-wx");
import { checkPermission } from "../../../../../utils/tools/permission";
var showTimes = 0;
const app = getApp();
Component({
    properties: {
        bind: {
            type: Boolean,
            value: false,
        },
    },

    data: {
        todayCourse: "",
        week: "", //周数
        weekDays: ["日", "一", "二", "三", "四", "五", "六"],
        weekday: new Date().getDay(),
        amapPlugin: null,
        key: "6799b5f6f88d3d9fb52ac244855a8759",
        obj: {},
    },
    methods: {
        nav() {
            wx.navigateTo({
                url: "/pages/Setting/login/login",
            });
        },
        //获取天气数据
        getWeather: function () {
            this.data.amapPlugin.getWeather({
                success: (data) => {
                    this.setData({
                        obj: data,
                    });
                },
                fail: function (info) {
                    console.log(info);
                },
            });
        },

        /**
         * 获取课程表暑假
         * @param {*} self
         */
        async getCourse(self) {
            let res = await app.http.axios({
                url: app.API.schedule,
                method: "POST",
            });
            if (res.error_code == 0) {
                wx.setStorageSync("course", res.data.schedule);
                wx.setStorageSync("current_week", res.data.current_week);
                self.setData({
                    week: res.data.current_week,
                });
            } else if (res.error_code == 1) {
                self.setData({
                    week: false,
                });
            } else {
                /**
                 * TODO: 数据加载失败
                 */
                wx.showToast({
                    title: '课程表数据加载失败',
                    icon: 'none',
                });
            }
            self.setData({
                todayCourse: utils.getTodayCourse(),
                hasCourse: utils.getTodayCourse().length == 0 ? false : true,
            });
        },
    },

    lifetimes: {
        attached: function () {
            let that = this;
            that.setData(
                {
                    amapPlugin: new amap.AMapWX({
                        key: this.data.key,
                    }),
                },
                () => {
                    this.getWeather();
                }
            );
        },
    },
    pageLifetimes: {
        show: function () {
            let permission = wx.getStorageSync("permission")
            if(permission instanceof Object){
                if (permission.education) {
                    const course = wx.getStorageSync("course");
                    if(!course){
                        this.getCourse(this);
                    }
                    else{
                        this.setData({
                            todayCourse: utils.getTodayCourse(),
                            hasCourse: utils.getTodayCourse().length == 0 ? false : true,
                            week: wx.getStorageSync("current_week"),
                        });
                    }
                } 
            }
            else {
                checkPermission().then((value) => {
                    if (value.education) {
                        this.getCourse(this);
                    }
                });
            }
        },
    },
});
