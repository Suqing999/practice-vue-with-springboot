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
      <el-form-item label="讲师头像">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
          action="http://localhost:8120/admin/oss/file/upload?module=avatar">
          <img v-if="teacher.avatar" :src="teacher.avatar" class="avatar">
          <i v-else class="el-icon-circle-plus avatar-uploader-icon"/>
        </el-upload>
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
import { Message } from 'element-ui'
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
    // 文件上传成功的钩子函数
    handleAvatarSuccess(res) {
      // 因为是200的代码，所以http是正确的
      // 判断20000自定义
      if (res.success) {
        // 赋值
        this.teacher.avatar = res.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        Message({
          message: res.message + ' 错误代码：' + res.code,
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    // 文件上传失败
    handleAvatarError() {
      Message({
        message: '服务器错误',
        type: 'error',
        duration: 5 * 1000
      })
    },
    // 文件上传前的校验钩子
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png') // 这个是mime命名
      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
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
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
