// 获取应用实例
const app = getApp()

Page({
	data: {
		//敌方卡牌信息
		enermyTotal: 0,
		enermySpade: 0,
		enermyHeart: 0,
		enermyClub: 0,
		enermyDiamond: 0,
		//敌方各花色卡牌栈
		enermySpadeStack: [],
		enermyHeartStack: [],
		enermyClubStack: [],
		enermyDiamondStack: [],
		//敌方花色卡牌栈顶
		enermySpadeTop: '../../static/pukeimage1/back.png',
		enermyHeartTop: '../../static/pukeimage1/back.png',
		enermyClubTop: '../../static/pukeimage1/back.png',
		enermyDiamondTop: '../../static/pukeimage1/back.png',
		//牌堆信息
		pileTotal: 52,
		//判定区信息
		mainStack: [],
		mainTop: '',
		mainTotal: 0,
		mainSpade: 0,
		mainHeart: 0,
		mainClub: 0,
		mainDiamond: 0,
		//我方卡牌信息
		meTotal: 0,
		meSpade: 0,
		meHeart: 0,
		meClub: 0,
		meDiamond: 0,
		//我方各花色卡牌栈
		meSpadeStack: [],
		meHeartStack: [],
		meClubStack: [],
		meDiamondStack: [],
		//我方花色卡牌栈顶
		meSpadeTop: '../../static/pukeimage1/back.png',
		meHeartTop: '../../static/pukeimage1/back.png',
		meClubTop: '../../static/pukeimage1/back.png',
		meDiamondTop: '../../static/pukeimage1/back.png',
		lastTurn: {},
		turn: false,
		inid: null,
		uuid: null,
		token: null,
		yourID: null,
		robot: false,
		robot1id: '',
		loadingFlag: false,
		overFlag: false,
	},
	// 事件处理函数
	run(e) {
		if (this.data.pileTotal <= 0 && this.data.overFlag == false) {
			this.over()
			return
		}
		if (this.data.turn) {
			this.data.loadingFlag = true
			wx.showLoading({
				mask: true,
				title: 'loading',
			})
			let that = this
			let type = parseInt(e.currentTarget.dataset.type)
			let flower = e.currentTarget.dataset.flower
			var card = ''
			console.log(this.data.meSpadeStack)
			let flag = true
			switch (flower) {
				case 'S':
					if (!this.data.meSpadeStack.length) {
						flag = false
						wx.showToast({
							icon: 'error',
							title: '你没有黑桃！',
						})
						break
					} else {
						card = this.data.meSpadeStack.pop()
						console.log(card)
						let top = ''
						if (!this.data.meSpadeStack.slice(-1)[0]) {
							top = '../../static/pukeimage1/back.png'
						} else {
							top =
								'../../static/pukeimage1/' +
								this.data.meSpadeStack.slice(-1)[0] +
								'.jpg'
						}
						this.setData({
							meTotal: this.data.meTotal - 1,
							meSpadeTop: top,
							meSpade: this.data.meSpade - 1,
						})
					}
					break
				case 'H':
					if (!this.data.meHeartStack.length) {
						flag = false
						wx.showToast({
							icon: 'error',
							title: '你没有红心！',
						})
						break
					} else {
						card = this.data.meHeartStack.pop()
						console.log(card)
						let top = ''
						if (!this.data.meHeartStack.slice(-1)[0]) {
							top = '../../static/pukeimage1/back.png'
						} else {
							top =
								'../../static/pukeimage1/' +
								this.data.meHeartStack.slice(-1)[0] +
								'.jpg'
						}
						this.setData({
							meTotal: this.data.meTotal - 1,
							meHeartTop: top,
							meHeart: this.data.meHeart - 1,
						})
					}
					break
				case 'C':
					if (!this.data.meClubStack.length) {
						flag = false
						wx.showToast({
							icon: 'error',
							title: '你没有梅花！',
						})
						break
					} else {
						card = this.data.meClubStack.pop()
						console.log(card)
						let top = ''
						if (!this.data.meClubStack.slice(-1)[0]) {
							top = '../../static/pukeimage1/back.png'
						} else {
							top =
								'../../static/pukeimage1/' +
								this.data.meClubStack.slice(-1)[0] +
								'.jpg'
						}
						this.setData({
							meTotal: this.data.meTotal - 1,
							meClubTop: top,
							meClub: this.data.meClub - 1,
						})
					}
					break
				case 'D':
					if (!this.data.meDiamondStack.length) {
						flag = false
						wx.showToast({
							icon: 'error',
							title: '你没有方块！',
						})
						break
					} else {
						card = this.data.meDiamondStack.pop()
						console.log(card)
						let top = ''
						if (!this.data.meDiamondStack.slice(-1)[0]) {
							top = '../../static/pukeimage1/back.png'
						} else {
							top =
								'../../static/pukeimage1/' +
								this.data.meDiamondStack.slice(-1)[0] +
								'.jpg'
						}
						this.setData({
							meTotal: this.data.meTotal - 1,
							meDiamondTop: top,
							meDiamond: this.data.meDiamond - 1,
						})
					}
					break
			}
			if (flag)
				wx.request({
					url: 'http://172.17.173.97:9000/api/game/' + that.data.uuid,
					method: 'put',
					header: {
						Authorization: that.data.token,
					},
					data: {
						type: type,
						card: card,
					},
					success(res) {
						console.log(res)
						wx.hideLoading()
						that.data.loadingFlag = false
					},
					fail(res) {
						wx.hideLoading()
						that.data.loadingFlag = false
						wx.showToast({
							title: '网络异常',
							icon: 'error',
						})
					},
				})
		} else {
			wx.showToast({
				title: '敌方回合！',
				icon: 'error',
			})
		}
	},
	onLoad() {
		let uuid = wx.getStorageSync('uuid')
		let token = 'Bearer ' + wx.getStorageSync('token')
		let yourID = wx.getStorageSync('yourID')
		this.setData({
			uuid: uuid,
			token: token,
			yourID: yourID,
		})
		let inid = setInterval(this.listen, 160)
		this.setData({
			inid: inid,
		})
	},
	onUnload() {
		clearInterval(this.data.robot1id)
		clearInterval(this.data.inid)
	},
	listen() {
		if (this.data.pileTotal <= 0 && this.data.overFlag == false) {
			this.over()
		} else {
			let that = this
			var newValue = {}
			wx.request({
				url:
					'http://172.17.173.97:9000/api/game/' +
					that.data.uuid +
					'/last',
				header: {
					Authorization: that.data.token,
				},
				success(res) {
					if (res.data.code == 400) {
						if (that.data.pileTotal <= 4) {
							wx.request({
								url:
									'http://172.17.173.97:9000/api/game/' +
									that.data.uuid,
								header: {
									Authorization: that.data.token,
								},
								success(res) {
									let value = {
										msg: '操作成功',
										data: {
											your_turn: true,
											last_code: res.data.data.last,
										},
									}
									if (that.data.overFlag == false) {
										that.data.overFlag = true
										that.change(value)
										that.over()
									}
									return
								},
							})
						} else {
							wx.showToast({
								title: '超时！',
								icon: 'error',
							})
							setTimeout(() => {
								wx.reLaunch({
									url: '/pages/chooseMode/chooseMode',
								})
							}, 2000)
							return
						}
					}
					newValue = res.data
					if (newValue.data.your_turn != that.data.turn) {
						that.setData({
							turn: newValue.data.your_turn,
						})
						that.data.lastTurn.data.your_turn =
							newValue.data.your_turn
					}
					if (
						JSON.stringify(that.data.lastTurn) !=
						JSON.stringify(newValue)
					) {
						that.setData({
							lastTurn: newValue,
						})
						that.change(newValue)
					}
				},
				fail(res) {
					wx.showToast({
						title: '网络异常',
					})
				},
			})
		}
	},
	over() {
		clearInterval(this.data.inid)
		if (this.data.meTotal > this.data.enermyTotal) {
			wx.showToast({
				title: 'you lose!',
			})
		} else if (this.data.meTotal < this.data.enermyTotal) {
			wx.showToast({
				title: 'you win!',
			})
		} else {
			wx.showToast({
				title: '平局！',
			})
		}
		setTimeout(() => {
			wx.reLaunch({
				url: '/pages/gamehall/gamehall',
			})
		}, 2000)
	},
	change(value) {
		console.log('change执行')
		console.log(value)
		if (value.msg == '操作成功' && value.data.last_msg != '对局刚开始') {
			let arr = value.data.last_code.trim().split(/\s+/)
			//如果上次操作是我方操作
			if (arr[0] == this.data.yourID) {
				//上次是翻牌
				let pile = this.data.pileTotal
				if (arr[1] == 0) pile--
				this.setData({
					pileTotal: pile,
					mainTotal: this.data.mainTotal + 1,
					mainTop: '../../static/pukeimage1/' + arr[2] + '.jpg',
				})
				switch (arr[2][0]) {
					case 'D':
						this.setData({
							mainDiamond: this.data.mainDiamond + 1,
						})
						break
					case 'S':
						this.setData({
							mainSpade: this.data.mainSpade + 1,
						})
						break
					case 'H':
						this.setData({
							mainHeart: this.data.mainHeart + 1,
						})
						break
					case 'C':
						this.setData({
							mainClub: this.data.mainClub + 1,
						})
						break
				}
				this.data.mainStack.push(arr[2])
				let tempArr = this.data.mainStack.slice(-2)
				if (tempArr[0][0] == tempArr[1][0]) {
					let length = this.data.mainStack.length
					while (this.data.mainStack.length) {
						let card = this.data.mainStack.pop()
						switch (card[0]) {
							case 'D':
								this.data.meDiamondStack.push(card)
								this.setData({
									meDiamond: this.data.meDiamond + 1,
									meDiamondTop:
										'../../static/pukeimage1/' +
										card +
										'.jpg',
								})
								break
							case 'C':
								this.data.meClubStack.push(card)
								this.setData({
									meClub: this.data.meClub + 1,
									meClubTop:
										'../../static/pukeimage1/' +
										card +
										'.jpg',
								})
								break
							case 'H':
								this.data.meHeartStack.push(card)
								this.setData({
									meHeart: this.data.meHeart + 1,
									meHeartTop:
										'../../static/pukeimage1/' +
										card +
										'.jpg',
								})
								break
							case 'S':
								this.data.meSpadeStack.push(card)
								this.setData({
									meSpade: this.data.meSpade + 1,
									meSpadeTop:
										'../../static/pukeimage1/' +
										card +
										'.jpg',
								})
								break
						}
					}
					this.setData({
						mainTotal: 0,
						mainClub: 0,
						mainDiamond: 0,
						mainHeart: 0,
						mainSpade: 0,
						mainTop: '',
						meTotal: this.data.meTotal + length,
					})
				}
				//如果上次操作是敌方操作
			} else if (arr[0]) {
				//敌方选择翻牌
				if (arr[1] == 0) {
					this.setData({
						pileTotal: this.data.pileTotal - 1,
						mainTotal: this.data.mainTotal + 1,
						mainTop: '../../static/pukeimage1/' + arr[2] + '.jpg',
					})
					switch (arr[2][0]) {
						case 'D':
							this.setData({
								mainDiamond: this.data.mainDiamond + 1,
							})
							break
						case 'S':
							this.setData({
								mainSpade: this.data.mainSpade + 1,
							})
							break
						case 'H':
							this.setData({
								mainHeart: this.data.mainHeart + 1,
							})
							break
						case 'C':
							this.setData({
								mainClub: this.data.mainClub + 1,
							})
							break
					}
					this.data.mainStack.push(arr[2])
					let tempArr = this.data.mainStack.slice(-2)
					if (tempArr[0][0] == tempArr[1][0]) {
						let length = this.data.mainStack.length
						while (this.data.mainStack.length) {
							let card = this.data.mainStack.pop()
							switch (card[0]) {
								case 'D':
									this.data.enermyDiamondStack.push(card)
									this.setData({
										enermyDiamond:
											this.data.enermyDiamond + 1,
										enermyDiamondTop:
											'../../static/pukeimage1/' +
											card +
											'.jpg',
									})
									break
								case 'C':
									this.data.enermyClubStack.push(card)
									this.setData({
										enermyClub: this.data.enermyClub + 1,
										enermyClubTop:
											'../../static/pukeimage1/' +
											card +
											'.jpg',
									})
									break
								case 'H':
									this.data.enermyHeartStack.push(card)
									this.setData({
										enermyHeart: this.data.enermyHeart + 1,
										enermyHeartTop:
											'../../static/pukeimage1/' +
											card +
											'.jpg',
									})
									break
								case 'S':
									this.data.enermySpadeStack.push(card)
									this.setData({
										enermySpade: this.data.enermySpade + 1,
										enermySpadeTop:
											'../../static/pukeimage1/' +
											card +
											'.jpg',
									})
									break
							}
						}
						this.setData({
							mainTotal: 0,
							mainClub: 0,
							mainDiamond: 0,
							mainHeart: 0,
							mainSpade: 0,
							mainTop: '',
							enermyTotal: this.data.enermyTotal + length,
						})
					}
					//敌方选择出牌
				} else {
					this.setData({
						mainTotal: this.data.mainTotal + 1,
						mainTop: '../../static/pukeimage1/' + arr[2] + '.jpg',
					})
					let _card = ''
					switch (arr[2][0]) {
						case 'D':
							this.data.enermyDiamondStack.pop()
							if (!this.data.enermyDiamondStack.slice(-1)[0]) {
								_card = '../../static/pukeimage1/back.png'
							} else {
								_card =
									'../../static/pukeimage1/' +
									this.data.enermyDiamondStack.slice(-1)[0] +
									'.jpg'
							}
							this.setData({
								mainDiamond: this.data.mainDiamond + 1,
								enermyDiamond: this.data.enermyDiamond - 1,
								enermyTotal: this.data.enermyTotal - 1,
								enermyDiamondTop: _card,
							})
							break
						case 'S':
							this.data.enermySpadeStack.pop()
							if (!this.data.enermySpadeStack.slice(-1)[0]) {
								_card = '../../static/pukeimage1/back.png'
							} else {
								_card =
									'../../static/pukeimage1/' +
									this.data.enermySpadeStack.slice(-1)[0] +
									'.jpg'
							}
							this.setData({
								mainSpade: this.data.mainSpade + 1,
								enermySpade: this.data.enermySpade - 1,
								enermyTotal: this.data.enermyTotal - 1,
								enermySpadeTop: _card,
							})
							break
						case 'H':
							this.data.enermyHeartStack.pop()
							if (!this.data.enermyHeartStack.slice(-1)[0]) {
								_card = '../../static/pukeimage1/back.png'
							} else {
								_card =
									'../../static/pukeimage1/' +
									this.data.enermyHeartStack.slice(-1)[0] +
									'.jpg'
							}
							this.setData({
								mainHeart: this.data.mainHeart + 1,
								enermyHeart: this.data.enermyHeart - 1,
								enermyTotal: this.data.enermyTotal - 1,
								enermyHeartTop: _card,
							})
							break
						case 'C':
							this.data.enermyClubStack.pop()
							if (!this.data.enermyClubStack.slice(-1)[0]) {
								_card = '../../static/pukeimage1/back.png'
							} else {
								_card =
									'../../static/pukeimage1/' +
									this.data.enermyClubStack.slice(-1)[0] +
									'.jpg'
							}
							this.setData({
								mainClub: this.data.mainClub + 1,
								enermyClub: this.data.enermyClub - 1,
								enermyTotal: this.data.enermyTotal - 1,
								enermyClubTop: _card,
							})
							break
					}
					this.data.mainStack.push(arr[2])
					let tempArr = this.data.mainStack.slice(-2)
					if (tempArr[0][0] == tempArr[1][0]) {
						let length = this.data.mainStack.length
						while (this.data.mainStack.length) {
							let card = this.data.mainStack.pop()
							switch (card[0]) {
								case 'D':
									this.data.enermyDiamondStack.push(card)
									this.setData({
										enermyDiamond:
											this.data.enermyDiamond + 1,
										enermyDiamondTop:
											'../../static/pukeimage1/' +
											card +
											'.jpg',
									})
									break
								case 'C':
									this.data.enermyClubStack.push(card)
									this.setData({
										enermyClub: this.data.enermyClub + 1,
										enermyClubTop:
											'../../static/pukeimage1/' +
											card +
											'.jpg',
									})
									break
								case 'H':
									this.data.enermyHeartStack.push(card)
									this.setData({
										enermyHeart: this.data.enermyHeart + 1,
										enermyHeartTop:
											'../../static/pukeimage1/' +
											card +
											'.jpg',
									})
									break
								case 'S':
									this.data.enermySpadeStack.push(card)
									this.setData({
										enermySpade: this.data.enermySpade + 1,
										enermySpadeTop:
											'../../static/pukeimage1/' +
											card +
											'.jpg',
									})
									break
							}
						}
						this.setData({
							mainTotal: 0,
							mainClub: 0,
							mainDiamond: 0,
							mainHeart: 0,
							mainSpade: 0,
							mainTop: '',
							enermyTotal: this.data.enermyTotal + length,
						})
					}
				}
			}
		}
		this.data.turn = value.data.your_turn
	},
	AIinterface() {
		var meMsg = new Array()
		meMsg['H'] = this.data.meHeart
		meMsg['C'] = this.data.meClub
		meMsg['S'] = this.data.meSpade
		meMsg['D'] = this.data.meDiamond
		meMsg['N'] = 0
		var enemyMsg = new Array()
		enemyMsg['H'] = this.data.enermyHeart
		enemyMsg['C'] = this.data.enermyClub
		enemyMsg['S'] = this.data.enermySpade
		enemyMsg['D'] = this.data.enermyDiamond
		enemyMsg['N'] = 0

		var plieMsg = new Array()
		var maxFlower
		var maxNumber = -1
		var minFlower
		var minNumber = 100
		plieMsg['H'] = 13 - this.data.meHeart - this.data.enermyHeart
		plieMsg['C'] = 13 - this.data.meClub - this.data.enermyClub
		plieMsg['S'] = 13 - this.data.meSpade - this.data.enermySpade
		plieMsg['D'] = 13 - this.data.meDiamond - this.data.enermyDiamond
		plieMsg['N'] = 0
		for (var key in plieMsg) {
			if (maxNumber < plieMsg[key]) {
				//获取卡组中最多的花色
				maxFlower = key
				maxNumber = plieMsg[key]
			}
		}
		for (var key in plieMsg) {
			if (minNumber > plieMsg[key]) {
				//获取卡组中最少的花色
				minFlower = key
				minNumber = plieMsg[key]
			}
		}

		var res = {
			currentTarget: {
				dataset: {
					flower: '',
					type: 0,
				},
			},
		}
		if (
			this.data.meTotal == 0 ||
			this.data.enermyTotal > this.data.pileTotal + 25 ||
			this.data.enermyTotal > 39
		) {
			res.currentTarget.dataset.type = 0
			console.log(375)
			return res //没牌和翻牌必胜的情况，直接翻牌
		}
		if (this.data.mainStack.length == 0) {
			var mainStackTop = 'Null'
		} else {
			var mainStackTop = this.data.mainStack[this.data.mainTotal - 1]
		}
		var TopFlower = mainStackTop[0] //顶部花色
		var topProb = plieMsg[TopFlower] / this.data.pileTotal //翻出顶部花色概率

		var maxProb = maxNumber / this.data.pileTotal

		if (this.data.meTotal <= this.data.enermyTotal) {
			//自己的手牌比对面少的情况
			if (
				this.data.meTotal + this.data.mainTotal <
					this.data.enermyTotal &&
				this.data.meTotal + this.data.mainTotal < 24 &&
				meMsg[TopFlower] != 0
			) {
				//如果吃下牌还比对面少且小于24张，吃牌
				res.currentTarget.dataset.type = 1
				res.currentTarget.dataset.flower = TopFlower
				console.log(399)
				return res
			} else if (topProb < 0.5) {
				//吃牌概率小于0.5，翻牌
				res.currentTarget.dataset.type = 0
				console.log(404)
				return res
			} else {
				var myMaxFlower
				var myMaxNumber = -1
				for (var key in meMsg) {
					if (key == TopFlower) {
						continue
					}
					if (myMaxNumber <= meMsg[key]) {
						//获取我方卡组中最多的花色
						myMaxFlower = key
						myMaxNumber = meMsg[key]
					}
				}
				if (myMaxNumber == -1 || myMaxNumber == 0) {
					//如果手里只有一种花色且恰好是牌顶的牌，只能翻牌
					res.currentTarget.dataset.type = 0
					console.log(422)
					return res
				}
				res.currentTarget.dataset.type = 1
				res.currentTarget.dataset.flower = myMaxFlower
				console.log(427)
				return res //打出这个花色
			}
		} else {
			//自己手牌比对面多的情况
			if (
				this.data.enermyTotal + this.data.mainTotal >
				25 + this.data.pileTotal
			) {
				//当对面吃下牌我方必胜时
				if (
					this.data.enermyTotal - enemyMsg[maxFlower] <
						meMsg[maxFlower] &&
					maxProb >= 0.75
				) {
					//当我方能逼迫对面翻牌且对方吃牌概率大于0.75时，出最有可能被翻出的牌
					if (meMsg[maxFlower] == 0) {
						//但如果没有这张牌，就摆烂
						var myMaxFlower
						var myMaxNumber = -1
						for (var key in meMsg) {
							if (key == TopFlower) {
								continue
							}
							if (myMaxNumber <= meMsg[key]) {
								//获取我方卡组中最多的花色
								myMaxFlower = key
								myMaxNumber = meMsg[key]
							}
						}
						if (myMaxNumber == -1 || myMaxNumber == 0) {
							//如果手里只有一种花色且恰好是牌顶的牌，只能翻牌
							res.currentTarget.dataset.type = 0
							console.log(422)
							return res
						}
						res.currentTarget.dataset.type = 1
						res.currentTarget.dataset.flower = myMaxFlower
						console.log(427)
						return res //打出这个花色
						//当对面即使吃下牌也无法赢时，瞎寄吧出
					} else {
						//有就出
						res.currentTarget.dataset.type = 1
						res.currentTarget.dataset.flower = maxFlower
						console.log(455)
						return res //打出这个花色
					}
				} else {
					var myMaxFlower
					var myMaxNumber = -1
					for (var key in meMsg) {
						if (key == TopFlower) {
							continue
						}
						if (myMaxNumber <= meMsg[key]) {
							//获取我方卡组中最多的花色
							myMaxFlower = key
							myMaxNumber = meMsg[key]
						}
					}
					if (myMaxNumber == -1 || myMaxNumber == 0) {
						//如果手里只有一种花色且恰好是牌顶的牌，只能翻牌
						res.currentTarget.dataset.type = 0
						console.log(422)
						return res
					}
					res.currentTarget.dataset.type = 1
					res.currentTarget.dataset.flower = myMaxFlower
					console.log(427)
					return res //打出这个花色
					//当对面即使吃下牌也无法赢时，瞎寄吧出
				}
			} else {
				var myMaxFlower
				var myMaxNumber = -1
				for (var key in meMsg) {
					if (key == TopFlower) {
						continue
					}
					if (myMaxNumber <= meMsg[key]) {
						//获取我方卡组中最多的花色
						myMaxFlower = key
						myMaxNumber = meMsg[key]
					}
				}
				if (myMaxNumber == -1 || myMaxNumber == 0) {
					//如果手里只有一种花色且恰好是牌顶的牌，只能翻牌
					res.currentTarget.dataset.type = 0
					console.log(422)
					return res
				}
				res.currentTarget.dataset.type = 1
				res.currentTarget.dataset.flower = myMaxFlower
				console.log(427)
				return res //打出这个花色
				//当对面即使吃下牌也无法赢时，瞎寄吧出
			}
		}
		res.currentTarget.dataset.type = 0
		console.log(472)
		return res //总之翻
	},
	p1AI() {
		if (this.data.turn && !this.data.loadingFlag) {
			let op = this.AIinterface()
			console.log(op)
			this.run(op)
		}
	},
	changeRobot() {
		this.setData({
			robot: !this.data.robot,
		})
		if (this.data.robot) {
			this.data.robot1id = setInterval(this.p1AI, 2000)
		} else {
			clearInterval(this.data.robot1id)
		}
	},
})
