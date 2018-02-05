Page({
  data: {

  },

  onclickus: function () {
    wx.navigateTo({
      url: '../mine/callus/call',
    })
  },

  onclickHistory: function () {
    // 不会写这里的逻辑跟页面.时间排列啥的.
    wx.showToast({
      title: '这里不会写',
    })
  },

  onclickToday:function(){
    wx.navigateTo({
      url: '../mine/orders/order',
    })
  }
  

})