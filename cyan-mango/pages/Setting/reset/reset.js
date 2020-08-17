const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        tip: false,
        tip_content: '您的密码已经被重置，新密码已经发送到相关邮箱。'
    },

    resetPassword: async function (e) {
        const {
            sid,
            email
        } = e.detail.value
        if (!sid || !email) {
            wx.showToast({
                title: '数据不完善，无法提交',
                icon: 'none',
                mask: true,
                duration: 2000
            })
        } else {
            this.setData({
                loading: true
            })
            const res = await app.http.axios({
                url: app.API.book_reset,
                data: e.detail.value,
                method: 'POST',
            })
            if(res.status == 0){
                this.setData({
                    loading: false,
                    tip: true
                })

            }
            else{
                this.setData({
                    loading: false,
                    tip: false
                })
                wx.showToast({
                    title: res.msg,
                    duration: 2000,
                    icon: 'none',
                    mask: true,
                })
            }
            
        }

    },
    navBackPage: function(e){
        wx.navigateBack({})
    }
})