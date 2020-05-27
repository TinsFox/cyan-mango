const uploadFile = (cloudPath, filePath) => {
  // console.log('开始上传')
  // console.log(filePath)
  // console.log(cloudPath)
  //返回上传文件后的信息
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: '上传中',
      icon:"loading"
    })
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath, // 文件路径
    }).then(res => {
      wx.showToast({
        title: '上传成功',
        icon:'success'
      })
      // get resource ID
      resolve(res.fileID)
      // console.log(res.fileID)
    }).catch(error => {
      // handle error
      wx.showToast({
        title: '上传失败，请重试'
      })
      reject(error)
      console.log(error)
    })
  })
}
const delFile=(fileID)=>{
  console.log(fileID)
  return new Promise((resolve, reject) => {
    wx.cloud.deleteFile({
      fileList: [fileID]
    }).then(res => {
      // handle success
      console.log(res.fileList)
      resolve(res.fileList)
    }).catch(error => {
      // handle error
      reject(error)
    })
  })
}
const tabs = [{
  name: "日常",
  placeholder: "标题 闲聊/求助/组队...",
  imageNum: 3,
  anonymous: false
}, {
  name: "情墙",
  placeholder: "表白对象",
  imageNum: 1,
  anonymous: false
}, {
  name: "悄悄话",
  placeholder: "标题 你的心声",
  imageNum: 3,
  anonymous: true
}, {
  name: "二手",
  placeholder: "标题 二手物品",
  imageNum: 3,
  anonymous: false
}]
export {
  uploadFile,
  delFile,
  tabs
}