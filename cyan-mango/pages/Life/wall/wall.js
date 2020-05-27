var app=getApp()
class WallModel {
  constructor() {
    this.toast = true
  }

  async getList(data) {
    return app.http.axios({
      url: app.API.wall,
      method: 'GET',
      data
    })
  }
  async Topics(data) {
    return app.http.axios({
      url: app.API.wall_search,
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

  async postWall(data) {
    return app.http.axios({
      url: app.API.wall,
      method: 'post',
      data:data
    })
  }
  async getDetail(data) {
    console.log(data)
    return app.http.axios({
      url: app.API.wall,
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
      url: app.API.wall_action,
      method: 'put',
      data:data
    })
  }
  async searchKey(data){
    return app.http.axios({
      url: app.API.wall_search,
      method: 'put',
      data:data
    })
  }
}

export { WallModel };