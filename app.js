const AV = require('./utils/av-live-query-weapp-min');

AV.init({
  appId: 'yXzkpBk4Dx7hWaR5B6CHWFqh-gzGzoHsz',
  appKey: 'BVJeWBndjyOdCJ1RfX2EqaQF',
});

App({
  globalData: {
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,

  },

  onLaunch: function () {

    var _this = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
            }
          })
        }
      }
    }),


      AV.User.loginWithWeapp().then(user => {
        this.globalData.user = user.toJSON();
      }).catch(console.error);

    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({ userInfo }) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          this.globalData.user = user.toJSON();
        }).catch(console.error);
      }
    });

    //wx.checkSession({
    //success: function () {
    //session 未过期，并且在本生命周期一直有效
    //},
    // fail: function () {
    //登录态过期
    //_this.login() //重新登录
    // }
    //})


  },

  //订单分配给当前用户
  relation_order: function (id) {

    const user = AV.User.current();
    var query = new AV.Query('Orders');
    query.get(id).then(function (ent) {

      ent.set('state', '1');//0-发布，1-已被接，2-已完成
      ent.set('acceptUser', user);//当前登陆用户
      ent.save();
      console.log(ent);

    }, function (error) {
      console.error(error);
    });
  },

  login: function () {

    var _this = this;
    wx.login({
      success: function (res) {

        if (res.code) {
          console.log('获取用户登录凭证：' + res.code)

          //_this.setSessionKey(res.code);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

  setSessionKey: function (code) {
    //发起网络请求
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: {
        appid: '',//小程序唯一标识
        secret: '',//小程序的 app secret
        js_code: code,
        grant_type: 'authorization_code'
      },
      method: 'get',
      success: function (res) {

        var query = new AV.Query('UserInfo');
        query.equalTo('appid', 'appid'); //小程序唯一标识
        query.equalTo('openid', res.openid);

        query.find().then(function (userinfo) {

          if (userinfo.length == 0) {

            var UserInfo = AV.Object.extend('User');
            var userInfo = new UserInfo();
            userInfo.set('session_key', res.session_key);
            userInfo.set('appid', 'appid');//appid
            userInfo.set('openid', res.openid);

            wx.getUserInfo({
              success: function (res) {
                var userInfo = res.userInfo //
                var nickName = userInfo.nickName //用户昵称
                var avatarUrl = userInfo.avatarUrl //头像 
                var gender = userInfo.gender //性别 0：未知、1：男、2：女
                var province = userInfo.province//用户所在省份

                userInfo.set('nickName', nickName);
                userInfo.set('avatarUrl', avatarUrl);
                userInfo.set('gender', gender);
                userInfo.set('province', province);
              }
            })

            userInfo.save();

          } else {
            userInfo.set('session_key', res.session_key);
            userInfo.save();
          }
        });
        wx.setStorageSync('session_key', res.session_key)

      },
      fail: function (res) {
        console.log('获取用户session_key' + res.errMsg)
      }
    })
  },

  getMyUserInfo: function () {

    var _this = this;

    try {
      var session_key = wx.getStorageSync("session_key");

      if (session_key == '' || session_key == null) {
        _this.login();
        session_key = wx.getStorageSync("session_key");
      }

      if (session_key == '' || session_key == null) {
        console.log('获取本地数据失败2');
        return;
      }

      var query = new AV.Query('UserInfo');
      query.equalTo('session_key', session_key);
      query.find().then(function (userinfo) {

        return userinfo;
      })

    } catch (e) {
      console.log('获取本地数据失败');
    }
  }

})