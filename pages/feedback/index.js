import { showToast } from '../../utils/asyncWx.js'
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    // 被选中的图片路径-数组
    choosedImgs: [],
    // 文本域的内容
    textVal: '',
  },

  // 外网的图片路径数组
  uploadImgs: [],

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

  // 点击 + 选择图片
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片路径 进行拼接
          choosedImgs: [...this.data.choosedImgs, ...result.tempFilePaths]
        })
      },

    });

  },

  // 点击自定义图片组件
  handleRemoveImg(e) {
    // 获取被点击的图片的索引index
    const { index } = e.currentTarget.dataset
    console.log(index);
    // 获取data中的图片数组
    let { choosedImgs } = this.data;
    // 删除被选中的图片
    choosedImgs.splice(index, 1);
    // 刷新data中图片数组
    this.setData({
      choosedImgs
    })
  },

  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },

  // 点击 提交按钮
  handleFormSubmit() {
    // 获取文本域的内容 图片数组
    const { textVal, choosedImgs } = this.data
    // 合法性验证
    if (!textVal.trim()) {
      // 不合法
      showToast({ title: '请输入内容' })
      return;
    }

    // 上传中 显示正在上传的提示
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })

    // 判断有没有需要上传的图片数组
    if (choosedImgs.length != 0) {
      // 上传图片到专门的服务器 内置api只能上传单个文件 遍历上传
      choosedImgs.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://img.coolcr.cn/api/upload',
          // 所上传图片的路径
          filePath: v,
          // 所上传图片的名称 后台用于获取文件
          name: 'image',
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            // 获取图床里的图片新路径
            let url = JSON.parse(result.data).data.url;
            // 存入数组中
            this.uploadImgs.push(url)

            // 所有图片上传完毕才触发
            if (this.uploadImgs.length === choosedImgs.length) {
              // 上传完毕 关闭上传中的提示
              wx.hideLoading();

              // 发起请求  交给后台 此时仅作模拟 
              console.log('把文本域内容和外网的图片路径数组 提交到后台中')

              // 提交成功后 重置页面
              this.setData({
                textVal: '',
                choosedImgs: []
              })
              // 给用户一个提示
              showToast({ title: '提交成功' })
              // 返回上一级页面
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)

            }
          },
        });

      })
    } else {

      // 上传完毕 关闭上传中的提示
      wx.hideLoading();

      // 发起请求  交给后台 此时仅作模拟 
      console.log('只提交了文本');

      // 提交成功后 重置页面
      this.setData({
        textVal: ''
      })
      // 给用户一个提示
      showToast({ title: '提交成功' })
      // 返回上一级页面
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)


    }



  }
})