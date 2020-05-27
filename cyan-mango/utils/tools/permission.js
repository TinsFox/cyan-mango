var Config = require("../config")
import {redis_get_token} from './netWork/redis'
import { Token } from "../tools/netWork/token"
import env from './netWork/env'
import API from "../tools/netWork/apiMap"
export const checkPermission=()=>{
  // let permission=Config.get('permission')
  var time=0
  // console.log(permission)
  // if(permission)
  var token = redis_get_token('token')
  wx.request({
    url: env.host.baseUrl+API.permission,
    header: { 'content-type': 'application/json', 'Authorization': 'Bearer '+token },
    success:function(res){
      time++
      // console.log(res.data)
      if(res.data.error_code!=0){
        if (time===3 ) return
        var token = new Token()
        token._refresh_token().then(res=>{
          checkPermission()
        })
      }else{
        let Permission=res.data.data
        Config.set("permission",Permission)
        wx.setStorageSync('permission', Permission)
      }
    }
  })
}