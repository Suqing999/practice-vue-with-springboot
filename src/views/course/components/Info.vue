<template>
  <div class="app-container">
    <!-- 课程信息表单 -->
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :value="teacher.id"
            :label="teacher.name" />
        </el-select>
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程分类">
        <!-- 一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectChanged">
          <el-option
            v-for="subject in subjectList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title" />
        </el-select>

        <!-- 二级分类 -->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="请选择">
          <el-option
            v-for="subject in subjectLevelTwoList"
            :key="subject.id"
            :value="subject.id"
            :label="subject.title" />
        </el-select>

      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="1" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          class="cover-uploader"
          action="http://localhost:8120/admin/oss/file/upload?module=cover">
          <img v-if="courseInfo.cover" :src="courseInfo.cover">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
    </el-form>

    <!-- 按钮>保存下一步 -->
    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="saveAndNext()">保存并下一步</el-button>
    </div>
  </div>
</template>

<script>
import courseApi from '@/api/course'
import teacherApi from '@/api/teacher'
import subjectApi from '@/api/subject'
// 富文本编辑器
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },

  data() {
    return {
      saveBtnDisabled: false, // 按钮是否禁用
      courseInfo: {// 表单数据
        price: 0,
        lessonNum: 0,
        // 以下解决表单数据不全时insert语句非空校验
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        cover: '',
        description: ''
      },

      teacherList: [], // 讲师列表
      subjectList: [], // 一级分类
      subjectLevelTwoList: [] // 二级分类
    }
  },

  created() {
    console.log(this.$parent.courseId)
    if (this.$parent.courseId) { // 回显
      this.fetchCourseInfoById(this.$parent.courseId)
      // 回显状态：应该渲染一级和二级（在fetchCourse中）
    } else { // 新增状态：只渲染一级类别
      this.initSubjectList()
    }
    this.initTeacherList()
  },

  methods: {
  // 数据回显
    fetchCourseInfoById(courseId) {
      console.log('回显')
      courseApi.getCourseInfoById(courseId).then(response => {
        this.courseInfo = response.data.item

        // 类别渲染
        subjectApi.nestlist().then(response => {
          this.subjectList = response.data.items
          // 判断this.subjectList下哪个一级类别是当前绑定的一级类别
          this.subjectList.forEach(subject => {
            if (subject.id === this.courseInfo.subjectParentId) {
              this.subjectLevelTwoList = subject.children
            }
          })
        })
      })
    },
    //   保存并下一步
    saveAndNext() {
      console.log('更新' + this.$parent.courseId)
      this.saveBtnDisabled = true
      if (this.$parent.courseId) { // 回显
        this.updateData()
      } else {
        this.saveData()
      }
    },
    saveData() {
      courseApi.saveCourseInfo(this.courseInfo).then(response => {
        this.$message.success(response.message)
        console.log(response.data)
        this.$parent.courseId = response.data.courseID// 获取id交给父组件
        // 成功后再下一步
        this.$parent.active = 1
      })
    },
    updateData() {
      courseApi.updateCourseInfo(this.courseInfo).then(response => {
        this.$message.success(response.message)
        this.$parent.active = 1
      })
    },
    initTeacherList() {
      teacherApi.list().then(response => {
        // console.log(response.data.items)
        this.teacherList = response.data.items
      })
    },
    initSubjectList() {
      subjectApi.nestlist().then(response => {
        console.log(response.data.items)
        this.subjectList = response.data.items
      })
    },
    subjectChanged(oneData) {
      // 切换一级
      // console.log(oneData + '哇gags的')
      this.subjectList.forEach(subject => {
        // 先去清空
        this.courseInfo.subjectId = ''
        if (subject.id === oneData) {
          this.subjectLevelTwoList = subject.children
        }
      })
    },
    // 上传成功回调
    handleCoverSuccess(res, file) {
      if (res.success) {
        // console.log(res)
        this.courseInfo.cover = res.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败1（非20000）')
      }
    },

    // 上传校验
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 错误处理
    handleCoverError() {
      console.log('error')
      this.$message.error('上传失败（http错误）')
    }

  }
}
</script>

<style>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cover-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cover-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}
.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
