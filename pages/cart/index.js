// 引入⽀持es7的async语法所需代码 (已更新 可不用引入)
import regeneratorRuntime from '../../lib/runtime/runtime';
import { chooseAddress, showModal, showToast } from '../../utils/asyncWx.js'

Page({
  data: {
    // 收获地址
    address: {},
    // 购物车数据
    cart: [],
    // 底部工具栏--全选
    allChecked: false,
    // 底部工具栏--合计
    totalPrice: 0,
    totalNum: 0
  },

  // 监听页面显示
  onShow() {
    // 获取缓存中的收获地址信息 购物车数据
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart') || [];
    this.setData({ address });
    this.setCart(cart);
  },

  // 点击按钮 添加收货地址
  async handleChooseAddress() {
    // 获取收货地址
    /* wx.chooseAddress({
       success: (result) => {
         console.log(result);
       },
     }); */
    let address = await chooseAddress();
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    // 存入到本地缓存中
    wx.setStorageSync('address', address);
  },

  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let { cart } = this.data
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 选中状态取反
    cart[index].checked = !cart[index].checked
    this.setCart(cart)
  },

  // 改变购物车状态时,重新计算底部工具栏涉及的数据并把购物车数据重新赋值给data和缓存
  setCart(cart) {
    let allChecked = true;
    // 计算总价 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length ? allChecked : false

    // 赋值给data
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    // 购物车数据重新存到缓存中
    wx.setStorageSync('cart', cart)
  },

  // 监听商品--全选的改变
  handleItemAllCheck() {
    // 获取data中数据
    let { cart, allChecked } = this.data;
    // 全选状态取反
    allChecked = !allChecked;
    // 循环修改cart数组中商品的选中状态
    cart.forEach(v => v.checked = allChecked)
    // 修改的值填充回data/缓存中
    this.setCart(cart)
  },

  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 商品数量为1时 用户点击- 弹窗提示 用户是否要删除该商品
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: '您是否要删除？' })
      // 用户确认删除
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
        return;
      } else {
        // 用户取消删除
        return;
      }
    }
    // 进行修改数量
    cart[index].num += operation;
    // 设置回data/缓存中
    this.setCart(cart)
  },

  // 点击底部工具栏-结算
  async handlePay() {
    // 判断收获地址是否已添加
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: '您还没有添加收获地址' })
      return;
    }
    // 判断用户是否选购商品
    if (totalNum === 0) {
      await showToast({ title: '您还没有选购商品' })
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }

})