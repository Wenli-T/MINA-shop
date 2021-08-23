// 引入用于发送请求的方法
import { request } from '../../request/index.js';
// 引入⽀持es7的async语法所需代码
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    // 商品列表数据
    goodsList: []
  },

  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 数据总页数
  totalPages: 1,
  // 数据总条数
  total: 1,

  onLoad: function (options) {
    this.QueryParams.cid = options.cid || ''
    // 由首页跳转
    this.QueryParams.query = options.query || ''
    this.getGoodsList()
  },

  // 获取商品列表的数据
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryParams })
    // 数据总条数
    const total = res.total
    // 数据总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      // 将已有的数据与返回的数据进行拼接
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
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

  // 页面上滑 滚动条触底事件
  onReachBottom() {
    // 判断是否有下一页
    if (this.QueryParams.pagenum >= this.total) {
      // 没有下一页 给用户一个提示
      wx.showToast({ title: '到底了' })
    } else {
      // 还有下一页
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },

  // 监听用户下拉操作（生命周期函数）
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1
    // 重新发请求获取数据
    this.getGoodsList()
  }
})