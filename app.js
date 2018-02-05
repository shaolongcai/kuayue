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

    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        //登录态过期
        _this.login() //重新登录
      }
    })


  },


  login: function () {
    if (wx.getStorageSync("key")) return;

    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log('获取用户登录凭证：' + res.code)

          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              appid: '',
              secret: '',
              js_code: res.code,
              grant_type: 'authorization_code'
            },
            method: 'get',
            success: function (res) {
              if (res.Status == "SUCCESS" && res.BizData.Status == "SUCCESS") {

                wx.setStorageSync('LoginSessionKey', res.BizData.SessionKey)
                wx.redirectTo({
                  url: '../pages/posts/post',
                })
              }

            },
            fail: function (res) {
              console.log('获取用户session_key' + res.errMsg)
            }
            

          })


          //发起网络请求
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            },
            method: 'get',
            success: function (res) {
              if (res.Status == "SUCCESS" && res.BizData.Status == "SUCCESS") {

                wx.setStorageSync('LoginSessionKey', res.BizData.SessionKey)
                wx.redirectTo({
                  url: '../pages/posts/post',
                })
              }

            },
            fail: function (res) {
              console.log('获取用户session_key' + res.errMsg)
            }
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  }



})