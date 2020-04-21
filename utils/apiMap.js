/**
 * 有需要的时候，可以将程序的API接口全部在一个文件列出
 * 格式：名称：值
 * example：'REFRESH_TOKEN': '/gcu-api/refresh'
 */
const API = {
  'token':'/register',//注册
  'refresh':'/refresh',//token 刷新
  'untie':'/untie',//解绑
  'exam':'/exam',//获取教务系统的当前学期考试时间，将抓取教务系统
  'bind':'/bind',// 绑定
  'record':'/record',
  'score':'/score',
  'scorehistory':'/score/history',// - 获取教务系统的所有学期的期末成绩信息，将索引数据库
  'examHistory':'/exam/history', //获取教务系统的所有学期的考试时间，将索引数据库 -get 所有 -post 指定 - put爬数据库
  // 免责协议
  'DISCLAIMER_AGREEMENT': '/h5/disclaimer-agreement.html'
}

export default API