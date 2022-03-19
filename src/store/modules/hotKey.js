const state = {
  /**
   * 快捷键列表
   * @param {String} func //调用的功能(func_add1:新增1; func_add2:新增2)
   * @param {Object} keyCode // key对应键盘的keyCode，value对应按键的值
   * @param {Boolean} ctrlKey // 是否按下了ctrl键，true为按下
   * @param {Boolean} shiftKey // 是否按下了shift键，true为按下
   * @param {Boolean} altKey // 是否按下了alt键，true为按下
   */
  hotKeyList: [{
      func: 'func_add1',
      remarks: '新增1',
      keyCode: {
        67: 'C'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_add2',
      remarks: '新增2',
      keyCode: {
        88: 'X'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_submit',
      remarks: '提交',
      keyCode: {
        83: 'S'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_delete',
      remarks: '删除',
      keyCode: {
        90: 'Z'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_grouping',
      remarks: '成组',
      keyCode: {
        71: 'G'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'cancel_grouping',
      remarks: '取消成组',
      keyCode: {
        71: 'G'
      },
      ctrlKey: true,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_print',
      remarks: '打印',
      keyCode: {
        80: 'P'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_save',
      remarks: '保存。处方录入、保存模板',
      keyCode: {
        86: 'V'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'table_choose',
      remarks: '选中表格某行',
      keyCode: {
        49: 1,
        50: 2,
        51: 3,
        52: 4,
        53: 5,
        54: 6,
        55: 7,
        56: 8,
        57: 9,
        97: 1,
        98: 2,
        99: 3,
        100: 4,
        101: 5,
        102: 6,
        103: 7,
        104: 8,
        105: 9
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'table_row',
      remarks: '表格选中上移动',
      keyCode: {
        38: 'Up',
        40: 'Down'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'table_checkbox',
      remarks: '表格checkbox选中或取消',
      keyCode: {
        32: 'Space'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: false
    },
    {
      func: 'func_stop',
      remarks: '停止',
      keyCode: {
        84: 'T'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_all_stop',
      remarks: '全部停止',
      keyCode: {
        84: 'T'
      },
      ctrlKey: true,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_cancel',
      remarks: '撤销',
      keyCode: {
        74: 'J'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_copy_long',
      remarks: '复制到长期',
      keyCode: {
        76: 'L'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_copy_short',
      remarks: '复制到短期',
      keyCode: {
        75: 'K'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_garton_short',
      remarks: '加顿到短期',
      keyCode: {
        72: 'H'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_garton_discharged',
      remarks: '加顿到出院带药',
      keyCode: {
        87: 'W'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    },
    {
      func: 'func_obsolete',
      remarks: '作废',
      keyCode: {
        68: 'D'
      },
      ctrlKey: false,
      shiftKey: false,
      altKey: true
    }
  ]
};

const mutations = {
  SET_LIST: (state, data) => {
    state.hotKeyList = data;
  }
};

const actions = {
  changeList({
    commit
  }, data) {
    commit('SET_LIST', data);
  }
};

const getters = {
  hotKeyList: state => state.hotKeyList
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
