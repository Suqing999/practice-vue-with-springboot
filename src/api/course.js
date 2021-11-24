import request from '@/utils/request'

export default{
  saveCourseInfo(courseInfo) {
    return request({
      url: '/edu-course/save-course-info',
      method: 'post',
      data: courseInfo
    })
  }
}
