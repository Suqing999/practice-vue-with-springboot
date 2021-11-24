import request from '@/utils/request'

export default{
  nestlist() {
    return request({
      url: '/subject/nested-list',
      method: 'get'
    })
  }
}
