<template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="姓名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="职位">
          <el-option value="1" label="高级讲师"/>
          <el-option value="2" label="首席讲师"/>
          <el-option value="0" label="实习生"/>
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.begin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.end"
          placeholder="结束时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border stripe>
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          {{ (page-1)*limit+scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column prop="level" label="头衔" width="200" >
        <!-- <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':"首席讲师" }}
        </template> -->
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level===1" type="success">高级讲师</el-tag>
          <el-tag v-if="scope.row.level===2" type="danger">首席讲师</el-tag>
          <el-tag v-if="scope.row.level!=1&&scope.row.level!=2">实习生</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="gmtCreate" label="入驻时间" width="160" />
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="medium"
            @click="deleteRow(scope.row.id,scope.row.name)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[1,2,3,4,5]"
      style="text-align:center; padding:50px"
      layout="total,prev, pager, next, jumper,->,sizes"
      background ="true"
      small = "true"
      prev-text ="往前"
      next-text ="往后"
      @size-change="changeSizeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClick"
      @next-click="nextClick"/>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'

export default{
  data() {
    return {
      list: [], // 讲师列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      searchObj: {

      } // 查询表单
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 调用api模块
    fetchData() {
      // 由于已经return回来了 可以直接then
      // teacherApi.list().then(response => {
      //   this.list = response.data.items
      // })
      teacherApi.pageList(this.page, this.limit, this.searchObj).then(response => {
        console.log('调用了')
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    currentChangeHandle(page) {
      console.log('调用' + page)
      this.page = page
      this.fetchData()
    },
    changeSizeHandle(limit) {
      console.log('调用limit' + limit)
      this.limit = limit
      this.fetchData()
    },
    prevClick(page) {
      this.page = page
      this.fetchData()
    },
    nextClick(page) {
      this.page = page
      this.fetchData()
    },
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    deleteRow(id, name) {
      this.$confirm('请确认是否删除' + name + '讲师?', '注意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacherApi.deleteTeacher(id, name).then(response => {
          console.log('删除id: ' + id)
          this.$notify({
            title: '删除成功',
            message: '成功删除' + name + '讲师',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(error => {
        if (error === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    }

  }
}
</script>
