import request from '@/utils/request'

export default{

  list() {
    return request({
      url: '/teacher/list',
      method: 'get'
    })
  },
  pageList(page, limit, searchObj) {
    return request({
      url: `/teacher/${page}/${limit}`,
      method: 'get',
      // 表单或者url参数
      params: searchObj
    })
  },
  deleteTeacher(id) {
    return request({
      url: `/teacher/${id}`,
      method: 'delete'
    })
  },
  save(teacher) {
    return request({
      url: '/teacher/save',
      method: 'post',
      contentType: 'application/json;charset=UTF-8', // 设置后
      // json数据提交
      data: teacher
    })
  },
  update(teacher) {
    return request({
      url: `/teacher/${teacher.id}`,
      method: 'put',
      data: teacher
    })
  },

  fetchDataById(id) {
    return request({
      url: `/teacher/${id}`,
      method: 'get'
    })
  }

}
