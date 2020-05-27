// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    // 在 3 秒后返回结果给调用方（小程序 / 其他云函数）
    // setTimeout(() => {
    //   resolve(event.a + event.b)
    // }, 3000)
    db.collection('control').where({
        _id: 'aa9f906d5ec12bfd00f5dc6f4ab2bd32'
      }).get().then(res=>{
        resolve (res)
      })
  })
  // return await db.collection('control').where({
  //   _id: 'aa9f906d5ec12bfd00f5dc6f4ab2bd32'
  // }).get().then(res=>{
  //   console.log(res)
  //   return res
  // })
}