// 获取应用实例
const app = getApp()

Page({
	data: {},
	// 事件处理函数
	localGame() {
		wx.navigateTo({
			url: '/pages/localGame/localGame',
		})
	},
	AIGame() {
		wx.navigateTo({
			url: '/pages/AIGame/AIGame',
		})
	},
	onlineGame() {
		wx.navigateTo({
			url: '/pages/gamehall/gamehall',
		})
	},
})
