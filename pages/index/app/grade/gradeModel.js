import { axios } from '../../../../utils/axios'
var api = new axios()
const app = getApp()
class GradeModel{

  constructor(){
    this.toast=true
  }
  // 获取教务系统的当前学期的期末成绩信息，将抓取教务系统
  async score(){
    return api.axios({
      url:app.API.score,
      method:'GET'
    })
  }

  // 获取教务系统的所有学期的期末成绩信息，将索引数据库
  async getExamHistory(){
    return api.axios({
      url:app.API.scorehistory,
      method:'GET'
    })
  }

  // 获取教务系统的之前的某一学期考试时间，将索引数据库的数据，并不会去抓取教务系统
  async postExamHistory(data){
    return api.axios({
      url:app.API.scorehistory,
      method:'post'
    })
  }
  // - 抓取教务系统的考试信息，用来更新数据库
  async putExamHistory(){
    return api.axios({
      url:app.API.scorehistory,
      method:'put'
    })
  }
}

export { GradeModel };
