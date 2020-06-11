// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    db.collection('control').where({
        _id: 'aa9f906d5ec12bfd00f5dc6f4ab2bd32'
      }).get().then(res=>{
        resolve (res)
      })
  })
}