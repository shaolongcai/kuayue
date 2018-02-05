Page({
  data: {

  },
  onConfirmTap: function () {
    wx.showToast({
      title: '你点击了提交',
    })
  },

  //TODO 终止订单逻辑
  onStopTap: function () {
    wx.showToast({
      title: '你点击了取消',
    })
  }
})