import { postCopy, getCopy } from '@/utils/requestEmr';



export default {
  async dssLogin(data) {
    return await postCopy('/CertSign/dssLogin', data)
  },
  async TSSSign(data) {
    return await postCopy('/CertSign/TSSSign', data)
  }
}
