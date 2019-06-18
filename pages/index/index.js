//index.js

Page({
  data: {
    todos: [],
    input: '',
    leftCount: 0,
    allCompleted: false,
    logs: []
  },
  // 操作缓存
  save() {
    wx.setStorageSync('todo_list', this.data.todos),
    wx.setStorageSync('todo_logs', this.data.logs)
  },
  // 默认加载缓存中的数据
  load() {
    var todos = wx.getStorageSync('todo_list')
    if(todos) {
      var leftCount = todos.filter(function(item) {
        return !item.completed
      }).length
      this.setData({todos: todos, leftCount: leftCount})
    }
    var logs = wx.getStorageSync('todo_logs')
    if(logs) {
      this.setData({logs: logs})
    }
  },
  // 首次加载
  onLoad() {
    this.load()
  },
  // 输入时 动态修改data中的input
  inputChangeHandle(e) {
    this.setData({input: e.detail.value})
  },
  // 回车添加代办事项
  addTodoHandle() {
    // 判断提交内容是否为空
    if(!this.data.input || !this.data.input.trim()) return
    var todos = this.data.todos
    todos.push({name: this.data.input, completed: false})
    var logs = this.data.logs
    logs.push({timestamp: new Date(), action: 'Add', name: this.data.input})
    this.setData({
      todos: todos,
      input: '',
      leftCount: this.data.leftCount + 1,
      logs: logs
    })
    this.save()
  },
  // 点击切换是否完成状态
  toggleTodoHandle(e) {
    // 获取当前点击的index值
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    todos[index].completed = !todos[index].completed
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: todos[index].completed? 'Finish' : 'Restart',
      name: todos[index].name
    })
    this.setData({
      logs: logs,
      todos: todos,
      leftCount: this.data.leftCount + (todos[index].completed? -1 : 1)
    })
    this.save()
  },
  // 删除待办事项
  removeTodoHandle(e) {
    const index = e.currentTarget.dataset.index
    var todos = this.data.todos
    var remove = todos.splice(index, 1)[0]
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: 'Remove',
      name: remove.name
    })
    this.setData({
      logs: logs,
      todos: todos,
      leftCount: this.data.leftCount - (remove.completed? 0: 1)
    })
    this.save()
  },
  // toggle all 按钮事件
  toggleAllHandle(e) {
    this.data.allCompleted = !this.data.allCompleted
    var todos = this.data.todos
    for(var i=0;i<todos.length;i++) {
      todos[i].completed = this.data.allCompleted
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: this.data.allCompleted ? 'Finish' : 'Restart',
      name: 'All todos'
    })
    this.setData({
      logs: logs,
      todos: todos,
      leftCount: this.data.allCompleted ? 0 : todos.length
    })
    this.save()
  },
  // clear Completed 按钮事件
  clearCompletedHandle(e) {
    var todos = this.data.todos
    var remains = []
    for(var i=0;i<todos.length;i++) {
      // 为什么这么写？删除已完成的：如果|| 前为true 则执行 || 前的代码，如果|| 前为false，则执行 || 后的代码
      // || 的运算方法：
      // 只要“||”前面为false, 不管“||”后面是true还是false，都返回“||”后面的值。
      // 只要“||”前面为true, 不管“||”后面是true还是false，都返回“||”前面的值。
      todos[i].completed || remains.push(todos[i])
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: 'Clear',
      name: 'Completed todo'
    })
    this.setData({
      logs: logs,
      todos: remains,
    })
    this.save()
  }
})
