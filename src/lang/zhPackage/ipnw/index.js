import patientList from './patientlist/index'
import accessManage from './accessManage/index'

export default {
  ipnw: {
    ...patientList,
    ...accessManage
  }
}
