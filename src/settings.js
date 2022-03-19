module.exports = {

  title: '罗湖智慧云社康',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,
  // 表格配置数据
  tableConfiguration: {
    //居民健康档案
    ResidentHealthRecord: {
      title: "居民健康档案",
      tableName: "ResidentHealthRecord",
      data: {
        twentySeventeen: {
          component: "ResidentHealthRecordPage",
          pageList: [{
            title: "居民健康档案封面",
            index: 1,
            menuKey: "ResidentHealthRecordPage1"
          },
          {
            title: "个人基本信息表",
            index: 2,
            menuKey: "ResidentHealthRecordPage2"
          },
          {
            title: "居民健康档案信息卡",
            index: 3,
            menuKey: "ResidentHealthRecordPage3"
          }
          ],
          maxActive: 2,
          dataYear: "twentySeventeen"
        }
      }
    },
    // 健康体检表
    HealthChecklist: {
      title: "健康体检表",
      tableName: "HealthChecklist",
      data: {
        twentySeventeen: {
          component: "HealthChecklistPage",
          pageList: [{
            title: "健康体检表一",
            index: 1,
            menuKey: "HealthChecklistPage1"
          },
          {
            title: "健康体检表二",
            index: 2,
            menuKey: "HealthChecklistPage2"
          },
          {
            title: "健康体检表三",
            index: 3,
            menuKey: "HealthChecklistPage3"
          },
          {
            title: "健康体检表四",
            index: 4,
            menuKey: "HealthChecklistPage4"
          },
          {
            title: "健康体检表五",
            index: 5,
            menuKey: "HealthChecklistPage5"
          }
          ],
          maxActive: 4,
          dataYear: "twentySeventeen"
        },
        twentyTwenty: {
          component: "HealthChecklistPage",
          pageList: [{
            title: "健康体检表一",
            index: 1,
            menuKey: "HealthChecklistPage1"
          },
          {
            title: "健康体检表二",
            index: 2,
            menuKey: "HealthChecklistPage2"
          },
          {
            title: "健康体检表三",
            index: 3,
            menuKey: "HealthChecklistPage3"
          },
          {
            title: "健康体检表四",
            index: 4,
            menuKey: "HealthChecklistPage4"
          }
          ],
          maxActive: 3,
          dataYear: "twentyTwenty"
        }
      }
    },
    //高血压患者随访服务记录表
    HypertensionFlp: {
      title: "高血压患者随访服务记录表",
      tableName: "HypertensionFlp",
      data: {
        twentySeventeen: {
          component: "HypertensionFlpPage",
          pageList: [{
            title: "高血压患者随访服务记录表",
            index: 1,
            menuKey: "HypertensionFlpPage"
          }],
          maxActive: 1,
          dataYear: "twentySeventeen"
        }
      }
    },
    //2型糖尿病患者随访服务记录表
    DocFlpDiabetes: {
      title: "2型糖尿病患者随访服务记录表",
      tableName: "DocFlpDiabetes",
      data: {
        twentySeventeen: {
          component: "DocFlpDiabetesPage",
          pageList: [{
            title: "2型糖尿病患者随访服务记录表",
            index: 1,
            menuKey: "DocFlpDiabetesPage"
          }],
          maxActive: 1,
          dataYear: "twentySeventeen"
        }
      }
    },
    //老年人生活自理能力评估表
    DocSelfcare: {
      title: "老年人生活自理能力评估表",
      tableName: "DocSelfcare",
      data: {
        twentySeventeen: {
          component: "DocSelfcarePage",
          pageList: [{
            title: "老年人生活自理能力评估表",
            index: 1,
            menuKey: "DocSelfcarePage"
          }],
          maxActive: 1,
          dataYear: "twentySeventeen"
        }
      }
    },

    //老年人中医药健康管理服务记录表
    DocCmHlthMngmt: {
      title: "老年人中医药健康管理服务记录表",
      tableName: "DocCmHlthMngmt",
      data: {
        twentySeventeen: {
          component: "DocCmHlthMngmtPage",
          pageList: [{
            title: "第一页",
            index: 1,
            menuKey: "DocCmHlthMngmtPage1"
          },
          {
            title: "第二页",
            index: 2,
            menuKey: "DocCmHlthMngmtPage2"
          },
          {
            title: "第三页",
            index: 3,
            menuKey: "DocCmHlthMngmtPage3"
          }
          ],
          maxActive: 2,
          dataYear: "twentySeventeen"
        }
      }
    },
    //肺结核患者健康管理
    // 肺结核患者第一次入户随访记录表1
    DocFlpTbclssFirst: {
      title: "肺结核患者第一次入户随访记录表",
      tableName: "DocFlpTbclssFirst",
      data: {
        twentySeventeen: {
          component: "DocFlpTbclssFirstPage",
          pageList: [{
            title: "肺结核患者第一次入户随访记录表",
            index: 1,
            menuKey: "DocFlpTbclssFirstPage"
          }],
          maxActive: 1,
          dataYear: "twentySeventeen"
        }
      }
    },
    // 肺结核患者入户随访记录表1
    DocFlpTbclssFollow: {
      title: "肺结核患者入户随访记录表",
      tableName: "DocFlpTbclssFollow",
      data: {
        twentySeventeen: {
          component: "DocFlpTbclssFollowPage",
          pageList: [{
            title: "肺结核患者入户随访记录表",
            index: 1,
            menuKey: "DocFlpTbclssFollowPage"
          }],
          maxActive: 1,
          dataYear: "twentySeventeen"
        }
      }

    },
    // 严重精神障碍管理
    // 严重精神障碍患者随访服务记录表
    DocFlpMental: {
      title: "严重精神障碍患者随访服务记录表",
      tableName: "DocFlpMental",
      data: {
        twentySeventeen: {
          component: "DocFlpMentalFollowPage",
          pageList: [{
            title: "严重精神障碍患者随访服务记录表",
            index: 1,
            menuKey: "DocFlpMentalFollowPage"
          }],
          maxActive: 1,
          dataYear: "twentySeventeen"
        }
      }
    },
    // 严重精神障碍患者个人信息补充表
    DocMentalAdd: {
      title: "严重精神障碍患者个人信息补充表",
      tableName: "DocFlpMentalPersonal",
      data: {
        twentySeventeen: {
          component: "DocFlpMentalPersonalpage",
          pageList: [{
            title: "严重精神障碍患者个人信息补充表",
            index: 1,
            menuKey: "DocFlpMentalPersonalpage"
          }],
          maxActive: 1,
          dataYear: "twentySeventeen"
        }
      }
    },
    // 家庭医生签约管理
    DocSign: {
      title: "家庭医生签约管理",
      tableName: "DocSign",
      data: {
        twentySeventeen: {
          component: "DocSignpage",
          pageList: [{
            title: "家庭医生签约管理",
            index: 1,
            menuKey: "DocSignpage"
          }],
          maxActive: 1,
          dataYear: "twentySeventeen"
        }
      }
    },


    //家庭档案
    FamilyFile: {
      title: "家庭档案",
      tableName: "FamilyFile",
      data: {
        twentySeventeen: {
          component: "FamilyFilePage",
          pageList: [{
            title: "家庭档案",
            index: 1,
            menuKey: "FamilyFilePage"
          }],
          maxActive: 1,
          dataYear: "twentySeventeen"
        }
      }
    },
    // 组件抽离
    ComponentExtraction: {
      title: "组件抽离",
      tableName: "ComponentExtraction",
      data: {
        twentySeventeen: {
          component: "ComponentExtraction",
          pageList: [{
            title: "组件抽离",
            index: 1,
            menuKey: "ComponentExtraction"
          }],
          maxActive: 1,
          dataYear: "twentySeventeen"
        }
      }
    }
  }
}
