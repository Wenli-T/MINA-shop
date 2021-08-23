// 同时发送异步请求的次数
let ajaxTimes = 0;
export const request = (params) => {
    // 判断url是否带有/my/(若有即表示请求的是私有路径 需要请求头header(token))
    let header = { ...params.header }
    if (params.url.includes('/my/')) {
        // 拼接header(token)
        header['Authorization'] = wx.getStorageSync('token')
    }

    ajaxTimes++;
    // 发请求前 显示一个  加载中 的效果
    wx.showLoading({
        title: '加载中',
        mask: true,
    })
    // 定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    // 关闭  加载中  效果
                    wx.hideLoading()
                }
            }
        });

    })
}