import base from "./zhPackage/base/index"; // 公共模块
import cis from "./zhPackage/cis/index"; // 门诊医生站
import ipnw from "./zhPackage/ipnw/index"; // 住院护士站
import residency from './zhPackage/residency/index' //住院医生站
import retreat from './zhPackage/outpatientFinancial/index' //门诊退号
import receipt from './zhPackage/financeManagement/receipt/index' //财务管理-->票据管理

export default {
    base: {...base},
    login: {
        title: "智慧医疗云医院管理系统",
        login: "登录"
    },
    ...ipnw,
    ...cis,
    ...residency,
    ...retreat,
    ...receipt
};
