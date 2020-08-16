/**
 * 有需要的时候，可以将程序的API接口全部在一个文件列出
 * 格式：名称：值
 * example：'REFRESH_TOKEN': '/gcu-api/refresh'
 */
const API = {
  'token':'/publish/login',//注册
  'refresh':'/publish/refresh',//token 刷新
  'untie':'/user/untie',//解绑
  'exam':'/user/square/exam',//获取教务系统的当前学期考试时间，将抓取教务系统
  'bind':'/publish/bind',// 绑定
  'record':'/record',
  "permission":"/publish/user/scope",
  "wxinfo":"/publish/login/wx-info",
  'currentScore':'/user/square/score',
  'scorehistory':'/user/square/score-history',
  'examHistory':'/exam/history',
  'schedule':'/user/square/schedule', 
  'semester':'/user/square/semester', 
  "librarySearch":"/publish/library/search",
  "bookDetail":"/publish/library/book-detail",
  "flea_market":"/user/flea_market",
  "wall":"/user/wall",
  "flea_market_action":"/admin/flea_market_action",
  "wall_action":"/admin/wall_action",
  "flea_market_search":"/user/flea_market_search",
  "wall_search":"/user/wall_search",
  "activity_list":"/publish/club/activity/info",
  "book_record": "/user/library/book-record",
  "book_renew": "/user/library/renew",
  "book_history": "/user/library/book-record",
  "book_reset": "/publish/library/reset"
}

export default API