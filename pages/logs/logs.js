Page({
  data: {
    logs: []
  },
  onShow() {
    var logs = wx.getStorageSync('todo_logs')
    if(logs) {
      // 逆序排列 最新的在最上边
      this.setData({logs: logs.reverse()})
    }
  }
})
