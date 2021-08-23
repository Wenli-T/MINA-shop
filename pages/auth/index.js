// 引入用于发送请求的方法
import { request } from '../../request/index.js';
// 引入⽀持es7的async语法所需代码 (已更新 可不用引入)
import regeneratorRuntime from '../../lib/runtime/runtime';
// 引入封装好的方法
import { login } from '../../utils/asyncWx.js'

Page({

  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail
      // 获取小程序登录成功后的code值
      const { code } = await login();
      // 请求参数
      const loginParams = { encryptedData, rawData, iv, signature, code }
      // 发送请求获取用户的token值
      // const { token } = await request({ url: '/users/wxlogin', data: loginParams, method: 'POST' })
      // 因无权限 故直接赋值一个常量 以便后续开发
      let { token } = { token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo' }
      // 把token存入缓存中 同时跳转回上一个页面
      wx.setStorageSync('token', token)
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }

  }
})