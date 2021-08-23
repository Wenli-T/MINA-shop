
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        value: '品牌收藏',
        isActive: false
      },
      {
        id: 2,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 3,
        value: '浏览足迹',
        isActive: false
      }
    ],
    // 商品收藏的数据-数组
    collect: []
  },


  //监听页面显示
  onShow() {
    // 获取缓存中的商品收藏数据
    const collect = wx.getStorageSync('collect');
    // 存入data中
    this.setData({
      collect
    })
  },

  // 标题点击事件  从子组件传递过来
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const { index } = e.detail
    // 修改原数组
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 赋值到data中
    this.setData({
      tabs
    })
  },

})