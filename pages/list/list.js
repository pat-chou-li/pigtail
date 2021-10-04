// 获取应用实例
const app = getApp()

Page({
	data: {
		joinuuid: null,
		num: 1,
		hidden: true,
		articles: [],
		loadingData: false,
	},

	onLoad: function (options) {
		this.loadData(true)
	},
	loadData: function (tail, callback) {
		let url = 'http://172.17.173.97:9000/api/game/index/'
		let head = 'Bearer ' + wx.getStorageSync('token')
		let that = this
		wx.request({
			url: url,
			header: {
				Authorization: head,
			},
			data: {
				page_size: 100,
				page_num: that.data.num,
			},
			success(res) {
				let oldValue = that.data.articles
				let newValue = tail
					? oldValue.concat(res.data.data.games)
					: res.data.data.games.concat(oldValue)
				that.setData({
					articles: newValue,
					num: that.data.num + 1,
				})
				if (callback) {
					callback()
				}
			},
			fail(res) {
				console.log(res)
			},
		})
	},
	/**
	 * 上滑加载更多
	 */
	scrollToLower: function (e) {
		var hidden = this.data.hidden,
			loadingData = this.data.loadingData,
			that = this
		if (hidden) {
			this.setData({
				hidden: false,
			})
		}
		if (loadingData) {
			return
		}
		this.setData({
			loadingData: true,
		})
		// 加载数据,模拟耗时操作

		wx.showLoading({
			title: '数据加载中...',
		})

		setTimeout(function () {
			that.loadData(true, () => {
				that.setData({
					hidden: true,
					loadingData: false,
				})
				wx.hideLoading()
			})
		}, 2000)
	},
	scrollToUpper: function (e) {
		wx.showToast({
			title: '触顶了...',
		})
	},
	//事件处理函数
	join() {
		wx.showLoading({
			title: '正在加入对局',
		})
		let head = 'Bearer ' + wx.getStorageSync('token')
		let that = this
		let url = 'http://172.17.173.97:9000/api/game/' + this.data.joinuuid
		wx.request({
			url: url,
			method: 'post',
			header: {
				Authorization: head,
			},
			success(res) {
				wx.hideLoading()
				wx.setStorageSync('uuid', that.data.joinuuid)
				if (res.data.code == 200) {
					wx.showToast({
						title: '加入成功',
					})
					wx.setStorageSync('yourID', 1)
					setTimeout(() => {
						wx.navigateTo({
							url: '/pages/game/game',
						})
					}, 1000)
				} else {
					wx.showToast({
						icon: 'error',
						title: res.data.data.err_msg,
					})
				}
			},
			fail(res) {
				console.log(res)
			},
		})
	},
	choose(e) {
		let uuid = e.currentTarget.dataset.uuid
		this.setData({
			joinuuid: uuid,
		})
		this.join()
	},
})
