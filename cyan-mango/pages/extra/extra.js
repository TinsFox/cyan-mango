class apirequest {
  constructor() {
    this._header = {}
  }

  /**
   * 设置统一的异常处理
   */
  setErrorHandler(handler, toast) {
    this._errorHandler = handler;
    console.log(handler);
    this.showToast(toast);
  }

  /**
   * 显示统一的Toast
   */
  showToast(msg) {
    wx.showToast({
      icon: 'none',
      title: msg
    })
  }

  /**
   * GET类型的网络请求
   */
  getRequest(url, data, toast) {
    return this.requestAll(url, data, toast, 'GET')
  }
  /**
   * PUT类型请求
   */
  putRequest(url, data, toast) {
    return this.requestAll(url, data, toast, 'PUT')
  }

  /**
   * POST类型的网络请求
   */
  postRequest(url, data, toast) {
    return this.requestAll(url, data, toast, 'POST')
  }

  /**
   * 网络请求
   */
  requestAll(url, data, toast, method) {
    return new Promise((resolve, reject) => {
      if (toast == true) {
        wx.showLoading({
          title: "数据加载中…",
        })
      }
      wx.request({
        url: "https://www.mxnzp.com/api" + url,
        data: data,
        header: {
           'content-type': 'application/json',
            'app_id': 'drctbhnehcjxmxuf',
            'app_secret':'b0hJQ2lIOXhKeEU2QnVSdEtiSSt1dz09'
          },
        method: method,
        success: (res => {
          console.log(res)
          if (toast != "") {
            wx.hideLoading()
          }
          let statusCode = res.statusCode
          let code = res.data.code
          if (statusCode === 200) {
            resolve(res.data)
          } else if (statusCode === 401) {
          } else if (statusCode === 403) {
          } else if (statusCode === 404) {
          }
          else {
            resolve(res.data)
            wx.showToast({
              icon: 'none',
              title: '网络异常-2001',
            })
          }
        }),
        fail: (res => {
          console.log(res)
          //隐藏loading
          if (toast != "") {
            wx.hideLoading()
          }
          this.setErrorHandler(res, '网络异常，请重试-1002')
          reject(res)
        })
      })
    })
  }
}
export default apirequest