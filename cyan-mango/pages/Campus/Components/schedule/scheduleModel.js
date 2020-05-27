/**
 * Created by TinsFox on 20/04/22.
 */
const app = getApp()
class courseModel {
  constructor() {
    this.toast = true
  }
  // 获取教务系统的当前学期中的本周的课程表
  async getCourse(data) {
    return app.http.axios({
      url: app.API.schedule,
      method: 'POST',
      data:data
    })
  }
  // 获取教务系统的所有学期的考试时间，将索引数据库
  async getExamHistory() {
    return api.axios({
      url: app.API.examHistory,
      method: 'GET',
    })
  }
}

export { courseModel };