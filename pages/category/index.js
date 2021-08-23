// 引入用于发送请求的方法
import { request } from "../../request/index.js";
// 引入⽀持es7的async语法所需代码
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧滚动条距离顶部距离
    scrollTop: 0
  },

  // 接口的返回数据
  Cates: [],

  onLoad: function (options) {
    // 获取本地存储数据
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      // 本地存储无旧数据 发起请求获取分类数据
      this.getCates()
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        // 本地存储的旧数据过期 重新发送请求获取数据
        this.getCates()
      } else {
        // 使用本地存储的旧数据
        this.Cates = Cates.data
        // 渲染页面
        // 左侧菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        // 右侧商品数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },

  // 获取分类数据
  async getCates() {
    /* request({ url: "/categories" })
       .then(res => {
         // console.log(res)
         this.Cates = res.data.message
 
         // 将接口返回的数据存入到本地存储中
         wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
 
         // 构造左侧菜单数据
         let leftMenuList = this.Cates.map(v => v.cat_name)
         // 构造右侧商品数据
         let rightContent = this.Cates[0].children
         this.setData({
           leftMenuList,
           rightContent
         })
       }) */
    const res = await request({ url: "/categories" })
    this.Cates = res

    // 将接口返回的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })

    // 构造左侧菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    // 构造右侧商品数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset;
    // 根据左侧菜单不同索引渲染右侧的商品内容
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 每切换左侧导航栏时，将右侧滚动条位置重置为顶端
      scrollTop: 0
    })
    //
  }

})