// 引入用于发送请求的方法
import { request } from '../../request/index.js';
// 引入⽀持es7的async语法所需代码
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ],
    // 订单列表
    orders: []
  },

  // 监听页面显示
  onShow() {
    // 获取缓存中的token
    const token = wx.getStorageSync('token')
    // 缓存中不存在token 直接跳转到授权页面
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 获取当前的小程序的页面栈-数组，长度最大是10页面
    let pages = getCurrentPages();
    // 数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 获取url中的type参数
    const { type } = currentPage.options;
    // 根据type和索引index关系 激活选中相应的标题
    this.changeTitleByIndex(type - 1)
    // 获取订单列表
    this.getOrders(type);
  },

  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: '/my/orders/all', data: { type } });
    this.setData({
      orders: res.orders.map(v => ({ ...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
    })
  },

  // 根据标题索引来激活选中标题
  changeTitleByIndex(index) {
    // 修改原数组
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 赋值到data中
    this.setData({
      tabs
    })
  },

  // 标题点击事件  从子组件传递过来
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const { index } = e.detail
    // 根据标题索引来激活选中标题
    this.changeTitleByIndex(index)
    // 重新发起请求 获取订单列表 type-1=index
    this.getOrders(index + 1)
  },

})