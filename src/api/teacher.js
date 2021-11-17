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
      params: searchObj
    })
  },
  deleteTeacher(id) {
    return request({
      url: `/teacher/${id}`,
      method: 'delete'
    })
  }

}
