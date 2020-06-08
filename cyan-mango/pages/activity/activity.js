var app=getApp()
class ActivityModel {
  constructor() {
    this.toast = true
  }

  async getList(data) {
    return app.http.axios({
      url: app.API.activity_list,
      method: 'GET',
      data
    })
  }
}

export { ActivityModel };