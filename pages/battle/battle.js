// index.js
// 获取应用实例
const app = getApp()

Page({
	data: { uuid: null, username: null, id: null, timer: '' },
	// 事件处理函数
	listen() {
		let url =
			'http://172.17.173.97:9000/api/game/' + this.data.uuid + '/last'
		let head = 'Bearer ' + wx.getStorageSync('token')
		let that = this
		wx.request({
			url: url,
			header: {
				Authorization: head,
			},
			success(res) {
				console.log(res)
				if (res.data.code == 200) {
					wx.showToast({
						title: '对局开始！',
					})
					wx.setStorageSync('yourID', 0)
					setTimeout(() => {
						wx.reLaunch({
							url: '/pages/game/game',
						})
					}, 2000)
				} else if (res.data.code != 403) {
					wx.showToast({
						icon: 'error',
						title: res.data.data.err_msg,
					})
				}
			},
			fail(res) {
				wx.showToast({
					icon: 'error',
					title: '网络好像走丢了哦...请在校园网下运行游戏',
				})
			},
		})
	},
	onShow() {
		this.setData({ uuid: wx.getStorageSync('uuid') })
		this.setData({ username: wx.getStorageSync('username') })
		let _this = this
		this.setData({
			timer: setInterval(() => {
				_this.listen() // 这个是我要实时刷新的事件
			}, 6000),
		})
	},
	onHide: function () {
		clearInterval(this.data.timer)
		this.setData({
			timer: null,
		})
	},
	onUnload: function () {
		clearInterval(this.data.timer)
		this.setData({
			timer: null,
		})
	},
})
