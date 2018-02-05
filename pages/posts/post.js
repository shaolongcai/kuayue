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
    rphone: ''
  },
  onLoad: function () {
    //此处需改为从网络读取数据列表或后台修改数据
    var _this = this;

    var query = new AV.Query('Orders');
    query.equalTo('state', '0');//0-发布，1-已被接，2-已完成

    query.find().then(function (todos) {

      var postsData2 = JSON.stringify(todos);
      var aa = JSON.parse(postsData2);

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
    console.log(event.currentTarget.id)

    var query = new AV.Query('Orders');
    query.get(event.currentTarget.id).then(function (ent) {

      ent.set('state', '0');//0-发布，1-已被接，2-已完成
      //ent.set('acceptUser', '');//当前登陆用户
      ent.save();
      console.log(ent);

    }, function (error) {
      // 异常处理
      console.error(error);
    });

    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })

  },

  //todo 点击提交之后逻辑
  confirm: function () {

    var _this = this;

    var reg = /^0?(13|14|15|17|18|19)[0-9]{9}$/;

    if (!reg.test(_this.data.phone)) {
      wx.showToast({
        title: '手机号码有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (_this.data.phone != _this.data.rphone || _this.data.code != _this.data.rcode) {
      wx.showToast({
        title: '验证码有误',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    var query = new AV.Query('UserInfo');
    query.equalTo('phone', _this.data.phone);
    query.find().then(function (userinfo) {

      if (userinfo.length == 0) {

        var UserInfo = AV.Object.extend('UserInfo');
        var userInfo = new UserInfo();
        userInfo.set('phone', _this.data.phone);
        //userInfo.set('appid', appid);
        //userInfo.set('openid', openid);
        userInfo.save().then(function (userInfo) {
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
        url: 'http://huayoutong.com/mobile/send_vali_message',
        data: {
          phoneNum: _this.data.phone
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