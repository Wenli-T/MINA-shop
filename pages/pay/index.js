// 引入用于发送请求的方法
import { request } from '../../request/index.js';
// 引入⽀持es7的async语法所需代码 (已更新 可不用引入)
import regeneratorRuntime from '../../lib/runtime/runtime';
// 引入封装好的方法
import { requestPayment, showToast } from '../../utils/asyncWx.js'

Page({
  data: {
    // 收获地址
    address: {},
    // 购物车数据
    cart: [],
    // 底部工具栏--合计
    totalPrice: 0,
    totalNum: 0
  },

  // 监听页面显示
  onShow() {
    // 获取缓存中的收获地址信息 购物车数据
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    // 计算总价 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })
    // 赋值给data
    this.setData({
      cart,
      address,
      totalPrice,
      totalNum
    })
  },

  // 点击支付功能
  async handleOrderPay() {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync('token')
      // 无token 跳转到授权页面auth/index
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      // 有token 创建订单
      // 请求头参数
      // const header = { Authorization: token };
      // 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      // 发送请求 创建订单 获取订单编号
      const { order_number } = await request({ url: '/my/orders/create', data: orderParams, method: 'POST' })
      // 发起请求  获取支付参数pay
      const { pay } = await request({ url: '/my/orders/req_unifiedorder', data: { order_number }, method: 'POST' })
      // 发起微信支付
      await requestPayment(pay)
      // console.log(res); // 无权限 下面的代码无法执行了 直接跳到支付失败
      // 发起请求 查看订单支付状态
      await request({ url: '/my/orders/chkOrder', data: { order_number }, method: 'POST' })
      await showToast({ title: '支付成功' })
      // 手动删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart)
      // 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      })
    } catch (error) {
      await showToast({ title: '支付失败' })
      console.log(error);
    }

  }
})