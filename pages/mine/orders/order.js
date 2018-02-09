Page({
  data: {
    choose_station:"",
    //点部选择器value
    range_arr:[
      '跨越点部', 
      '点部2', 
      '点部3'
    ]
  },
  onConfirmTap: function () {
    wx.showToast({
      title: '你点击了提交',
    })
  },

  //TODO 终止订单逻辑
  onStopTap: function () {
    wx.navigateBack({})
  },

  //选择点部
  bindchange:function(event){
    console.log(event)
    var arrid = event.detail.value
    var range_arr= this.data.range_arr
    this.setData({
      choose_station:range_arr[arrid]
    })
  }
})