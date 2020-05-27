var app=getApp()
class FleaMarketModel {
  constructor() {
    this.toast = true
  }
  async getList() {
    return app.http.axios({
      url: app.API.flea_market_action,
      method: 'GET',
    })
  }
  async getWallList() {
    return app.http.axios({
      url: app.API.wall_action,
      method: 'GET',
    })
  }
  async postGood(data) {
    return app.http.axios({
      url: app.API.flea_market,
      method: 'post',
      data:data
    })
  }
  async getGoodDetail(data) {
    return app.http.axios({
      url: app.API.flea_market,
      method: 'GET',
      data:data
    })
  }
}

export { FleaMarketModel };