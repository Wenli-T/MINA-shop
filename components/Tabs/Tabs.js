// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 接收父传递过来的数据
    tabs: {
      type: Array,
      value: []
    }
  },

  data: {

  },

  methods: {
    // 点击事件
    handleItemTap(e) {
      // 获取索引
      const { index } = e.currentTarget.dataset
      // 触发父组件中的事件
      this.triggerEvent("tabsItemChange", {index})
    }
   
    
  }
})
