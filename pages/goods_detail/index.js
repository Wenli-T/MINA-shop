// 引入用于发送请求的方法
import { request } from '../../request/index.js';
// 引入⽀持es7的async语法所需代码
import regeneratorRuntime from '../../lib/runtime/runtime';
import { showToast } from '../../utils/asyncWx.js'

Page({
  data: {
    // 商品详情数据
    goodsObj: {},
    // 商品是否被收藏
    isColleced: false
  },

  // 监听页面显示
  onShow() {
    // 获取当前的小程序的页面栈-数组，长度最大是10页面
    let pages = getCurrentPages();
    // 数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } })
    // console.log(goodsObj);

    // 获取缓存中的商品收藏数据-数组
    let collect = wx.getStorageSync('collect') || []
    // 判断当前商品是否被收藏
    let isColleced = collect.some(v => v.goods_id === goodsObj.goods_id)

    this.setData({
      // 为提高性能 按需取数据
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // 解决iphone部分手机不识别webp格式图片问题 可让后台直接改
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics,
        goods_small_logo: goodsObj.goods_small_logo,
        goods_id: goodsObj.goods_id
      },
      isColleced
    })
  },

  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    // 构造要预览的图片数组
    const urls = this.data.goodsObj.pics.map(v => v.pics_mid)
    // 被点击图片的url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    });
  },

  // 点击  加入购物车  触发的事件
  handleCartAdd() {
    // 获取缓存中的购物车数据(数组)
    let cart = wx.getStorageSync('cart') || []
    // 判断刚添加的商品是否已存在于购物车中
    let index = cart.findIndex(v => v.goods_id === this.data.goodsObj.goods_id)
    if (index === -1) {
      // 不存在 第一次添加
      this.data.goodsObj.num = 1
      this.data.goodsObj.checked = true
      cart.push(this.data.goodsObj)
    } else {
      // 已存在 商品数量++
      cart[index].num++
    }
    // 刷新购物车数据(添加回缓存中)
    wx.setStorageSync('cart', cart)
    // 给用户一个提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 值为true 防止用户手抖 持续点击  
      mask: true
    })
  },

  // 点击 收藏 触发的事件
  handleCollect() {
    let isColleced = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 判断该商品是否被收藏 index !== -1 表示已收藏
    let index = collect.findIndex(v => v.goods_id === this.data.goodsObj.goods_id)
    if (index !== -1) {
      // 已收藏时 点击收藏  从数组中删除
      collect.splice(index, 1)
      // 修改图标
      isColleced = false
      // 给用户一个消息提示
      showToast({ title: '取消收藏成功' })
    } else {
      // 未收藏 点击收藏 添加到数组中
      collect.push(this.data.goodsObj)
      // 修改图标
      isColleced = true
      // 给用户一个消息提示
      showToast({ title: '收藏成功' })
    }
    // 将商品收藏数组存到缓存中
    wx.setStorageSync('collect', collect)
    // 修改data中的isCollected
    this.setData({
      isColleced
    })

  }

})