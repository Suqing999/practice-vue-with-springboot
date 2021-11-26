import request from '@/utils/request'

export default{
  saveCourseInfo(courseInfo) {
    return request({
      url: '/edu-course/save-course-info',
      method: 'post',
      data: courseInfo
    })
  },
  updateCourseInfo(courseInfo) {
    return request({
      url: '/edu-course/update-course-info',
      method: 'post',
      data: courseInfo
    })
  },
  getCourseInfoById(id) {
    return request({
      url: `/edu-course/course-id/${id}`,
      method: 'get'
    })
  }

}
