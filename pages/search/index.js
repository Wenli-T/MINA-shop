// 引入用于发送请求的方法
import { request } from '../../request/index.js';
// 引入⽀持es7的async语法所需代码
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  data: {
    // 搜索结果数据-数组
    goods: [],
    // 控制 取消按钮 的显示与隐藏
    isFocus: false,
    // 输入框的值
    inpValue: ''
  },

  // 定时器id  用于--防抖，避免用户在输入时 持续发送请求
  timeId: -1,

  // 监听输入框值的改变
  handleInput(e) {
    // 获取输入框的值
    const { value } = e.detail;
    // 检测合法性
    if (!value.trim()) {
      // 没有输入东西
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    // 显示 取消按钮
    this.setData({
      isFocus: true
    })
    // 清除定时器
    clearTimeout(this.timeId);
    // 开启定时器
    this.timeId = setTimeout(() => {
      // 发起请求获取数据
      this.qsearch(value.trim())
    }, 1000)
  },

  // 发起请求获取搜索结果数据
  async qsearch(query) {
    const res = await request({ url: '/goods/qsearch', data: { query } });
    this.setData({
      goods: res
    })
  },

  // 点击 取消按钮
  handleCancel() {
    this.setData({
      inpValue: '',
      goods: [],
      isFocus: false
    })
  }

})