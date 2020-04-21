import { axios } from '../../../../../utils/axios'
var api = new axios()
const app = getApp()
class ToolModel{

  constructor(){
    this.toast=true
  }
  async record(){
    return api.axios({
      url:app.API.record,
      method:'GET'
    })
  }
}

export { ToolModel };
