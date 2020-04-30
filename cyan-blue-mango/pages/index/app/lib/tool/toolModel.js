
const app = getApp()
class ToolModel{

  constructor(){
    this.toast=true
  }
  async record(){
    return app.api.axios({
      url:app.API.record,
      method:'GET'
    })
  }
}

export { ToolModel };
