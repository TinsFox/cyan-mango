const app=getApp()
class libraryModel{

  constructor(){
    this.total = true
  }
  async getBooks(data){
    return app.http.axios({
      url:app.API.librarySearch,
      method:"POST",
      data
    })
  }
  async getDetail(data){
    return app.http.axios({
      url:app.API.bookDetail,
      method:'POST',
      data
    })
  }
}
export {libraryModel}