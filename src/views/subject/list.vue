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

</script>
