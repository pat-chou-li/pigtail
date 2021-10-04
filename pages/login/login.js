// index.js
// 获取应用实例
const app = getApp()

Page({
	data: { password: null, username: null },
	// 事件处理函数
	submit: function () {
		wx.showLoading({
			title: '加载中',
		})
		let that = this
		wx.request({
			url: 'http://172.17.173.97:8080/api/user/login',
			method: 'post',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			data: {
				student_id: this.data.username,
				password: this.data.password,
			},
			success(res) {
				wx.hideLoading()
				if (res.data.status == 200) {
					wx.showToast({
						title: '登录成功',
					})
					wx.setStorageSync('token', res.data.data.token)
					wx.setStorageSync('username', that.data.username)
					wx.reLaunch({
						url: '/pages/gamehall/gamehall',
					})
				} else {
					wx.showToast({
						title: res.data.data.error_msg,
						icon: 'error',
					})
				}
			},
			fail(res) {
				wx.hideLoading()
				wx.showToast({
					icon: 'error',
					title: '网络好像走丢了哦...请在校园网下运行游戏',
				})
			},
		})
	},
})
