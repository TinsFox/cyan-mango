/**
 * Created by TinsFox on 20/04/22.
 */
const app = getApp()
class courseModel {
  constructor() {
    this.toast = true
  }
  // 获取当前学期考试时间安排
  async getCourse() {
    return app.api.axios({
      url: app.API.schedule,
      method: 'GET',
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