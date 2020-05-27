var appParam = {
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
    "show": true,
    "name": "2空教室",
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
var config = {
  config_data: "20190316",
  schedule_mode: "day", //启动模式 day/week
  showExp: false, //是否展示实验课
  version: "2.0.0.20200405", //版本号
  school: {
    "year_sem": "2019-2020-2", //当前学期
    "first_monday": "2020-03-02", //学期第一周周一
    "sem_list": ["2020-2021-2", "2020-2021-1", "2019-2020-2", "2019-2020-1", "2018-2019-2", "2018-2019-1"]
  },
  schedule_bg: "#a8edea,#fed6e3", //课表背景图片/颜色
  blur: 8, //高斯模糊
  permission:{
    admin:false,
    education: false,
    library: false
  },
  param:appParam,
  tips: {
    time_line: true, //时间轴
    help: false, //帮助
    star: false, //加入喜欢
    share: false, //分享提示
  }
}


// 生成config加入缓存
function init() {
  let conf = wx.getStorageSync("config")
  if (conf == "") {
    wx.setStorageSync('config', config)
  }else{
    this.reInit()
  }
}


// 重新生成config加入缓存
function reInit() {
  wx.setStorage({
    key: 'config',
    data: config,
  })
}


// 获取缓存项
function get(propString = "") {
  let config = wx.getStorageSync("config")
  if (config == "") init()
  return getPropByString(config, propString)
}

// 修改/设置缓存
function set(name, value) {
  let config = wx.getStorageSync("config")
  if (config == "") init()
  config[name] = value
  wx.setStorageSync("config", config)
}

// 获取多级对象属性
function getPropByString(obj, propString) {
  if (!propString)
    return obj;

  var prop, props = propString.split('.');

  for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];

    var candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
}

class Config{
  constructor(){

  }
}

export {
  config,
  init,
  reInit,
  get,
  set,
  appParam
}