// var Config = require("./setting/config")
/*
  时间戳格式化输出
*/
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/*
  获取当前校历周
*/
function getSchoolWeek() {
  let schoolWeek
  // 月份需要减一

  let startMonday = new Date(["2020-02-24"])
  let today = new Date()

  let interval = today - startMonday
  let intervalDays = interval / (1000 * 60 * 60 * 24)

  if (interval < 0) {
    schoolWeek = Math.ceil(Math.abs(intervalDays)) / 7
    return -(Math.ceil(schoolWeek))
  } else {
    schoolWeek = Math.ceil(intervalDays) / 7
    schoolWeek = Math.ceil(schoolWeek)
    if (schoolWeek > 20) {
      return 0
    }
    return schoolWeek
  }
}


/*
  设置周对应日期
*/
function setWeekDate(intervalWeeks = 0) {
  const week = [];
  for (let i = 0; i < 7; i++) {
    let Stamp = new Date();
    let weekday = Stamp.getDay() == 0 ? 7 : Stamp.getDay() //周日设置值为7
    let num = intervalWeeks * 7 - weekday + 1 + i;
    Stamp.setDate(Stamp.getDate() + num);
    // week[i] = (Stamp.getMonth() + 1) + '月' + Stamp.getDate() + '日';
    week[i] = Stamp.getDate()
  }
  return week;
}


/*
  选择出当天星期几的课程，包括非本周的
*/
function getTodayCourse() {
  let weekday = new Date().getDay()
  let course = wx.getStorageSync("course")
  let kbList = course ? course : []
  let todayCourse = []
  if (kbList) {
    kbList.forEach(function(item) {
      if (item.weekday == weekday) {
        // 加入上课时间
        switch(item.start){
          case 1 :item.course_time='8:40';break;
          case 3 :item.course_time='10:25';break;
          case 5 :item.course_time='14:15';break;
          case 7 :item.course_time='16:00';break;
          case 9 :item.course_time='18:20/19︰00';break;
          case 11 :item.course_time='20:40';break;
          default:break
        }
        todayCourse.push(item)
      }
    })
  }
  return todayCourse
}


// 将userInfo的头像转换为高清地址
function headimgHD(imageUrl) {
  // console.log('原来的头像', imageUrl);
  imageUrl = imageUrl.split('/'); //把头像的路径切成数组

  //把大小数值为 46 || 64 || 96 || 132 的转换为0
  if (imageUrl[imageUrl.length - 1] && (imageUrl[imageUrl.length - 1] == 46 ||
    imageUrl[imageUrl.length - 1] == 64 || imageUrl[imageUrl.length - 1] == 96 ||
    imageUrl[imageUrl.length - 1] == 132)) {
    imageUrl[imageUrl.length - 1] = 0;
  }
  imageUrl = imageUrl.join('/');  //重新拼接为字符串
  console.log('高清的头像', imageUrl);
  return imageUrl;
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode == 200) {

          if (res.data.errno == 401) {
            //需要登录后才可以操作

            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(api.AuthLoginByWeixin, { js_code: code, type:2 }, 'POST').then(res => {
                if (res.errno === 0) {
                  //存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);
                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

function get(url, data = {}) {
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  return request(url, data, 'POST')
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        if (res.detail.errMsg === 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}
module.exports = {
  formatTime: formatTime,
  getSchoolWeek: getSchoolWeek,
  setWeekDate: setWeekDate,
  getTodayCourse: getTodayCourse,
  headimgHD: headimgHD,
  request,
  get,
  post,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
}