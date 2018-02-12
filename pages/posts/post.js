var postsData = require('../../data/posts-data.js')
const AV = require('../../utils/av-live-query-weapp-min');
var app = getApp();

Page({
  data: {
    text: "完成今日订单后,请填写并提交完成表单",
    hiddenmodalput: true,
    postList: '',
    phone: '',
    code: '',
    rcode: '',
    rphone: '',
    buffer_orderId: ''
  },
  onLoad: function () {
    //此处需改为从网络读取数据列表或后台修改数据
    var _this = this;

    var query = new AV.Query('Orders');
    query.equalTo('state', '0');//0-发布，1-已被接，2-已完成

    query.find().then(function (todos) {

      var postsData2 = JSON.stringify(todos);
      var aa = JSON.parse(postsData2);
      //console.log(aa);
      _this.setData({
        postList: aa
      });

    }).then(function (todos) {
      // 更新成功
    }, function (error) {
      // 异常处理
    });


  },

  onConfirmTap: function (event) {
    //console.log(event.currentTarget.id)

    const user = AV.User.current();
    var phone = user.get('phone');

    if (phone == null || phone == '') {

      this.setData({
        hiddenmodalput: !this.data.hiddenmodalput,
        buffer_orderId: event.currentTarget.id
      })
    } else {
      app.relation_order(event.currentTarget.id);//建立订单关联
    }
  },

  //todo 点击提交之后逻辑
  confirm: function () {

    var _this = this;
    var query = new AV.Query('_User');
    query.equalTo('phone', _this.data.phone);
    query.find().then(function (user) {
      
      if (user.length == 0) {
        // 获得当前登录用户
        const user = AV.User.current();
        user.set('phone', _this.data.phone);
        user.save().then(function (userInfo) {

          app.relation_order(_this.data.buffer_orderId);//建立订单关联
          _this.setData({
            hiddenmodalput: true
          })

        }, function (error) {
          console.error(error);
        });

      } else {
        wx.showToast({
          title: '该号码已经被注册',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  cancel: function () {
    this.setData({
      hiddenmodalput: true
    })
    console.log('你点击了取消')

  },

  //todo 获取验证码逻辑
  confirmNumber: function () {
    var _this = this;
    var reg = /^0?(13|14|15|17|18|19)[0-9]{9}$/;

    if (reg.test(_this.data.phone)) {

      wx.request({//获取验证码
        url: 'http://huayoutong.com/mobile/send_vali_message3',
        data: {
          phoneNum: _this.data.phone,
          content: '短信校验码：',
          key: '8826as8'

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data.result.content)
          _this.setData({
            rcode: res.data.result.content,
            rphone: _this.data.phone
          })
        }
      })
    } else {
      wx.showToast({
        title: '手机号码有误',
        icon: 'none',
        duration: 1000
      })
    }

  },

  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  }
})