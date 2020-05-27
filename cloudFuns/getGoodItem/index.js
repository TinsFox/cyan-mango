// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('goods_item').where({
    _id: event.id
  }).get().then(res=>{
    console.log(res)
    console.log(res.data)
    let id=res.data[0].openid
    const info =  cloud.callFunction({
      name: 'getUserInfo',
      data: {
        id:res.data[0].openid
      }
    })
    console.log(info)
  })
}