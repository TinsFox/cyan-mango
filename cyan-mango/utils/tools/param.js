var param = {
  //启动模式 debug verify prod
  "mode": "verify",
  // 教务系统位置
  "school": {
    "year_sem": "2019-2020-2", //当前学期
    "first_monday": "2020-03-02", //学期第一周周一
    "sem_list": ["2020-2021-2", "2020-2021-1", "2019-2020-2", "2019-2020-1", "2018-2019-2", "2018-2019-1"]
  },
  // 首页功能导航
  "nav": [{
    "show": true,
    "name": "校历",
    "icon": "https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/icon/xiaoli-red.png",
    "url": "/pages/Campus/tools/calendar"
  }, {
    "show": false,
    "name": "11空教室",
    "icon": "https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/icon/building1.png",
    "url": "/pages/Campus/tools/emptyRoom"
  }, {
    "show": true,
    "name": "查成绩",
    "icon": "https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/icon/grade-a%2B.png",
    "url": "/pages/Campus/grade/grade"
  }, {
    "show": true,
    "name": "图书馆",
    "icon": "https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/icon/library.png",
    "url": "/pages/Campus/library/search"
  }, {
    "show": true,
    "name": "考试",
    "icon": "https://shaw-1256261760.cos.ap-guangzhou.myqcloud.com/gzhu-pi/images/icon/exam-green.png",
    "url": "/pages/Campus/tools/exam"
  }]
}


exports = {
  param
}