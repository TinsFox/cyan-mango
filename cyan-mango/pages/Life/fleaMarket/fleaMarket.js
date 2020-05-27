var app=getApp()
class FleaMarketModel {
  constructor() {
    this.toast = true
  }

  async getList(data) {
    return app.http.axios({
      url: app.API.flea_market,
      method: 'GET',
      data
    })
  }
  async searchGood(data) {
    return app.http.axios({
      url: app.API.flea_market_search,
      method: 'GET',
      data
    })
  }
  async searchKey(data) {
    return app.http.axios({
      url: app.API.flea_market_search,
      method: 'put',
      data
    })
  }
   async myGood(data) {
    return app.http.axios({
      url: app.API.flea_market_search,
      method: 'post',
      data
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
    console.log(data)
    return app.http.axios({
      url: app.API.flea_market,
      method: 'GET',
      data:data
    })
  }

  async patchGood(data) {
    return app.http.axios({
      url: app.API.flea_market,
      method: 'put',
      data:data
    })
  }
  async verify(data){
    return app.http.axios({
      url: app.API.flea_market_action,
      method: 'put',
      data:data
    })
  }
}

export { FleaMarketModel };