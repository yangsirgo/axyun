/*
默认配置项
*/
/* eslint-disable */
(function() {
  /**
   * 编辑器资源文件根路径。它所表示的含义是：以编辑器实例化页面为当前路径，指向编辑器资源文件（即dialog等文件夹）的路径。
   * 鉴于很多同学在使用编辑器的时候出现的种种路径问题，此处强烈建议大家使用"相对于网站根目录的相对路径"进行配置。
   * "相对于网站根目录的相对路径"也就是以斜杠开头的形如"/myProject/axeditor/"这样的路径。
   * 如果站点中有多个不在同一层级的页面需要实例化编辑器，且引用了同一axeditor的时候，此处的URL可能不适用于每个页面的编辑器。
   * 因此，axeditor提供了针对不同页面的编辑器可单独配置的根路径，具体来说，在需要实例化编辑器的页面最顶部写上如下代码即可。当然，需要令此处的URL等于对应的配置。
   * window.AXEDITOR_HOME_URL = "/xxxx/xxxx/"
   */
  window.AXEDITOR_HOME_URL = window.AXEDITOR_HOME_URL || "./axEditor/";
  var URL = window.AXEDITOR_HOME_URL || getUEBasePath();

  /**
   * 配置项主体。注意，此处所有涉及到路径的配置别遗漏URL变量。
   */
  window.AXEDITOR_CONFIG = {
    $: null,
    product: true, //正式版与测试版切换
    AXEDITOR_HOME_URL: URL, // 为编辑器实例添加一个路径，这个不能被注释
    serverUrl: "", // 服务器统一请求接口路径
    apiUrl: "", //弹窗中与业务交互的接口地址
    fileUrl: "http://192.168.198.131:8762", // 文件服务器接口
    // apiUrl: "http://192.168.198.250:8762", //弹窗中与业务交互的接口地址192.168.197.101:8762
    editorModel: "design",
    defaultModel: "design",
    confirmMsg: function() {console.warn("请自定义confirmMsg方法")},
    selectParagraphType: "", //当前选中选区的段落类型
    clickSignature: null, // 点击签名元素方法
    svgeditorMethod: null, // 矢量图编辑器触发方法
    saveImgLib: null, // 图片库保存方法
    saveMethod: null, // 保存病历方法
    submitMethod: null, // 提交病历方法
    recallMethod: null, // 撤回病历方法
    saveTemplMethod: null, // 存为模板方法
    prescriptionMethod: null, // 调用编辑处方方法
    refreshPrescriptionMethod: null, // 调用刷新处方方法
    diagnoseMethod: null, // 调用编辑诊断方法
    refreshDiagnoseMethod: null, // 调用刷新诊断方法
    refreshMacrosMethod: null, // 调用刷新基本元素方法
    synchronizeMethod: null, // 调用同步信息方法
    saveEleMethod: null, // 元素存库方法
    savePhraseMethod: null, // 保存片语方法
    showContinuePrint: null, // 显示续打窗口
    printMethod: null, // 保存片语方法
    printStatus: null, // 更新打印状态
    printResult: null, // 打印结果
    printWhiteCm: 0.45, // 打印预留边距，是由于打印机起墨位置不同
    savePdf: null, // 保存为pdf
    saveXml: null, // 保存为xml
    saveCda: null, // 保存为cda
    getServerDate: null, // 获取服务器时间接口
    getUUID: null, // 获取UUID接口
    setContentReady: null, // 文书内容修改回调方法
    clickElement: null, // 点击元素返回元素类型
    dateObj: {
      serverDate: "", // 编辑器初始化 服务器时间戳
      localDate: ""  // 编辑器初始化 本地时间戳
    },
    signatureType: "text", // 签章方式：text：文字签名；img：图片签名；key：电子签章签名
    signatureUrl: "http://192.168.0.1:8080/", // 图片签名时的图片地址
    // signatureName: '赵颖', // 文字签名时的姓名
    userInfo: {
      //json至少包含一下三项key，否则留痕记录信息会出现错误
      id: "10001",
      name: "张三1",
      priv: 1,
      token: "+cNGS4gWVKYdgecBLy7Bs5iYKaG8Fv0mqDuGCMaX1bwN9SzjmE97EaPkEYVQC52G9V7mxmaNlhb/LF7Hp4EJRwAHIZn1CRNQkWaQXy5Ui+/WSo0XAAfblR3oBUggNenzA1bNtKJUm16yz+/bnNVl5UekMyDAoAlfpuMnbK8QL4SOrfxENp3EtJ2IoRD5qwHkvJVwX2Q3slh8y7IWNs6hlUAkco3U7Dx3DXiElwtG3oVhDpQE/Rk4/gnvIHEURgfccUI3OzYXdi7PWURGPNbSryFRUHdQ+WtQjFzBUbCw1AXT4JDtdhsSIokrN5QOIueAVrwqO6Ak4kAkB95QXuuhDzm/SKouoZOsEnTe0oN7H4hsviF7yAfs64BWLClhtzBU+C7c8/hmiOd9yYHuWtZhHQ=="
    },
    sensitiveSetting: null, // 敏感词远程配置  
    readOnlyEditBtns: [
      "updatemacros",
      "structuretree",
      "structuretreeclick",
      "pure",
      "dirty",
      "secret",
      "setmodel",
      "recall",
      "print",
      "continueprint",
      "docontinueprint",
      "printpreview",
      "numcount",
      "resettabindex",
      "resetmarkflag",
      "papersize",
      "pagemargin",
      "paperscale",
      "recordinitcontent"
    ], //浏览模式下可用按钮列表
    maleSensitiveWords: [
      "射精",
      "阴茎",
      "睾丸",
      "包皮",
      "冠状沟",
      "附睾",
      "输精管",
      "前列腺"
    ], //男性体征
    femaleSensitiveWords: [
      "初潮",
      "经期",
      "月经",
      "绝经",
      "哺乳",
      "流产",
      "人流",
      "引产",
      "妊娠",
      "死胎",
      "分娩",
      "胎盘",
      "子宫",
      "卵巢",
      "输卵管",
      "阴道",
      "白带"
    ], //女性体征
    autoClearinitialContent: false, // 是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
    iframeJsUrl: "third-party/date/laydate/laydate.js?temp=" + new Date().getTime(), //给编辑区域的iframe引入一个js文件
    iframeCssUrl: "themes/default/css/ax.ctrl.css?temp=" + new Date().getTime(), //给编辑区域的iframe引入一个css文件
    jqJsUrl: "third-party/jquery-1.10.2.min.js",
    allowDivTransToP: false, // 允许进入编辑器的div标签自动变成p标签
    wordCount: false, // 关闭字数统计
    copySwitch: true, // 是否允许复制粘贴编辑器外的内容
    copyNumber: false, // 允许复制内容最大文本数
    elementPathEnabled: false, // 关闭elementPath
    imageScaleEnabled: true,
    imagePopup: true,
    focus: true,
    zIndex: 999,
    fixedWidth: true,  // fasle -> 编辑器内容区域自适应， true -> 编辑器内容区域根据选择的纸张大小居中显示
    // initialFrameWidth: 900,
    // initialFrameHeight: 624,
    autoHeightEnabled: false,
    autoFloatEnabled: false,
    saveInterval: 60000,
    enableAutoSave: false, // 关闭自动保存
    /* labelMap: {
      'text': '文本域',
      'select': '下拉域',
      'recortar': '剪切',
      'colar': '粘贴',
      'copiar': '复制',
      'upsize': '增大字体',
      'downsize': '缩小字体',
      'tablelowerframeline': '下框线',
      'tableupperframeline': '上框线',
      'tableleftframeline': '左框线',
      'tablerightframeline': '右框线',
      'tablenoborder': '无框线',
      'tableinternaltransverseline': '内部横线',
      'tableinternalverticalline': '内部竖线',
      'tableinsideborder': '内部框线',
      'tablelateralframeline': '外侧框线',
      'tableallframelines': '所有框线'
    }, */
    // 医学公式配置
    formulaList: {
      BMI: {
        name: "计算BMI",
        content: "体质指数(BMI) = 体重(kg)÷身高^2(m)",
        callback: function (me, dom){
          var wId = dom.getAttribute("w");
          var hId = dom.getAttribute("h");
          var targetId = dom.getAttribute("bmi");
          if (!me.document.getElementById(wId) || !me.document.getElementById(hId)) {
            return;
          }
          var w = axTools.getByClass("ctrl-value", me.document.getElementById(wId))[0].innerText;
          var h = axTools.getByClass("ctrl-value", me.document.getElementById(hId))[0].innerText;
          if(w == "" || h == ""){
            axTools.getByClass("ctrl-value", me.document.getElementById(targetId))[0].innerText = "";
            return
          };
          if(isNaN(w) || isNaN(h)) {
            axTools.getByClass("ctrl-value", me.document.getElementById(targetId))[0].innerText = "";
            return
          };
          var result = (w/Math.pow(h/100,2)).toFixed(2);
          axTools.getByClass("ctrl-value", me.document.getElementById(targetId))[0].innerText = result;
        }
      }
    },
    // 数字元素单位
    eleUnits: [
      {
        name: "年、月、日"
      },
      {
        name: "时、分、秒"
      },
      {
        name: "kg"
      },
      {
        name: "m"
      },
      {
        name: "km"
      }
    ],
    pagemargin: [
      {
        label: "窄：上1.27厘米,下1.27厘米,左1.27厘米,右1.27厘米",
        value: [1.27, 1.27, 1.27, 1.27]
      },
      {
        label: "常用：上1厘米,下1厘米,左3.18厘米,右3.18厘米",
        value: [1, 3.18, 1, 3.18]
      },
      {
        label: "普通：上2.54厘米,下2.54厘米,左3.18厘米,右3.18厘米",
        value: [2.54, 3.18, 2.54, 3.18]
      },
      {
        label: "适中：上2.54厘米,下2.54厘米,左1.91厘米,右1.91厘米",
        value: [2.54, 1.91, 2.54, 1.91]
      },
      {
        label: "宽：上2.54厘米,下2.54厘米,左5.08厘米,右5.08厘米",
        value: [2.54, 5.08, 2.54, 5.08]
      },
      {
        label: "自定义页边距",
        value: "custom"
      }
    ],
    papersize: [
      {
        label: "宽版 40cm × 100cm",
        value: [40, 50],
        name: "宽版"
      },
      {
        label: "横版 29.7cm × 21cm",
        value: [29.7, 21],
        name: "横版"
      },
      {
        label: "A4 21cm × 29.7cm",
        value: [21, 29.7],
        name: "A4"
      },
      {
        label: "A3 29.7cm × 42cm",
        value: [29.7, 42],
        name: "A3"
      },
      {
        label: "A5 14.8cm × 21cm",
        value: [14.8, 21],
        name: "A5"
      },
      {
        label: "B4 25.7cm x 36.4cm",
        value: [25.7, 36.4],
        name: "B4"
      },
      {
        label: "B5 18.2cm x 25.7cm",
        value: [18.2, 25.7],
        name: "B5"
      }
    ],
    paperscale: [
      {
        label: "x1",
        value: 1,
        name: "1倍"
      },
      {
        label: "x1.25",
        value: 1.25,
        name: "1.25倍"
      },
      {
        label: "x1.5",
        value: 1.5,
        name: "1.5倍"
      }
    ],
    //基本元素设置
    macrosData: [
      {
        groupName: "人员信息",
        groupItem: [
          {
            code: "username",
            text: "姓名",
            value: "张三"
          },
          {
            code: "sex",
            text: "性别",
            value: "男"
          },
          {
            code: "inHospitailNo",
            text: "住院号",
            value: "121"
          }
        ]
      },
      {
        groupName: "就诊信息",
        groupItem: [
          {
            code: "doctorNo",
            text: "医师号",
            value: "1212"
          }
        ]
      },
      {
        groupName: "就诊信息",
        groupItem: [
          {
            code: "signature",
            text: "医师签名",
            value: "我是医师"
          }
        ]
      }
    ],
    focusInEnd: false, //光标是否定位到尾部
    maxUndoCount: 2000000, //可以最多回退的次数
    showTabBar: true, //开启tab类型菜单
    activeTabNum: 1, //tab计数从1开始
    tabToolbars: [
      {
        id: "edit",
        name: "编辑",
        widgets: [
          [
            {
              id: "savexml",
              name: "保存xml"
            },
            {
              id: "openxml",
              name: "打开xml"
            },
            {
              id: "savepdf",
              name: "打开pdf"
            },
            {
              id: "save",
              name: "保存"
            },
            {
              id: "submit",
              name: "提交"
            },
            {
              id: "recall",
              name: "撤回"
            },
            {
              id: "savetempl",
              name: "另存为模板"
            },
            {
              id: "undo",
              name: "撤销"
            },
            {
              id: "redo",
              name: "恢复"
            },
            {
              id: "drafts",
              name: "草稿箱"
            }
          ],
          /* [{
              id: 'copy',
              name: '复制'
            },
            {
              id: 'cut',
              name: '剪切'
            },
            {
              id: 'paste',
              name: '粘贴'
            }
          ], */
          [
            {
              type: "select",
              iconOnly: true,
              id: "fontfamily",
              name: "字体格式"
            },
            {
              type: "select",
              iconOnly: true,
              id: "fontsize",
              name: "字号"
            },
            {
              iconOnly: true,
              hasBorder: true,
              id: "removeformat",
              name: "清除样式"
            },
            {
              iconOnly: true,
              hasBorder: true,
              id: "formatmatch",
              name: "格式刷"
            },
            {
              iconOnly: true,
              hasBorder: true,
              id: "autotypeset",
              name: "自动格式化"
            },
            {
              id: "breakLine"
            },
            {
              iconOnly: true,
              id: "sizeplus",
              name: "增大字号"
            },
            {
              iconOnly: true,
              id: "sizeminus",
              name: "缩小字号"
            },
            {
              iconOnly: true,
              id: "fontborder",
              name: "字体边框"
            },
            {
              iconOnly: true,
              id: "superscript",
              name: "上标"
            },
            {
              iconOnly: true,
              id: "subscript",
              name: "下标"
            },
            {
              iconOnly: true,
              id: "bold",
              name: "加粗"
            },
            {
              iconOnly: true,
              id: "italic",
              name: "倾斜"
            },
            {
              iconOnly: true,
              id: "underline",
              name: "下划线"
            },
            // {
            //   iconOnly: true,
            //   id: "strikethrough",
            //   name: "删除线"
            // },
            {
              iconOnly: true,
              id: "forecolor",
              name: "文字颜色"
            },
            {
              iconOnly: true,
              id: "backcolor",
              name: "背景颜色"
            }
          ],
          [
            {
              iconOnly: true,
              id: "justifyleft",
              name: "向左对齐"
            },
            {
              iconOnly: true,
              id: "justifycenter",
              name: "居中对齐"
            },
            {
              iconOnly: true,
              id: "justifyright",
              name: "向右对齐"
            },
            {
              iconOnly: true,
              id: "justifyjustify",
              name: "两端对齐"
            },
            /* {
              iconOnly: true,
              id: 'blockquote',
              name: '引用'
            }, */
            {
              iconOnly: true,
              id: "indent",
              name: "首行缩进"
            },
            {
              id: "breakLine"
            },
            {
              iconOnly: true,
              id: "insertorderedlist",
              name: "有序列表"
            },
            {
              iconOnly: true,
              id: "insertunorderedlist",
              name: "无序列表"
            },
            {
              iconOnly: true,
              id: "rowspacingtop",
              name: "段前距"
            },
            {
              iconOnly: true,
              id: "rowspacingbottom",
              name: "段后距"
            },
            {
              iconOnly: true,
              id: "lineheight",
              name: "行间距"
            }
          ]
          /* [{
            id: 'structureTree',
            name: '文档结构树'
          }], */
        ]
      },
      {
        id: "insert",
        name: "插入",
        widgets: [
          [
            {
              id: "spechars",
              name: "特殊字符"
            }
          ],
          [
            {
              id: "link",
              name: "添加链接"
            },
            {
              id: "unlink",
              name: "取消链接"
            }
          ],
          [
            {
              id: "insertimage",
              name: "图片"
            },
            {
              id: "insertvideo",
              name: "视频"
            },
            {
              id: "barcode",
              name: "条形码"
            },
            {
              id: "qrcode",
              name: "二维码"
            }
          ],
          /* [{
            id: 'insertcode',
            name: '代码'
          }], */
          [
            {
              id: "medical",
              name: "医学表达式"
            }
          ]
        ]
      },
      {
        id: "table",
        name: "表格",
        widgets: [
          [
            {
              id: "inserttable",
              name: "插入表格"
            },
            {
              id: "deletetable",
              name: "删除表格"
            }
          ],
          [
            {
              id: "insertrow",
              iconOnly: true,
              name: "插入行"
            },
            {
              id: "insertcol",
              iconOnly: true,
              name: "插入列"
            },
            {
              id: "breakLine"
            },
            {
              id: "deleterow",
              iconOnly: true,
              name: "删除行"
            },
            {
              id: "deletecol",
              iconOnly: true,
              name: "删除列"
            }
          ],
          [
            {
              iconOnly: true,
              id: "mergecells",
              name: "合并单元格"
            },
            {
              iconOnly: true,
              id: "mergedown",
              name: "向下合并单元格"
            },
            {
              iconOnly: true,
              id: "mergeright",
              name: "向右合并单元格"
            },
            {
              id: "breakLine"
            },
            {
              iconOnly: true,
              id: "splittocells",
              name: "拆分单元格"
            },
            {
              iconOnly: true,
              id: "splittocols",
              name: "单元格拆分成列"
            },
            {
              iconOnly: true,
              id: "splittorows",
              name: "单元格拆分成行"
            }
          ],
          [
            {
              iconOnly: true,
              id: "tablelowerframeline",
              name: "下框线"
            },
            {
              iconOnly: true,
              id: "tableupperframeline",
              name: "上框线"
            },
            {
              iconOnly: true,
              id: "tableleftframeline",
              name: "左框线"
            },
            {
              id: "breakLine"
            },
            {
              iconOnly: true,
              id: "tablerightframeline",
              name: "右框线"
            },
            {
              iconOnly: true,
              id: "tablenoborder",
              name: "无框线"
            },
            {
              iconOnly: true,
              id: "tableallborder",
              name: "全框线"
            }
          ],
          [
            {
              // iconOnly: true,
              id: "tb-hide",
              name: "隐藏表格线"
            },
            {
              // iconOnly: true,
              id: "tb-solid",
              name: "表格线设为实线"
            },
            {
              // iconOnly: true,
              id: "tb-dotted",
              name: "表格线设为虚线"
            }
          ]
        ]
      },
      {
        id: "structure",
        name: "结构化",
        widgets: [
          [
            /* {
              id: 'macro',
              name: '基本元素'
            },  */ {
              id: "text",
              name: "文本元素"
            },
            {
              id: "tagelement",
              name: "标签元素"
            },
            {
              id: "numberelement",
              name: "数字元素"
            },
            {
              id: "select",
              name: "单选下拉元素"
            },
            {
              id: "selectmulti",
              name: "多选下拉元素"
            },
            {
              id: "datedomain",
              name: "日期元素"
            },
            {
              id: "haveornot",
              name: "有无元素"
            }
          ],
          [
            {
              id: "radio",
              name: "单选元素"
            },
            {
              id: "checkbox",
              name: "复选元素"
            }
          ],
          [
            {
              id: "paragraphele",
              name: "段落元素"
            },
            {
              id: "parasetter",
              name: "段落设置"
            }
          ],
          [
            {
              id: "combine",
              name: "组合元素"
            }
          ],
          [
            {
              id: "diagnose",
              name: "诊断元素"
            },
            {
              id: "prescription",
              name: "处方元素"
            }
          ],
          [
            {
              id: "signature",
              name: "签名元素"
            }
          ]
        ]
      },
      {
        id: "viewcheck",
        name: "视图审阅",
        widgets: [
          [
            {
              id: "source",
              name: "源码模式"
            },
            {
              id: "mark",
              name: "留痕模式"
            },
            {
              id: "design",
              name: "设计模式"
            },
            {
              id: "edit",
              name: "书写模式"
            },
            {
              id: "pure",
              name: "清洁浏览"
            },
            {
              id: "dirty",
              name: "非清洁浏览"
            },
            {
              id: "secret",
              name: "保密浏览"
            }
          ],
          [
            {
              id: "note",
              name: "批注"
            }
          ]
        ]
      },
      {
        id: "tool",
        name: "工具",
        widgets: [
          [
            {
              id: "pagemargin",
              name: "页边距"
            } /* ,
            {
              id: 'paperdirect',
              name: '纸张方向'
            } */,
            {
              id: "papersize",
              name: "纸张大小"
            },
            {
              id: "paperscale",
              name: "页面缩放"
            },
            {
              id: "watermark",
              name: "水印"
            }
          ],
          [
            {
              id: "pageheader",
              name: "页眉"
            },
            {
              id: "pagefooter",
              name: "页脚"
            } /* ,
            {
              id: 'pages',
              name: '页码'
            } */
          ],
          [
            {
              id: "continueprint",
              name: "续打"
            },
            {
              id: "print",
              name: "打印文档"
            }
          ],
          [
            {
              id: "printpreview",
              name: "打印预览"
            }
          ],
          [
            {
              id: "searchreplace",
              name: "查找替换"
            }
          ],
          [
            {
              id: "numcount",
              name: "字数统计"
            }
          ],
          [
            {
              id: "synchronize",
              name: "同步信息"
            },
            {
              id: "refreshmacros",
              name: "刷新基本信息"
            } /*,{
            id: 'refreshdiagnose',
            name: '刷新诊断'
          },{
            id: 'refreshprescription',
            name: '刷新处方'
          }*/
          ],
          [
            {
              id: "hidemarktag",
              name: "清除留痕"
            }
          ],
          [
            {
              id: "editlock",
              name: "文书锁定"
            }
          ],
          [
            {
              id: "medicalformula",
              name: "医学公式"
            }
          ]
        ]
      }
    ],
    insertorderedlist: {
      decimal: "", //'1,2,3...'
      "lower-alpha": "", // 'a,b,c...'
      "lower-roman": "", //'i,ii,iii...'
      "upper-alpha": "", //'A,B,C'
      "upper-roman": "" //'I,II,III...'
    },
    insertunorderedlist: {
      circle: "", // '○ 小圆圈'
      disc: "", // '● 小圆点'
      square: "" //'■ 小方块'
    }
  };

  function getUEBasePath(docUrl, confUrl) {
    return getBasePath(
      docUrl || self.document.URL || self.location.href,
      confUrl || getConfigFilePath()
    );
  }

  function getConfigFilePath() {
    var configPath = document.getElementsByTagName("script");

    return configPath[configPath.length - 1].src;
  }

  function getBasePath(docUrl, confUrl) {
    var basePath = confUrl;

    if (/^(\/|\\\\)/.test(confUrl)) {
      basePath =
        /^.+?\w(\/|\\\\)/.exec(docUrl)[0] + confUrl.replace(/^(\/|\\\\)/, "");
    } else if (!/^[a-z]+:/i.test(confUrl)) {
      docUrl = docUrl
        .split("#")[0]
        .split("?")[0]
        .replace(/[^\\\/]+$/, "");

      basePath = docUrl + "" + confUrl;
    }

    return optimizationPath(basePath);
  }

  function optimizationPath(path) {
    var protocol = /^[a-z]+:\/\//.exec(path)[0],
      tmp = null,
      res = [];

    path = path
      .replace(protocol, "")
      .split("?")[0]
      .split("#")[0];

    path = path.replace(/\\/g, "/").split(/\//);

    path[path.length - 1] = "";

    while (path.length) {
      if ((tmp = path.shift()) === "..") {
        res.pop();
      } else if (tmp !== ".") {
        res.push(tmp);
      }
    }

    return protocol + res.join("/");
  }

  window.AX = {
    getUEBasePath: getUEBasePath
  };
})();
