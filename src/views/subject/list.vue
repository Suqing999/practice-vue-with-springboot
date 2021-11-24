<template>
  <div class="app-container">

    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"/>

    <el-tree
      ref="tree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode" />
  </div>
</template>

<script>
import subjectApi from '@/api/subject'
export default{
  data() {
    return {
      filterText: '', // 过滤文本
      subjectList: [], // 数据列表
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    // 监听文本框
    filterText(val) {
      // console.log(val)
      // 会调用tree中的filter方法，把值传入:filter-node-method="filterNode" 的第一个参数
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 调用api模块
    fetchData() {
      subjectApi.nestlist().then(response => {
        console.log('调用了分类')
        this.subjectList = response.data.items
      })
    },
    filterNode(value, data) {
      // data是当前节点   value 是自己输入的筛选
      console.log(value + '再塞西' + data)
      if (!value) return true // 什么都没输入就返回所有
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 // 没有就是-1
    }
  }
}
</script>
