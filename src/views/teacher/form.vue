<template>
  <div class="app-container">
    <!-- 输入表单 -->
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker v-model="teacher.gmtCreate" :disabled="timeBtnDisabled" value-format="yyyy-MM-dd HH:mm:ss" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" :max="4"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
          <el-option :value="0" label="实习生"/>
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'

export default{
  data() {
    return {
      // 讲师对象
      teacher: {
        gmtCreate: this.getNowTime(),
        sort: 0,
        level: 1
      },
      saveBtnDisabled: false, // 默认按钮可以用
      timeBtnDisabled: true
    }
  },
  created() {
    console.log('create执行')

    // 路由中有id才调用
    //  this.getById(this.$route.params.id)
    if (this.$route.params.id) { this.getById(this.$route.params.id) }
  },
  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true // 禁用按钮
      console.log(this.teacher)
      if (this.$route.params.id) {
        this.updateData(this.teacher) // 有id 就更新
      } else {
        this.saveData() // 数据保存
      }
    },
    saveData() {
      teacherApi.save(this.teacher).then(response => {
        // 弹出提示
        this.$notify({
          title: '添加成功',
          message: '成功添加' + this.teacher.name + '讲师',
          type: 'success'
        })
        this.$router.push({
          path: '/teacher'
        })
      }).catch(() => {
        this.saveBtnDisabled = false
      })
    },

    updateData(id) {
      teacherApi.update(this.teacher).then(response => {
        // 弹出提示
        this.$notify({
          title: '修改成功',
          message: '成功修改',
          type: 'success'
        })
        this.$router.push({
          path: '/teacher'
        })
      }).catch(() => {
        this.saveBtnDisabled = false
      })
    },

    getById(id) {
      teacherApi.fetchDataById(id).then(response => {
        this.teacher = response.data.item
      })
    },

    // 处理默认选中当前日期
    getNowTime() {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      var hour = ' 00:00:00' // 默认时分秒 如果传给后台的格式为年月日时分秒，就需要加这个，如若不需要，此行可忽略
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date}${hour}`
      console.log(defaultDate)
      return defaultDate
    }
  }

}
</script>
