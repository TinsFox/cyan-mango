// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { title, content, imgs, label, isBuy, price, category, info } = event
  console.log(event)
  try {
    return await db.collection('goods_item').add({
      data: {
        title: title,
        content: content,
        imgs: imgs,
        label: label,
        isBuy: isBuy,
        price: price,
        category: category,
        info: info,
        createTime: db.serverDate(),
        openid: wxContext.OPENID,
        updateTime: null,
        state:0
      }
    }).then(res => {
      console.log(res)
      return res
    }).catch(error=>{
      console.error
      return error
    })

  } catch (e) {
    console.error(e)
  }
}