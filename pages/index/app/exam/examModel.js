/**
 * Created by TinsFox on 20/04/13.
 */
import { axios } from '../../../../utils/axios'
var api = new axios()
const app = getApp()
class examModel {
  constructor() {
    this.toast = true
  }
  // 获取当前学期考试时间安排
  async getInfo() {
    return api.axios({
      url: app.API.exam,
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

export { examModel };