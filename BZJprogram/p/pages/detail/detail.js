// pages/detail/detail.

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isleader:false,
    // reservationid:"",
    code:"",

    //页面传参
    reser_id:"699679fa5de45233011827ac5f4b6efd",
    venue_id:"c3429d2d-4898-45c0-8b9c-22dc67f290f6",
    //预约信息
    venuename:"",
    reserstatus: "",
    venueaddr: "",
    veneutime: "",
    leadername: "",
    venuedes: "",
    reserdate: "",
    reserfrom: "",
    resermenbercount: "",
    reserphone: "",
    reserreason: "",
    tools: "",
    havetools: false,

    resermenbers:"",
    menberslist: [{
      name: "李四",
      no: "31701099"
    }]



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      reser_id:options.reser_id,
      venue_id:options.venue_id,
      isleader:this.isLeader()
    })
    this.setresermsg()
    this.setvenuemsg()
    this.setInviteCode()
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

  kick: function() {
    
  },

  exit: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  isLeader:function(){
    const db = wx.cloud.database()
    db.collection('reservation').where({
      _id: this.data.reser_id
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        this.setData({
          isleader: res.data[0].user_no == app.globalData.usermsg.user_no? true:false,
        })
        if(this.data.isleader){
          this.setData({
            leadername:app.globalData.usermsg.user_name,
          })
        }else{
          db.collection('user').where({
            user_no: res.data[0].user_no
          }).get({
            success: res => {
              this.setData({
                leadername: res.data[0].user_name,
              })
            }
          })
        }
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
  setvenuemsg:function(){
    const db = wx.cloud.database()
    db.collection('venue').where({
      _id: this.data.venue_id
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        var data = res.data[0]
        this.setData({
          venuename: data.venue_name,
          venueaddr: data.venue_addr,
          veneutime: data.venue_time,
          venuedes: data.venue_des,
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
  setmenbers:function(str){
    var s = str.split(",")
    var list = [];
    for(var i=0;i<s.length;i++){
      var jstr = {}
      jstr.no = s[i]
      jstr.name =""
      list.push(jstr)
    }

    const db = wx.cloud.database()
    var size = list.length
    for (var i = 0; i < list.length; i++){
      console.log(list[i].no)
      db.collection('user').where({
        user_no: list[i].no,
      }).get({
        success: res => {
          console.log('[数据库] [查询记录] 成功: ', res.data[0])
          // console.log(i-(size--))//伪传入i
          list[i - (size--)].name = res.data[0].user_name
          // console.log(list)
          this.setData({
            menberslist: list,
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
  },
  setInviteCode:function(){
    const db = wx.cloud.database()
    db.collection('invite').where({
      reservation_id: this.data.reser_id,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0].msg)
        this.setData({
          code: res.data[0].invite_code
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
  setresermsg:function(){
    const db = wx.cloud.database()
    db.collection('reservation').where({
      _id: this.data.reser_id,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res.data[0].msg)
        this.setData({
          reserstatus: res.data[0].reservation_status,
          reserdate: res.data[0].reservation_status,
          reserfrom: res.data[0].reservation_from,
          resermenbercount: res.data[0].reservation_menbercount,
          reserphone: res.data[0].reservation_phone,
          reserreason: res.data[0].reservation_reason,
          tools: res.data[0].reservation_tools,
          havetools: res.data[0].reservation_usetools,

        })
        this.setmenbers(res.data[0].reservation_menber)
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
})