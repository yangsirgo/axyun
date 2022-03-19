// 注：以下各模块快捷键列表key值均为“云医院功能点梳理(伍森)(1)(2) - 副本.xlsx”表格中各自模块的 “三级模块（Tab页）”列表的值
// 配置前请将下面各自快捷键列表的中文key值改为对应的英文key值

// 快捷键展示工具箱配置方法：
// 1.工具箱名称为：Hotkey   (请将该工具箱放在toolBoxs最后一项)
// 2.在l-layout里配置pageName,值为各自改好的key值，demo如下
// <l-layout
//     :toolBoxs="toolBoxs"
//     :defaultToolName="toolBoxs[0]"
//     :boxExpanded="true"
//     @message="messageHandler"
//     patientCardType="default"
//     pageName="test"           <<<<-----配置此项
// >

export default {
  test: [{
      fun: "提交检验申请",
      key: "Alt + S"
    },
    {
      fun: "存为检验申请模板",
      key: "Alt + C "
    },
    {
      fun: "打印检验申请单",
      key: "Alt + P "
    }
  ],
  appointment: [{
    fun: "(患者列表) 确认预约",
    key: "Alt + S"
  }],
  registration: [{
    fun: "确认挂号",
    key: "Alt + S"
  }],
  signTriage: [{
      fun: "确认",
      key: "Alt + S"
    },
    {
      fun: "取消",
      key: "Alt + Z"
    }
  ],
  referral: [{
      fun: "(列表视图)提交转诊",
      key: "Alt + C"
    },
    {
      fun: "(列表视图)新增转诊",
      key: "Alt + S"
    },
    {
      fun: "(列表视图)撤销转诊",
      key: "Alt + Z"
    }
  ],
  cis_order: [{
      fun: "新增处方",
      key: "Alt + C"
    },
    {
      fun: "新增明细",
      key: "Alt + X"
    },
    {
      fun: "提交",
      key: " Alt + S"
    },
    {
      fun: "删除",
      key: "Alt + Z"
    },
    {
      fun: "成组",
      key: "Alt + G"
    },
    {
      fun: "取消成组",
      key: "Ctrl + Alt  + G"
    },
    {
      fun: "打印",
      key: "Alt + P"
    },
    {
      fun: "保存",
      key: " Alt + V"
    }
  ],
  hos_order: [{
      fun: "新增",
      key: "Alt + C"
    },
    {
      fun: "提交",
      key: " Alt + S"
    },
    {
      fun: "停止",
      key: "Alt + T"
    },
    {
      fun: "全部停止",
      key: "Ctrl + Alt + T"
    },
    {
      fun: "撤销",
      key: "Alt + J"
    },
    {
      fun: "成组",
      key: "Alt + G"
    },
    {
      fun: "取消成组",
      key: "Ctrl + Alt  + G"
    },
    {
      fun: "复制到长期",
      key: "Alt  + L"
    },
    {
      fun: "复制到短期",
      key: "Alt  + K"
    },
    {
      fun: "加顿到短期",
      key: "Alt  + H"
    },
    {
      fun: "加顿到撤床带药 ",
      key: "Alt  + W"
    },
    {
      fun: "删除",
      key: "Alt + Z"
    },
    {
      fun: "作废",
      key: "Alt + D"
    },
    {
      fun: "打印",
      key: "Alt + P"
    },
    {
      fun: "保存",
      key: " Alt + V"
    }
  ],
  criticalValue: [{
    fun: "确定",
    key: "Alt + S"
  }],
  electronApply: [{
      fun: "提交申请",
      key: "Alt + S"
    },
    {
      fun: "保存为模板",
      key: "Alt + V "
    },
    {
      fun: "删除",
      key: "Alt + Z "
    },
    {
      fun: "打印",
      key: "Alt + P "
    }
  ],
  diagnosis: [{
      fun: "添加诊断（不同类型的）",
      key: "Alt + C"
    }, {
      fun: "存为模板",
      key: "Alt + X"
    },
    {
      fun: "删除诊断",
      key: "Alt + Z"
    },
    {
      fun: "确认登记",
      key: "Alt + S"
    },
    {
      fun: "保存（存为模板）",
      key: "Alt + V"
    }
  ],
  allergy: [{
    fun: "确认登记",
    key: "Alt + S "
  }],
  cisOutpCharge: [{
      fun: "收费",
      key: "Alt + S"
    },
    {
      fun: "清空",
      key: "Alt + Z"
    },
    {
      fun: "暂存",
      key: "Alt + X"
    }
  ],
  cisRetreat: [{
    fun: "确认退号",
    key: "Alt + S"
  }],
  cisReturnCharge: [{
    fun: "确认申请",
    key: "Alt + S"
  }],
  admApplication: [{
    fun: "提交",
    key: "Alt + S"
  }],
  admRegistration: [{
    fun: "完成登记",
    key: "Alt + S"
  }],
  arrangeBed: [{
    fun: "确认分配",
    key: "Alt + S"
  }],
  contractBed: [{
    fun: "确认包床",
    key: "Alt + S"
  }],
  changeBed: [{
    fun: "确认转床",
    key: "Alt + S"
  }],
  advExamine: [{
      fun: "医嘱审核通过",
      key: "Alt + S"
    }

  ],
  advEditing: [{
      fun: "新增护士医嘱",
      key: "Alt + C"
    },
    {
      fun: "暂存",
      key: "Alt + X"
    },
    {
      fun: "提交护士医嘱",
      key: "Alt + S"
    },
    {
      fun: "删除新增和暂存的护士医嘱",
      key: "Alt + Z"
    },
    {
      fun: "打印医嘱单",
      key: "Alt + P"
    }
  ],
  drugApply: [{
    fun: "药品申领",
    key: "Alt + S"
  }],
  drAdvExecute: [{
      fun: "输液执行",
      key: "Alt + S"
    },
    {
      fun: "肌肉注射执行",
      key: "Alt + S"
    },
    {
      fun: "非药品医嘱执行",
      key: "Alt + S"
    }

  ],
  drugPurchase: [{
      fun: "新建采购单",
      key: "Alt + C"
    },
    {
      fun: "新增药品",
      key: "Alt + X"
    },
    {
      fun: "删除明细	",
      key: "Alt + Z"
    },
    {
      fun: "保存",
      key: "Alt + V"
    },
    {
      fun: "提交",
      key: "Alt + S"
    },
    {
      fun: "打印",
      key: "Alt + P"
    }

  ],
  drugWarehousing: [{
      fun: "新建入库单",
      key: "Alt + C"
    },
    {
      fun: "新增药品",
      key: "Alt + X"
    },
    {
      fun: "删除明细",
      key: "Alt + Z"
    },
    {
      fun: "保存",
      key: "Alt + V"
    },
    {
      fun: "提交",
      key: "Alt + S"
    },
    {
      fun: "打印",
      key: "Alt + P"
    }
  ],
  drugOutStock: [{
      fun: "新建出库单",
      key: "Alt + C"
    },
    {
      fun: "新增药品",
      key: "Alt + X"
    },
    {
      fun: "删除明细	",
      key: "Alt + Z"
    },
    {
      fun: "保存",
      key: "Alt + V"
    },
    {
      fun: "提交",
      key: "Alt + S"
    },
    {
      fun: "打印",
      key: "Alt + P"
    }
  ],
  drugRenturn: [{
      fun: "新建退货单",
      key: "Alt + C"
    },
    {
      fun: "新增药品",
      key: "Alt + X"
    },
    {
      fun: "删除明细	",
      key: "Alt + Z"
    },
    {
      fun: "保存",
      key: "Alt + V"
    },
    {
      fun: "提交",
      key: "Alt + S"
    },
    {
      fun: "打印",
      key: "Alt + P"
    }
  ],
  drugReturnDispose: [{
      fun: "修改明细",
      key: "Alt + X"
    },
    {
      fun: "保存",
      key: "Alt + V"
    },
    {
      fun: "提交",
      key: "Alt + S"
    },
    {
      fun: "打印",
      key: "Alt + P"
    }
  ],
  adjustPrice: [{
      fun: "新建调价单",
      key: "Alt + C"
    },
    {
      fun: "新增药品",
      key: "Alt + X"
    },
    {
      fun: "删除明细	",
      key: "Alt + Z"
    },
    {
      fun: "保存",
      key: "Alt + V"
    },
    {
      fun: "提交",
      key: "Alt + S"
    },
    {
      fun: "打印",
      key: "Alt + P"
    }
  ],


  pharmacyAppliy: [{
      fun: "新增申请单",
      key: "Alt + C"
    },
    {
      fun: "新增药品",
      key: "Alt + X"
    },
    {
      fun: "删除明细	",
      key: "Alt + Z"
    },
    {
      fun: "保存",
      key: "Alt + V"
    },
    {
      fun: "提交",
      key: "Alt + S"
    },
    {
      fun: "打印",
      key: "Alt + P"
    }

  ],
  wareConfirm: [{
      fun: "确认入库",
      key: "Alt + S"
    },
    {
      fun: "打印",
      key: "Alt + P"
    }
  ],
  处方申请退药: [{
      fun: "确认退药",
      key: "Alt + S"
    },
    {
      fun: "处方打印",
      key: "Alt + P"
    }

  ],
  药品信息维护: [{
      fun: "新增药品",
      key: "Alt + C"
    },
    {
      fun: "保存药品信息",
      key: "Alt + S"
    }

  ],
  撤床: [{
    fun: "确认",
    key: "Alt + S"
  }],
  处方预配方: [{
    fun: "确认配药",
    key: "Alt + S"
  }],
  处方发药: [{
    fun: "确认发药",
    key: "Alt + S"
  }],
  docSubmit: [{
    fun: "提交",
    key: "Alt + S"
  }],
  inventoryTemplate: [{
      fun: '新增药品',
      key: "Alt + C"
    },
    {
      fun: '删除',
      key: "Alt + Z"
    },
    {
      fun: '保存',
      key: "Alt + V"
    }
  ],
  inventorySet: [{
      fun: '添加',
      key: "Alt + C"
    },
    {
      fun: '删除',
      key: "Alt + Z"
    }
  ],
  inventoryWindow: [{
    fun: '保存',
    key: "Alt + V"
  }],
  precheckTriage: [{
    fun: '完成预检',
    key: "Alt + S"
  }, {
    fun: '暂存',
    key: "Alt + V"
  }]
}
