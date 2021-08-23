
Page({
  // 获取用户个人信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const { userInfo } = res
        // 存入缓存中
        wx.setStorageSync('userInfo', userInfo)
        // 返回上一级页面
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }

})