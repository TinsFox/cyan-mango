var Config = require("../config");
import API from "../tools/netWork/apiMap";
import {axios} from "./netWork/axios";

export const checkPermission = () => {
    const http = new axios();
    return new Promise((resolve, reject) => {
        const promise = http.axios({
            url: API.permission,
            method: "GET",
        });
        promise.then((value) => {
            if (value.error_code == 0) {
                console.log("Permission: -->",value.data)
                let Permission = value.data;
                Config.set("permission", Permission);
                wx.setStorageSync("permission", Permission);
                resolve(Permission);
            } else {
                reject(value.data);
            }
        });
    }).catch(reason=>{
        wx.showToast({
            title: '权限初始化失败。',
            icon: 'none',
            duration: 1500,
        });
    });
};
