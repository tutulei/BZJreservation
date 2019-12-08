// pages/table/table.js\

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: true, value: '是' },
      { name: false, value: '否', checked: 'true' },
    ],
    venueid:"",
    venuename:"",
    session:"",
    date:"",
    name:"",
    no:"",
    phone:"",
    appsector:"",
    pernumber:"",
    appreason:"",
    hastools:false,
    toolsmsg:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date(JSON.parse(options.date))
    this.setData({
      venueid: options.venue_id,
      date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    })

    

    if (app.globalData.hasuser){
      var msg = app.globalData.usermsg
      this.setData({
        name:msg.user_name,
        no:msg.user_no,
        phone:msg.user_phone,
      })
      this.setVenueMsg()
    }else{
        wx.navigateBack({
          delta: 1,
        })
    }
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

  /**
   * 获取input值
   */
  getPhoneInput:function(e){
    this.setData({
      phone:e.detail.value,
    })
  },
  getAppSectorInput: function (e) {
    this.setData({
      appsector: e.detail.value,
    })
  },
  getNumInput: function (e) {
    this.setData({
      pernumber: e.detail.value,
    })
  },
  getReasonInput: function (e) {
    this.setData({
      appreason: e.detail.value,
    })
  },
  getToolsInput: function (e) {
    this.setData({
      toolsmsg: e.detail.value,
    })
  },
  radioChange: function (e) {
    //这个e.detail.value返回值是string！！！！！！！！！日狗
    // this.setData({
    //   sex: e.detail.value? "女" : "男",
    // })
    this.setData({
      hastools: e.detail.value === "true" ? true : false,
    })

  },



  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value),
      wx.showModal({
        title: '提示',
        content: '申请后会进入待提交状态，可以去详情信息里面修改信息',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            this.putReserMsg();
            wx.navigateBack({
              delta: 20,
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

  },
  
  formReset: function () {
    console.log('form发生了reset事件'),
    wx.navigateBack({
      delta: 1,
    })
  },

  putReserMsg:function(){
    const db = wx.cloud.database()
    db.collection('reservation').add({
      // 要插入的数据
      data: {
        user_no: app.globalData.usermsg.user_no,
        reservation_phone:this.data.phone,
        reservation_date: this.data.date,
        reservation_menber: "",
        reservation_menbercount: this.data.pernumber,
        reservation_usetools: this.data.hastools,
        reservation_status: "待提交",
        venue_id:this.data.venue_id,
        reservation_reason:this.data.appreason,
        reservation_tools:this.data.toolsmsg,
        reservation_from:this.data.appsector,
      }
    }).then(res => {
      // 插入数据成功
      // console.log(res._id)
      this.setData({
        inputhid: true,
        fixedhid: false,
      })
      this.creatInviteCode(res._id)
      this.userAddId(res._id)
    }).catch(err => {
      // 插入数据失败
      console.log(err)
    })
  },
  setVenueMsg:function(){
    const db = wx.cloud.database()
    // console.log(this.data.venueid)
    db.collection('venue').where({
      _id: this.data.venueid,
    }).get({
      success: res => {
        // console.log('[数据库] [查询记录] 成功: ', res)
        var data = res.data[0]
        this.setData({
          venuename:data.venue_name,
          session:data.venue_time,
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
  userAddId:function(id){
    const db = wx.cloud.database();
    db.collection('user').doc(app.globalData.usermsg._id).update({
      data: {
        reservation_id: 'id',
        user_status: app.globalData.STATUS_USER_HR,
      }
    }).then(res => {
      // console.log(res)
    })

  },

  creatInviteCode:function(id){
    // console.log(id)
    const db = wx.cloud.database()
    var code = this.creatCode()
    while(!this.isuniqueCode(code)){
      code = this.creatCode()
    }
    db.collection('invite').add({
      // 要插入的数据
      data: {
        invite_code: code,
        reservation_id: id,
      }
    }).then(res => {
      // 插入数据成功
      console.log(res)
    }).catch(err => {
      // 插入数据失败
      console.log(err)
    })
  },
  creatCode:function(){
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var code = ""
    for (var i = 0; i < 4; i++) {
      var pos = Math.round(Math.random() * (arr.length - 1));
      code += arr[pos];
    }
    return code
  },
  isuniqueCode:function(code){
    var is = true;
    const db = wx.cloud.database()
    db.collection('invite').where({
      invite_code: code,
    }).get({
      success: res => {
        // console.log(res)
        if (res.data[0] === undefined) {
          // console.log("isNULL")
          is= true
        }else{
          // console.log(res.data[0])
          is= false
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
    return is
  },

})