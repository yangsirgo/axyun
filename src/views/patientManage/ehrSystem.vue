<template>
  <div ref="page" id="main">
    <top :patientInfo="JSON.stringify(patientInfo)"></top>
    <div class="bottom">
      <el-row :gutter="6">
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="titleBefore"></span>
              <span class="title">现病史</span>
              <div class="fr">
                <el-button icon="el-icon-refresh-right"></el-button>
                <el-button icon="el-icon-circle-plus-outline"></el-button>
                <el-button icon="el-icon-more"></el-button>
              </div>
            </div>
            <div v-for="(item, i) in medicalHistory" :key="i">
              <div class="item-title">{{item.title}}</div>
              <div class="item-text">{{item.text}}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="titleBefore"></span>
              <span class="title">慢病史</span>
              <div class="fr">
                <el-button icon="el-icon-refresh-right"></el-button>
                <el-button icon="el-icon-circle-plus-outline"></el-button>
                <el-button icon="el-icon-more"></el-button>
              </div>
            </div>
            <el-table
              ref="tableElem"
              :data="tableData_h"
              border
              tooltip-effect="dark"
              style="width: 100%;"
              height="160"
            >
              <el-table-column
                v-for="(item, index) in tableColumn_h"
                :prop="item.prop"
                :key="index"
                :label="item.label"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <template  v-if="item.prop === 'seeInfo'">
                    <span>{{scope.row[item.prop]}}</span>&nbsp;&nbsp;
                    <el-button type="text" size="small">随诊</el-button>
                  </template>
                  <span v-else>{{scope.row[item.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="titleBefore"></span>
              <span class="title">过敏史</span>
              <el-checkbox v-model="checked" class="margin-left-20">仅看有效</el-checkbox>
              <div class="fr">
                <el-button icon="el-icon-refresh-right"></el-button>
                <el-button icon="el-icon-circle-plus-outline"></el-button>
                <el-button icon="el-icon-more"></el-button>
              </div>
            </div>
            <el-table
              ref="tableElem"
              :data="tableData_g"
              border
              tooltip-effect="dark"
              style="width: 100%;"
              height="160"
            >
              <el-table-column
                v-for="(item, index) in tableColumn_g"
                :prop="item.prop"
                :key="index"
                :label="item.label"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="6">
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="titleBefore"></span>
              <span class="title">手术史</span>
              <div class="fr">
                <el-button icon="el-icon-refresh-right"></el-button>
                <el-button icon="el-icon-circle-plus-outline"></el-button>
                <el-button icon="el-icon-more"></el-button>
              </div>
            </div>
            <el-table
              ref="tableElem"
              :data="tableData_s"
              border
              tooltip-effect="dark"
              style="width: 100%;"
              height="160"
            >
              <el-table-column
                v-for="(item, index) in tableColumn_s"
                :prop="item.prop"
                :key="index"
                :label="item.label"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="titleBefore"></span>
              <span class="title">医技报告</span>
              <el-select v-model="valueY" placeholder="请选择" class="margin-left-20" style="width: 160px">
                <el-option
                  v-for="item in optionsY"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="valueN" placeholder="请选择"  class="margin-left-20" style="width: 50px">
                <el-option
                  v-for="item in optionsN"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="fr">
                <el-button icon="el-icon-refresh-right"></el-button>
                <el-button icon="el-icon-circle-plus-outline"></el-button>
                <el-button icon="el-icon-more"></el-button>
              </div>
            </div>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-date-picker
                  v-model="value1"
                  type="daterange"
                  style="margin-bottom: 10px; width: 100%"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
                <el-timeline>
                  <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.timestamp">
                    {{activity.content}}
                  </el-timeline-item>
                </el-timeline>
              </el-col>
              <el-col :span="12">
                <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568041431411&di=8f83eba4a16482a387a5e192ecc4af60&imgtype=0&src=http%3A%2F%2F1812.img.pp.sohu.com.cn%2Fimages%2Fblog%2F2012%2F6%2F10%2F0%2F3%2Fu94430753_138944cdb42g215.jpg" style="width: 100%;height: 100%" alt="">
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="titleBefore"></span>
              <span class="title">诊断记录</span>
              <div class="fr">
                <el-button icon="el-icon-refresh-right"></el-button>
                <el-button icon="el-icon-circle-plus-outline"></el-button>
                <el-button icon="el-icon-more"></el-button>
              </div>
            </div>
            <el-table
              ref="tableElem"
              :data="tableData_z"
              border
              tooltip-effect="dark"
              style="width: 100%;"
              height="160"
            >
              <el-table-column
                v-for="(item, index) in tableColumn_z"
                :prop="item.prop"
                :key="index"
                :label="item.label"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="6">
        <el-col :span="16">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="titleBefore"></span>
              <span class="title">用药与治疗记录</span>
              <el-select v-model="valueY" placeholder="请选择" class="margin-left-20" style="width: 160px">
                <el-option
                  v-for="item in optionsY"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="valueZ" placeholder="请选择" class="margin-left-20" style="width: 160px">
                <el-option
                  v-for="item in optionsZ"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="fr">
                <el-button icon="el-icon-refresh-right"></el-button>
                <el-button icon="el-icon-circle-plus-outline"></el-button>
                <el-button icon="el-icon-more"></el-button>
              </div>
            </div>
            <el-table
              ref="tableElem"
              :data="tableData_y"
              border
              tooltip-effect="dark"
              style="width: 100%;"
              height="160"
            >
              <el-table-column
                v-for="(item, index)  in tableColumn_y"
                :prop="item.prop"
                :key="index"
                :label="item.label"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="titleBefore"></span>
              <span class="title">疾病上报记录</span>
              <div class="fr">
                <el-button icon="el-icon-refresh-right"></el-button>
                <el-button icon="el-icon-circle-plus-outline"></el-button>
                <el-button icon="el-icon-more"></el-button>
              </div>
            </div>
            <el-table
              ref="tableElem"
              :data="tableData_j"
              border
              tooltip-effect="dark"
              style="width: 100%;"
              height="160"
            >
              <el-table-column
                v-for="(item, index) in tableColumn_j"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import top from './components/patientInfo.vue'
  import timeLine from './components/timeLine.vue'

  export default {
    name: "ehrSystem",
    data() {
      return {
        value1 : '',
        optionsY: [{
          value: '0',
          label: '上海复旦医院'
        }],
        valueY: '0',
        optionsN: [{
          value: '0',
          label: '检查'
        }],
        valueN: '0',
        valueZ: '0',
        optionsZ: [{
          value: '0',
          label: '临时医嘱'
        }],
        patientInfo : {
          patientName : '张大伟',
          patientAge : 31,
          patientGender : '男',
          birthDate : '1987-05-06',
          phone : '189021793763',
          identityNum : '13068719586245',
          townType : '天津市红桥区',
          empiId : '459872121212@163.com',
          nativePlace : '上海市外滩'
        },
        checked : false,
        activities : [{
          content : '头部 CT (CR/DR)',
          timestamp : '2019-06-10'
        },{
          content : '头部 CT (CR/DR)',
          timestamp : '2019-06-11'
        }],
        medicalHistory: [{
          title: '上海复旦医院（2019-09-11）',
          text: '既往否认“糖尿病”等慢性病史，否认“伤寒”、“结核”等病史及其密切接触史，无手术、外伤史，无输血史，无食物及药物过敏史，预防接种史按计划进行。'
        }, {
          title: '上海东华医院（2019-09-11）',
          text: '既往因右输尿管上段结石行右侧经皮肾镜钬激光碎石术，因左肾结石行左侧输尿管軟镜镜检钬激光碎石术。'
        }],
        tableColumn_h: [{
          prop: 'institution',
          label: '医疗机构',
        }, {
          prop: 'errorInfo',
          label: '慢病信息',
        }, {
          prop: 'seeInfo',
          label: '随访信息',
        }],
        tableColumn_g: [{
          prop: 'institution',
          label: '医疗机构',
        }, {
          prop: 'state',
          label: '状态',
        }, {
          prop: 'type',
          label: '过敏类型',
        }, {
          prop: 'origin',
          label: '过敏原',
        }, {
          prop: 'descriptions',
          label: '症状描述',
        }, {
          prop: 'remarks',
          label: '备注',
        }, {
          prop: 'origin_',
          label: '来源',
        }],
        tableColumn_y: [{
          prop: 'institution',
          label: '机构',
        }, {
          prop: 'type',
          label: '医嘱类型',
        }, {
          prop: 'time',
          label: '时间',
        },   {
          prop: 'type_',
          label: '类型',
        },{
          prop: 'proItem',
          label: '项目名称',
        }, {
          prop: 'spec',
          label: '规格',
        }, {
          prop: 'rate',
          label: '频次',
        }, {
          prop: 'use',
          label: '用法',
        }],
        tableColumn_s: [{
          prop: 'institution',
          label: '机构',
        }, {
          prop: 'time',
          label: '时间',
        }, {
          prop: 'name',
          label: '手术名',
        }, {
          prop: 'pies',
          label: '切口',
        }],
        tableColumn_j : [{
          prop: 'institution',
          label: '机构',
        }, {
          prop: 'time',
          label: '时间',
        }, {
          prop: 'type',
          label: '类型',
        }, {
          prop: 'info',
          label: '上报信息',
        }, {
          prop: 'state',
          label: '状态',
        }],
        tableColumn_z : [{
          prop: 'institution',
          label: '机构',
        }, {
          prop: 'time',
          label: '时间',
        }, {
          prop: 'type',
          label: '诊断类型',
        }, {
          prop: 'name',
          label: '诊断名称',
        }],
        tableData_y: [{
          institution: '上海复旦医院',
          time: '2019-02-21',
          type: '临嘱',
          proItem: '阿莫西林',
          spec : '2g',
          rate : 'QN',
          type_ : '西药',
          use : '静脉注射'
        }],
        tableData_j : [{
          institution: '上海复旦医院',
          time: '2019-02-21',
          type: '传染病上报',
          info : '乙肝',
          state : '已审核',
        }],
        tableData_z: [{
          institution: '上海复旦医院',
          time: '2019-02-21',
          type: '入院诊断',
          name: '肾结石'
        }],
        tableData_g : [{
          institution: '上海复旦医院',
          errorInfo: '',
          origin_: '手工登记',
          remarks: '',
          origin: '头孢',
          type: '药物',
          state: '有效',
          descriptions : '红肿、痒痛'
        },{
          institution: '上海复旦医院',
          errorInfo: '',
          origin_: '手工登记',
          remarks: '',
          origin: '头孢',
          type: '药物',
          state: '有效',
          descriptions : '红肿、痒痛'
        }],
        tableData_s: [{
          institution: '上海复旦医院',
          time: '2019-09-18',
          name: '癌症切口',
          pies : '一类切口'
        }],
        tableData_h: [{
          institution: '上海复旦医院',
          errorInfo: '高血压',
          // empty : '随访',
          seeInfo: '07-06 08-06'
        }]
      };
    },
    components: {
      top,timeLine
    },

  };
</script>

<style lang="scss" scoped>
  /deep/.el-row {
    margin-bottom: 6px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  /deep/.bottom {
    margin-top: 6px;
    height: calc(100% - 107px);
  }
  .box-card {
    height: 242px
  }

  .box-card  {
    position: relative;
    text-align: left;

    .titleBefore {
      vertical-align: middle;
      margin-right: 5px;
      height: 20px;
      background: $l-color-primary;
      display: inline-block;
      width: 4px;
      margin-left: 15px;
    }

    .title {
      font-size: 16px;
      
      font-weight: 500;
      color: rgba(46, 50, 58, 1);
      vertical-align: -2px;
    }

    /deep/.el-button {
      border: 0;
    }
    /deep/.el-button--default {
      padding: 0 !important;
      font-size: 18px;
      width: 36px;
    }
    /deep/.el-button+.el-button {
      margin: 0 !important;
    }
    .item-title {
      font-size: 16px;
      font-weight: bold;
      line-height: 46px;
    }
    .item-text {
      line-height: 1.4;
    }
    /deep/.el-card__body {
      padding: 12px;
    }
    .item-text {
      font-size: 12px;
    }
  }

  /deep/.el-card__header {
    padding: 0 !important;

  }
  .clearfix {
    line-height: 50px;
  }
</style>
