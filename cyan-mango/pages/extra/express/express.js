import { trim } from '../../../utils/util';
import  apirequest from '../extra'
var api = new apirequest()
Page({
  data: {
    result: {},
    focus: false,
    historySearch: [],
    logistics_no:''
  },

  onLoad: function () {
   

  },

  onShow: function () {
    setTimeout(function () {
      wx.hideLoading()
    }, 100);
    this.showHistory();
    
  },
  
  getCompany(){
    api.getRequest("/logistics/discern",{},true).then(res=>{
      console.log(res)
    })
  },
  formSubmit: function (e) {
    let eorder = trim(e.detail.value.expressorder);
    if (!eorder) {
      wx.showModal({
        title: '提示',
        content: '快递单号不能为空！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            self.setData({
              focus: true
            })
          }
        }
      })
      return;
    }
    this.searchExpress(eorder);
  },

  deleteHistory: function (e) {
    var self = this;
    try {
      let historySearchList = wx.getStorageSync('historySearchList');
      let newList = historySearchList.filter(function (val) {
        return (val.order != e.currentTarget.dataset.order);
      });
      wx.setStorage({
        key: "historySearchList",
        data: newList,
        success: function () {
          self.showHistory();
        }
      })
    } catch (e) {
      console.log(e);
    }

  },

  showHistory: function () {
    var self = this;
    wx.getStorage({
      key: 'historySearchList',
      success: function (res) {
        console.log(res)
        self.setData({
          historySearch: res.data
        });
      }
    })
  },

  scanCode: function () {
    let self = this;
    wx.scanCode({
      success: (res) => {
        if (res.result) {
          self.searchExpress(trim(res.result));
        } else {
          wx.showModal({
            title: '提示',
            content: '快递单号不能为空！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                self.setData({
                  focus: true
                })
              }
            }
          })
        }
      }
    })
  },

  searchExpress: function (eorder) {
    let self = this;
    wx.showModal({
      title:'提示',
      content: '服务开发中，敬请期待'
    })
    api.getRequest(`/logistics/discern?logistics_no=${eorder}`,{},true).then(res=>{
      console.log(res.data)
      let logisticsTypeName = res.data.searchList[0].logisticsTypeName
      let logisticsTypeId = res.data.searchList[0].logisticsTypeId
      wx.showToast({
        title: logisticsTypeName,
        icon:"none",
        duration:2000
      })
      api.getRequest(`/logistics/discern?logistics_no=${eorder}?logistics_id=${logisticsTypeId}`,{},false).then(e=>{
        console.log(e)
      })
      // 历史记录
      try {
        let historySearchList = wx.getStorageSync('historySearchList');
        if (!historySearchList) {
          historySearchList = [];
        };
        let newList = historySearchList.filter(function (val) {
          return (val.order != eorder);
        });
        newList.push({
          "order": eorder,
          "logisticsTypeName": logisticsTypeName,
          "logisticsTypeId": logisticsTypeId,
        })
        wx.setStorage({
          key: "historySearchList",
          data: newList,
          success: function () {
            self.setData({
              historySearch:newList
            })
          }
        })
      } catch (e) {
        console.log(e);
      }
    })
  },
  showDetail(e){
    console.log(e.currentTarget.dataset)
    this.setData({
      logistics_no:e.currentTarget.dataset.index.order
    })
  }
})
