const AV = require('../../utils/av-live-query-weapp-min');
const order = require('../../model/order-model.js');
var app = getApp();

Page({
  data: {
    hiddenmodalput1: true,
    hiddenmodalput2: true,
  },


  onReady:function(){
    var query = new AV.Query('Orders');
    query.equalTo('state', '1');//0-发布，1-已被接，2-已完成
    query.find().then((res)=>{
      this.setData({ postList:res})
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

  //获取订单对objid和所在数组下标
  arrcomfirm:function(event){
    var objid = event.currentTarget.dataset.objid
    var arrid = event.currentTarget.dataset.arrid
    this.setData({
      objid:objid,
      arrid:arrid
    })
  },

  //点击"完成订单"
  onConfirmTap: function (event) {
    wx.showModal({
      title: '确定完成订单？',
      content: '确认后，订单会提交后台审核',
      success:(res)=>{
        //更改订单状态
        if(res.confirm){
          //获取订单的objID修改状态
          var objid = this.data.objid
          //获取数组下标，删除元素
          var arrid = this.data.arrid
          var order = this.data.postList
          var Orders = AV.Object.createWithoutData('Orders', objid);
          Orders.set("state","2")
          Orders.save()
          .then(res=>{
            order.splice(arrid,1)
            this.setData({
              postList:order
            })
            wx.showToast({
              title: '完成订单',
              mask:true,
              duration:1000
            })
          }
          )
        }
      }
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