var postsData = require('../../data/posts-data.js')
var app = getApp();

Page({
  data: {
    hiddenmodalput: true,
    hiddenmodalput1: true,
    hiddenmodalput2: true,
  },

  onLoad: function () {
    this.setData({
      postList: postsData.postList,
    });
  },

  //TODO 完成订单逻辑
  onConfirmTap: function () {
    wx.showToast({
      title: '你点击了完成订单',
    })
  },

  //TODO 终止订单逻辑
  onStopTap: function () {
    wx.showModal({
      title: '中断订单请联系调度中心',
      content: '0760-8335151',
      showCancel:false
    })
  },

  //TODO 点击详情
  onClick: function () {
    this.setData({
      hiddenmodalput2: !this.data.hiddenmodalput2
    })
    wx.showToast({
      title: '你点击了详情',
    })
  },

  onConfirmTap: function (event) {
    console.log('你点击了接受订单')
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })

  },

  //todo 点击提交之后逻辑
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
    console.log('你点击了提交')
    wx.showToast({
      title: '你点击了提交',
      duration: 1000
    })
  },

  //todo 获取验证码逻辑
  confirmNumber: function () {
    console.log('你点击了获取验证码')
    wx.showToast({
      title: '点击了获取验证码',
      duration: 1000
    })
  },

  //todo 点击返回之后逻辑
  confirm1: function () {
    this.setData({
      hiddenmodalput1: true
    })
  },

  confirm2: function () {
    this.setData({
      hiddenmodalput2: true
    })
    console.log('你点击了返回')
    wx.showToast({
      title: '你点击了返回',
      duration: 1000
    })
  },
})