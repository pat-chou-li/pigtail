// index.js
// 获取应用实例
const app = getApp()

Page({
	data: {},
	// 事件处理函数
	btnclick: function () {
		wx.navigateTo({
			url: '/pages/login/login',
		})
	},
})
