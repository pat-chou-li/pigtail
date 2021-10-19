// 获取应用实例
const app = getApp()

Page({
	data: {},
	// 事件处理函数
	createPrivateGame() {
		wx.showLoading({
			title: '正在创建对局',
		})
		wx.getStorage({
			key: 'token',
			success(res) {
				let head = 'Bearer ' + res.data
				wx.request({
					url: 'http://172.17.173.97:9000/api/game',
					method: 'post',
					data: {
						private: true,
					},
					header: {
						Authorization: head,
					},
					success(res) {
						wx.hideLoading()
						wx.showToast({
							title: '创建成功',
						})
						wx.setStorageSync('uuid', res.data.data.uuid)
						wx.navigateTo({
							url: '/pages/battle/battle',
						})
					},
				})
			},
		})
	},
	createPublicGame() {
		wx.showLoading({
			title: '正在创建对局',
		})
		wx.getStorage({
			key: 'token',
			success(res) {
				let head = 'Bearer ' + res.data
				wx.request({
					url: 'http://172.17.173.97:9000/api/game',
					method: 'post',
					data: {
						private: false,
					},
					header: {
						Authorization: head,
					},
					success(res) {
						wx.hideLoading()
						wx.showToast({
							title: '创建成功',
						})
						wx.setStorageSync('uuid', res.data.data.uuid)
						wx.navigateTo({
							url: '/pages/battle/battle',
						})
					},
				})
			},
		})
	},
	joinGame() {
		wx.navigateTo({
			url: '/pages/list/list',
		})
	},
})
