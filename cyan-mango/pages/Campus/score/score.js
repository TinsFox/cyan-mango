const app = getApp()
class GradeModel{

  constructor(){
    this.toast=true
  }
  // 获取教务系统的当前学期的期末成绩信息，将抓取教务系统
  async score(){
    return app.http.axios({
      url:app.API.currentScore,
      method:'GET'
    })
  }
  async semester(){
    return app.http.axios({
      url:app.API.semester,
      method:'GET'
    })
  }

  // 获取教务系统的所有学期的期末成绩信息，将索引数据库
  async getExamHistory(){
    return app.http.axios({
      url:app.API.scorehistory,
      method:'GET'
    })
  }

  // 获取教务系统的之前的某一学期考试时间，将索引数据库的数据，并不会去抓取教务系统
  async postGrade(data){
    return app.http.axios({
      url:app.API.scorehistory,
      method:'post',
      data
    })
  }
  // - 抓取教务系统的考试信息，用来更新数据库
  async putExamHistory(){
    return app.http.axios({
      url:app.API.scorehistory,
      method:'put'
    })
  }
}

export { GradeModel };
