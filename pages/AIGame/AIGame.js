// index.js
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
		pileStack: [],
		pileTop: '../../static/mahou.jpeg',
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
		p1Turn: true,
		pileFlag: true,
		robot: false,
		robot1id: '',
		robot2id: '',
	},
	// 事件处理函数
	onLoad() {
		let t = Math.ceil(Math.random() * 10)
		if (t % 2) {
			wx.showToast({
				icon: 'error',
				title: '1p(下方)先手！',
			})
			this.setData({
				p1Turn: true,
			})
		} else {
			wx.showToast({
				icon: 'error',
				title: '2p(上方)先手！',
			})
			this.setData({
				p1Turn: false,
			})
		}
		//初始化牌堆
		this.initPile()
		//初始化机器人
		this.data.robot2id = setInterval(this.p2AI, 2000)
	},
	onUnload() {
		console.log(this.data.robot2id)
		clearInterval(this.data.robot1id)
		clearInterval(this.data.robot2id)
	},
	//牌堆初始化
	initPile() {
		let arr = [
			//黑桃
			'S1',
			'S2',
			'S3',
			'S4',
			'S5',
			'S6',
			'S7',
			'S8',
			'S9',
			'S10',
			'SJ',
			'SQ',
			'SK',
			//红心
			'H1',
			'H2',
			'H3',
			'H4',
			'H5',
			'H6',
			'H7',
			'H8',
			'H9',
			'H10',
			'HJ',
			'HQ',
			'HK',
			//草花
			'C1',
			'C2',
			'C3',
			'C4',
			'C5',
			'C6',
			'C7',
			'C8',
			'C9',
			'C10',
			'CJ',
			'CQ',
			'CK',
			//方块
			'D1',
			'D2',
			'D3',
			'D4',
			'D5',
			'D6',
			'D7',
			'D8',
			'D9',
			'D10',
			'DJ',
			'DQ',
			'DK',
		]
		for (let i = 0; i < arr.length; i++) {
			var iRand = parseInt(arr.length * Math.random())
			var temp = arr[i]
			arr[i] = arr[iRand]
			arr[iRand] = temp
		}
		this.setData({
			pileStack: arr,
		})
	},
	//AI接口
	AIinterface() {
		return {
			currentTarget: {
				dataset: {
					flower: '',
					type: 0,
				},
			},
		}
	},
	//翻牌
	flop() {
		if (this.data.pileFlag == false) {
			wx.showToast({
				icon: 'error',
				title: '上次翻牌未完成！',
			})
			return
		}
		this.data.pileFlag = false
		let card = this.data.pileStack.pop()
		this.setData({
			pileTotal: this.data.pileTotal - 1,
			pileTop: '../../static/pukeimage1/' + card + '.jpg',
		})
		setTimeout(() => {
			this.setData({
				pileTop: '../../static/mahou.jpeg',
			})
			//如果判定区为空或者翻牌不等于判定区顶部牌
			if (
				this.data.mainTop == '' ||
				this.data.mainStack[this.data.mainStack.length - 1][0] !=
					card[0]
			) {
				this.data.mainStack.push(card)
				this.setData({
					mainTop: '../../static/pukeimage1/' + card + '.jpg',
					mainTotal: this.data.mainTotal + 1,
				})
				//判定区对应花色+1
				switch (card[0]) {
					case 'S':
						this.setData({ mainSpade: this.data.mainSpade + 1 })
						break
					case 'H':
						this.setData({ mainHeart: this.data.mainHeart + 1 })
						break
					case 'C':
						this.setData({ mainClub: this.data.mainClub + 1 })
						break
					case 'D':
						this.setData({ mainDiamond: this.data.mainDiamond + 1 })
						break
				}
			} else {
				this.clear(card)
			}
			this.data.pileFlag = true
			this.setData({
				p1Turn: !this.data.p1Turn,
			})
			if (this.data.pileTotal == 0) this.over()
		}, 1000)
	},
	//清空判定区,card是最后一次翻到或者出的手牌
	clear(card) {
		this.data.mainStack.push(card)
		//翻到与判定区顶部相同的牌
		this.setData({
			mainHeart: 0,
			mainDiamond: 0,
			mainSpade: 0,
			mainClub: 0,
			mainTop: '',
			mainTotal: 0,
		})
		//若为1p回合
		let length = this.data.mainStack.length
		if (this.data.p1Turn) {
			while (this.data.mainStack.length) {
				let card = this.data.mainStack.pop()
				switch (card[0]) {
					case 'D':
						this.data.meDiamondStack.push(card)
						this.setData({
							meDiamond: this.data.meDiamond + 1,
							meDiamondTop:
								'../../static/pukeimage1/' + card + '.jpg',
						})
						break
					case 'C':
						this.data.meClubStack.push(card)
						this.setData({
							meClub: this.data.meClub + 1,
							meClubTop:
								'../../static/pukeimage1/' + card + '.jpg',
						})
						break
					case 'H':
						this.data.meHeartStack.push(card)
						this.setData({
							meHeart: this.data.meHeart + 1,
							meHeartTop:
								'../../static/pukeimage1/' + card + '.jpg',
						})
						break
					case 'S':
						this.data.meSpadeStack.push(card)
						this.setData({
							meSpade: this.data.meSpade + 1,
							meSpadeTop:
								'../../static/pukeimage1/' + card + '.jpg',
						})
						break
				}
			}
			this.setData({
				meTotal: this.data.meTotal + length,
			})
		} else {
			while (this.data.mainStack.length) {
				let card = this.data.mainStack.pop()
				switch (card[0]) {
					case 'D':
						this.data.enermyDiamondStack.push(card)
						this.setData({
							enermyDiamond: this.data.enermyDiamond + 1,
							enermyDiamondTop:
								'../../static/pukeimage1/' + card + '.jpg',
						})
						break
					case 'C':
						this.data.enermyClubStack.push(card)
						this.setData({
							enermyClub: this.data.enermyClub + 1,
							enermyClubTop:
								'../../static/pukeimage1/' + card + '.jpg',
						})
						break
					case 'H':
						this.data.enermyHeartStack.push(card)
						this.setData({
							enermyHeart: this.data.enermyHeart + 1,
							enermyHeartTop:
								'../../static/pukeimage1/' + card + '.jpg',
						})
						break
					case 'S':
						this.data.enermySpadeStack.push(card)
						this.setData({
							enermySpade: this.data.enermySpade + 1,
							enermySpadeTop:
								'../../static/pukeimage1/' + card + '.jpg',
						})
						break
				}
			}
			this.setData({
				enermyTotal: this.data.enermyTotal + length,
			})
		}
	},
	//出牌
	run(e) {
		let flower = e.currentTarget.dataset.flower
		let type = e.currentTarget.dataset.type
		if (type == '2p' && this.data.p1Turn) {
			wx.showToast({
				icon: 'error',
				title: '现在是下方回合！',
			})
			return
		}
		if (type == '1p' && !this.data.p1Turn) {
			wx.showToast({
				icon: 'error',
				title: '现在是上方回合！',
			})
			return
		}
		//p1出牌
		let card = ''
		if (this.data.p1Turn) {
			switch (flower) {
				case 'S':
					if (!this.data.meSpadeStack.length) {
						wx.showToast({
							icon: 'error',
							title: '你没有黑桃！',
						})
						return
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
						wx.showToast({
							icon: 'error',
							title: '你没有红心！',
						})
						return
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
						wx.showToast({
							icon: 'error',
							title: '你没有梅花！',
						})
						return
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
						wx.showToast({
							icon: 'error',
							title: '你没有方块！',
						})
						return
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
			if (
				this.data.mainTop == '' ||
				this.data.mainStack[this.data.mainStack.length - 1][0] !=
					card[0]
			) {
				this.data.mainStack.push(card)
				this.setData({
					mainTop: '../../static/pukeimage1/' + card + '.jpg',
					mainTotal: this.data.mainTotal + 1,
				})
				//判定区对应花色+1
				switch (card[0]) {
					case 'S':
						this.setData({ mainSpade: this.data.mainSpade + 1 })
						break
					case 'H':
						this.setData({ mainHeart: this.data.mainHeart + 1 })
						break
					case 'C':
						this.setData({ mainClub: this.data.mainClub + 1 })
						break
					case 'D':
						this.setData({ mainDiamond: this.data.mainDiamond + 1 })
						break
				}
			} else {
				this.clear(card)
			}
			//p2出牌
		} else {
			switch (flower) {
				case 'S':
					if (!this.data.enermySpadeStack.length) {
						wx.showToast({
							icon: 'error',
							title: '你没有黑桃！',
						})
						return
					} else {
						card = this.data.enermySpadeStack.pop()
						console.log(card)
						let top = ''
						if (!this.data.enermySpadeStack.slice(-1)[0]) {
							top = '../../static/pukeimage1/back.png'
						} else {
							top =
								'../../static/pukeimage1/' +
								this.data.enermySpadeStack.slice(-1)[0] +
								'.jpg'
						}
						this.setData({
							enermyTotal: this.data.enermyTotal - 1,
							enermySpadeTop: top,
							enermySpade: this.data.enermySpade - 1,
						})
					}
					break
				case 'H':
					if (!this.data.enermyHeartStack.length) {
						wx.showToast({
							icon: 'error',
							title: '你没有红心！',
						})
						return
					} else {
						card = this.data.enermyHeartStack.pop()
						console.log(card)
						let top = ''
						if (!this.data.enermyHeartStack.slice(-1)[0]) {
							top = '../../static/pukeimage1/back.png'
						} else {
							top =
								'../../static/pukeimage1/' +
								this.data.enermyHeartStack.slice(-1)[0] +
								'.jpg'
						}
						this.setData({
							enermyTotal: this.data.enermyTotal - 1,
							enermyHeartTop: top,
							enermyHeart: this.data.enermyHeart - 1,
						})
					}
					break
				case 'C':
					if (!this.data.enermyClubStack.length) {
						wx.showToast({
							icon: 'error',
							title: '你没有梅花！',
						})
						return
					} else {
						card = this.data.enermyClubStack.pop()
						console.log(card)
						let top = ''
						if (!this.data.enermyClubStack.slice(-1)[0]) {
							top = '../../static/pukeimage1/back.png'
						} else {
							top =
								'../../static/pukeimage1/' +
								this.data.enermyClubStack.slice(-1)[0] +
								'.jpg'
						}
						this.setData({
							enermyTotal: this.data.enermyTotal - 1,
							enermyClubTop: top,
							enermyClub: this.data.enermyClub - 1,
						})
					}
					break
				case 'D':
					if (!this.data.enermyDiamondStack.length) {
						wx.showToast({
							icon: 'error',
							title: '你没有方块！',
						})
						return
					} else {
						card = this.data.enermyDiamondStack.pop()
						console.log(card)
						let top = ''
						if (!this.data.enermyDiamondStack.slice(-1)[0]) {
							top = '../../static/pukeimage1/back.png'
						} else {
							top =
								'../../static/pukeimage1/' +
								this.data.enermyDiamondStack.slice(-1)[0] +
								'.jpg'
						}
						this.setData({
							enermyTotal: this.data.enermyTotal - 1,
							enermyDiamondTop: top,
							enermyDiamond: this.data.enermyDiamond - 1,
						})
					}
					break
			}
			if (
				this.data.mainTop == '' ||
				this.data.mainStack[this.data.mainStack.length - 1][0] !=
					card[0]
			) {
				this.data.mainStack.push(card)
				this.setData({
					mainTop: '../../static/pukeimage1/' + card + '.jpg',
					mainTotal: this.data.mainTotal + 1,
				})
				//判定区对应花色+1
				switch (card[0]) {
					case 'S':
						this.setData({ mainSpade: this.data.mainSpade + 1 })
						break
					case 'H':
						this.setData({ mainHeart: this.data.mainHeart + 1 })
						break
					case 'C':
						this.setData({ mainClub: this.data.mainClub + 1 })
						break
					case 'D':
						this.setData({ mainDiamond: this.data.mainDiamond + 1 })
						break
				}
			} else {
				this.clear(card)
			}
		}
		this.setData({
			p1Turn: !this.data.p1Turn,
		})
	},
	over() {
		if (this.data.enermyTotal > this.data.meTotal) {
			wx.showToast({
				title: '下方获胜！',
			})
		} else if (this.data.enermyTotal < this.data.meTotal) {
			wx.showToast({
				title: '上方获胜！',
			})
		} else {
			wx.showToast({
				title: '平局！',
			})
		}
		setTimeout(() => {
			wx.reLaunch({
				url: '/pages/chooseMode/chooseMode',
			})
		}, 2000)
	},
	p1AI() {
		if (this.data.p1Turn) {
			let op = this.AIinterface()
			console.log(op)
			if (op.currentTarget.dataset.type == 0) this.flop()
			else this.run(op)
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
	p2AI() {
		if (!this.data.p1Turn) {
			let op = this.AIinterface()
			console.log(op)
			if (op.currentTarget.dataset.type == 0) this.flop()
			else this.run(op)
		}
	},
})
