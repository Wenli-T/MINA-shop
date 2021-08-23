
Page({

  data: {
    // 用户个人信息
    userInfo: {},
    // 被收藏的商品数量
    collectedNums: 0
  },
  // 监听页面显示
  onShow() {
    // 从缓存中获取用户个人信息 被收藏的商品数量
    const userInfo = wx.getStorageSync('userInfo');
    const collect = wx.getStorageSync('collect') || [];
    this.setData({ userInfo, collectedNums: collect.length })
  }


})