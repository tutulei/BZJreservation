// pages/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"请去“我的”完善个人信息",
    userstatus: app.globalData.STATUS_USER_TR,
    userno:"121212",

    announcement:"",

    rsid:"",
    rsstatus:"",
    rsdate: null,
    venuename:"",
    venue_id:"",
    contactList: [{
      "name": "张三",
      "phone": "13588897356",
      "time": "2019-11-14"
    }, {
      "name": "张三",
      "phone": "13588897356",
      "time": "2017-11-13"
    }, {
      "name": "张三",
      "phone": "13588897356",
      "time": "2017-11-10"
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUsermsg();
    this.getAnnouncement();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  appoint: function () {
    wx.navigateTo({
      url: '../detail/detail?reser_id='+this.data.rsid+"&venue_id="+this.data.venue_id
    })
  },

  button1: function () {
    wx.navigateTo({
      url: '../home/home'
    })
  },

  button2: function () {
    if(app.globalData.hasuser){
      wx.navigateTo({
        url: '../invite/invite'
      })
    }else{
      wx.showToast({
        title: '请先完善个人信息',
        icon: 'none',
        duration: 2000
      })
    }

  },

  button3: function () {
    if (app.globalData.hasuser) {
      wx.navigateTo({
        url: '../date/date'
      })
    } else {
      wx.showToast({
        title: '请先完善个人信息',
        icon: 'none',
        duration: 2000
      })
    }
  },
  
  button4: function () {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  getUsermsg: function () {
    const db = wx.cloud.database()
    db.collection('user').where({
      _openid: app.globalData.openid,
    }).get({
      success: res => {
        var data = res.data[0]
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        app.globalData.usermsg = data
        this.setData({
          username: data.user_name,
          userstatus: data.user_status,
          userno:data.user_no
        })
        app.globalData.hasuser = true
        this.getNowReservation();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  getAnnouncement:function(){
    const db = wx.cloud.database()
    db.collection('announcement').where({
      msg_id: 1,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0].msg)
        this.setData({
          announcement: res.data[0].msg,
        })
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  getNowReservation: function () {
    const db = wx.cloud.database()
    const _ = db.command
    
    // console.log(this.data.userno)
    db.collection('reservation').where({
      user_no: this.data.userno,
      reservation_status: _.or(_.eq(app.globalData.STATUS_RESER_WA), _.eq(app.globalData.STATUS_RESER_WP), _.eq(app.globalData.STATUS_RESER_OK)),
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data[0]
        this.setData({
          rsid: data._id,
          rsstatus: data.reservation_status,
          venue_id: data.venue_id,
          rsdate: data.reservation_date,
        })
        var id = data.venue_id 
        this.getVenueName(id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  getVenueName:function(id){
    // console.log("asdasda",id)
    const db = wx.cloud.database()
    db.collection('venue').where({
      _id: id,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0])
        var data = res.data[0]
        this.setData({
          venuename: data.venue_name,
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  }

})