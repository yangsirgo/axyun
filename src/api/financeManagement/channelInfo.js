import {
  post,
  get,
  put,
  del
} from '@/utils/request'



export default {
  // 删除渠道信息
  async delChannelById(data) {
    return await del('/finance-pub/channelInfo/deleteChannelInfoById/'+data);
  },
  // 获取渠道信息
  async listPageChannel(data) {
    return await get('/finance-pub/channelInfo/listPageChannelInfo', data, false);
  },
  // 新增渠道信息
  async addChannel(data) {
    return await post('/finance-pub/channelInfo/addChannelInfo', data, false);
  },
  // 新增渠道信息
  async updateChannel(data) {
    return await put('/finance-pub/channelInfo/updateChannelInfo', data, false);
  },
  
}