<template>
  <div class="critical">
    <div class="allergy-list">
      <l-card-title>
        <div slot="left" class="patient-info">我的相关会诊信息</div>
      </l-card-title>
      <div class="patient-tree" v-loading="loading">
        <el-menu
          :default-openeds="['0', '0-0']"
          default-active="0-0-0"
          :unique-opened="true"
          class="el-menu-vertical-demo type-list-menu"
        >
          <el-submenu v-for="(tab, index) in list" :index="'' + index" :key="index">
            <template slot="title">
              <i class="filter-item iconfont icondaohangxialajiantou"></i>
              <span>{{ tab.title }}</span>
              <span class="type-menu-num" v-if="tab.num >= 0">
                {{
                tab.num
                }}
              </span>
            </template>
            <el-submenu
              v-for="(item, index2) in tab.children"
              :index="`${index}-${index2}`"
              :key="index2"
            >
              <template slot="title">
                <i class="filter-item iconfont icondaohangxialajiantou"></i>
                <span>{{ item.title }}</span>
                <span class="type-menu-num" v-if="item.num >= 0">
                  {{
                  item.num
                  }}
                </span>
              </template>
              <el-menu-item
                v-for="(it, index3) in item.children"
                :key="it.id"
                :index="`${index}-${index2}-${index3}`"
                @click="$emit('send-id', item.id)"
                :title="`${it.name}-${it.bing}-${it.date}`"
              >{{ `${it.name}-${it.bing}-${it.date}` }}</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="allergy-form">
      <div class="allergy-form-scroll">
        <l-card-title>
          <div slot="left" class="report-cont-title">患者信息</div>
        </l-card-title>
        <div class="patient-info">
          <div class="patient-item">
            <span>门诊号</span>
            <em>{{ receivePatientData.visitCode }}</em>
          </div>
          <div class="patient-item">
            <span>患者</span>
            <em>
              {{ receivePatientData.patientName }}
              <em
                v-codeTransform
                code="GENDER_CODE"
                :val="receivePatientData.patientGender"
              ></em>
              <em v-if="receivePatientData.age">{{ receivePatientData.age }}岁</em>
              <em v-else-if="receivePatientData.patientAge">
                {{
                receivePatientData.patientAge
                }}
              </em>
            </em>
          </div>
          <div class="patient-item">
            <span>床号</span>
            <em>{{ receivePatientData.bedNum || '--' }}</em>
          </div>
          <div class="patient-item">
            <span>当前科室</span>
            <em>{{ role.deptName || '--' }}</em>
          </div>
          <div class="patient-item">
            <span>主诊断</span>
            <em>{{ receivePatientData.diagName || '--' }}</em>
          </div>
        </div>
        <l-card-title>
          <div slot="left" class="report-cont-title">会诊信息</div>
        </l-card-title>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="consulatation-ruleForm">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="type">
                <LFormtTitle label="会诊类型" :required="true">
                  <el-select v-model="ruleForm.type" placeholder="请选择">
                    <el-option
                      v-for="item in typeSel"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="range">
                <LFormtTitle label="会诊范围" :required="true">
                  <el-select v-model="ruleForm.range" placeholder="请选择">
                    <el-option
                      v-for="item in typeSel"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </LFormtTitle>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="date">
                <LFormtTitle label="会诊时间" :required="true">
                  <el-date-picker v-model="ruleForm.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="place">
                <LFormtTitle label="会诊地点" :required="true">
                  <el-input v-model="ruleForm.place" placeholder="请输入内容"></el-input>
                </LFormtTitle>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="report-sub-title">会诊科室及医生</div>
          <el-table :data="tableData" border stripe style="margin-bottom: 2px;">
            <el-table-column
              v-for="(item, index) in tableParams"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              header-align="center"
              :align="item.align || 'left'"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item>
                <l-formt-title label="会诊科室" :required="true">
                  <el-select v-model="conChooseData.dep" placeholder="请选择">
                    <el-option
                      v-for="item in options1"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-form-item>

              <!-- <l-value-domain></l-value-domain> -->
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <l-formt-title label="会诊医生" :required="true">
                  <el-select v-model="conChooseData.doctor" placeholder="请选择">
                    <el-option
                      v-for="item in options2"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-form-item>

              <!-- <l-value-domain></l-value-domain> -->
            </el-col>
          </el-row>
          <div class="doctor-add-box">
            <el-button class="float-right" type="primary" @click="addConTable">添加</el-button>
            <el-row>
              <el-form-item>
                <l-formt-title label="备注">
                  <el-input v-model="conChooseData.remark" placeholder="请输入内容"></el-input>
                </l-formt-title>
              </el-form-item>
            </el-row>
          </div>
          <div class="report-sub-title">简要病情</div>
          <el-form-item prop="condition">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              placeholder="请输入患者简要病情"
              v-model="ruleForm.condition"
            ></el-input>
          </el-form-item>
          <div class="report-sub-title">会诊目的</div>
          <el-form-item prop="purpose">
            <el-input
              type="textarea"
              :rows="2"
              resize="none"
              placeholder="请输入患者会诊目的"
              v-model="ruleForm.purpose"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="allergy-form-btn">
        <el-button type="primary" plain>取消申请</el-button>
        <el-button type="primary" plain>提交</el-button>
        <el-button type="primary">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      // 列表loading
      loading: false,
      list: [
        {
          title: "我申请的会诊",
          children: [
            {
              title: "消化内科",
              children: [
                {
                  id: "1",
                  name: "张家俊",
                  bing: "急性肠胃炎",
                  date: "09-18",
                },
                {
                  id: "2",
                  name: "林俊",
                  bing: "急性肠胃炎",
                  date: "09-18",
                },
              ],
            },
          ],
        },
        {
          title: "我参与的会诊",
          children: [
            {
              title: "泌尿外科",
              children: [
                {
                  id: "3",
                  name: "王丽",
                  bing: "上呼吸道感染",
                  date: "09-19",
                },
              ],
            },
          ],
        },
      ],
      // 会诊信息、简要病情、会诊目的
      ruleForm: {
        date: "",
        type: "",
        range: "",
        place: "",
        condition: "",
        purpose: "",
      },
      // 会诊信息、简要病情、会诊目的-校验规则
      rules: {
        type: [],
        range: [],
        date: [],
      },
      tableParams: [
        {
          prop: "depName",
          label: "会诊科室",
        },
        {
          prop: "doctorName",
          label: "会诊医生",
        },
        {
          prop: "remark",
          label: "备注",
        },
      ],
      // 会诊科室及医生
      tableData: [],
      typeSel: [],
      // 科室下拉
      options1: [
        {
          label: "泌尿科",
          id: "1",
        },
      ],
      // 医生下拉（跟科室级联）
      options2: [
        {
          label: "张国涛",
          id: "1",
        },
      ],
      // 添加会诊科室及医生
      conChooseData: {
        dep: "",
        doctor: "",
        remark: "",
      },
    };
  },
  computed: {
    ...mapGetters("base", ["receivePatientData"]),
    ...mapGetters("user", ["name", "role"]),
  },
  methods: {
    addConTable() {
      if (this.conChooseData.doctor === "") {
        this.$message.warning("请选择要添加的医生!");
        return;
      }
      // 判断医生是否重复添加
      const hasData = this.tableData.some((item) => {
        return item.doctor === this.conChooseData.doctor;
      });
      if (hasData) {
        this.$message.warning("已添加此医生!");
        return;
      }
      let depName, doctorName;
      for (let i = 0; i < this.options1.length; i++) {
        const item = this.options1[i];
        if (item.id === this.conChooseData.dep) {
          depName = item.label;
          break;
        }
      }
      for (let i = 0; i < this.options2.length; i++) {
        const item = this.options2[i];
        if (item.id === this.conChooseData.doctor) {
          doctorName = item.label;
          break;
        }
      }
      this.tableData.push({
        ...this.conChooseData,
        depName,
        doctorName,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.critical {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $l-color-white;
  .link-word {
    color: $l-color-fontcolor-2;
  }
  .his-red {
    color: $l-color-fontcolor-5;
  }
}
.content {
  overflow-y: auto;
}
.allergy-list {
  position: relative;
  width: 287px;
  height: 100%;
  padding: 16px;
  float: left;
  display: flex;
  flex-direction: column;
  border-right: 1px solid $l-color-bgcolor-11;
  .patient-tree {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    margin-top: 8px;
  }
  /deep/ .el-submenu__title {
    position: relative;
    height: 44px;
    line-height: 44px;
    margin-bottom: 1px;
  }
  .type-menu-num {
    position: absolute;
    right: 8px;
    top: 50%;
    width: 18px;
    height: 18px;
    line-height: 18px;
    margin-top: -9px;
    border-radius: 50%;
    background-color: $l-color-primary;
    color: $l-color-white;
    text-align: center;
  }
}
.type-list-menu {
  border-right: 0;
  /deep/ .el-submenu__title {
    background-color: $l-color-bgcolor-14;
    .el-submenu__icon-arrow {
      display: none;
    }
    .type-menu-num {
      margin-left: 10px;
    }
  }
  /deep/ .el-submenu {
    margin-bottom: 1px;
    .iconfont {
      display: inline-block;
      font-size: 12px;
      color: $l-color-fontcolor-3;
    }
    &.is-opened > .el-submenu__title {
      .iconfont {
        transform: rotate(90deg);
      }
      span {
        font-weight: $l-font-weight;
      }
    }
  }
  /deep/ .el-menu-item {
    height: 44px;
    line-height: 44px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  /deep/ .el-menu-item.is-active {
    background-color: $l-color-bgcolor-12;
  }
  /deep/ .el-badge__content.is-fixed.is-dot {
    top: 10px;
  }
}
.allergy-form {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 287px;
  padding: 16px;
  /deep/ .cardtitle {
    margin-bottom: 8px;
    background: transparent;
    overflow: hidden;
    .report-cont-title {
      font-weight: bold;
    }
  }
  .allergy-form-scroll {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
  }
  .bdrtop {
    border-top: 1px solid $l-color-bgcolor-11;
    margin: 20px 0;
  }
  .allergy-form-col {
    .allergy-form-item {
      float: left;
      width: 49%;

      &:first-child {
        margin-right: 2%;
      }

      &.long {
        width: 100%;
        margin-right: 0;
      }
    }
  }

  /deep/ .allergy-date {
    .el-input__inner {
      padding-left: 30px;
    }
  }

  .allergy-form-title {
    display: inline-block;
    margin-right: 10px;
    color: $l-color-fontcolor-4;
  }
  .patient-info {
    .patient-item {
      display: inline-flex;
      margin-right: 30px;
      margin-bottom: 8px;
      &:last-child {
        margin-right: 0;
      }
      span {
        color: $l-color-fontcolor-4;
        margin-right: 8px;
      }
      em {
        font-style: normal;
        color: $l-color-fontcolor-3;
        &.link-word {
          color: $l-color-fontcolor-2;
          font-weight: bold;
        }
      }
    }
  }
  .allergy-form-title {
    display: inline-block;
    margin-right: 10px;
    color: $l-color-fontcolor-4;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  /deep/ .item-box {
    font-size: 0;
    .el-form-item {
      display: inline-block;
      width: 170px;
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .ana-add {
    height: 14px;
    line-height: 14px;
    padding: 0;
    border: 0;
    background-color: transparent;
    outline: medium;
    vertical-align: top;
    font-size: 14px;
    cursor: pointer;
    .iconfont {
      margin-right: 10px;
      font-size: 14px;
    }
  }
  .allergy-form-btn {
    padding-top: 16px;
    border-top: 1px solid $l-color-bgcolor-11;
    text-align: right;
    font-size: 0;
  }
  .doctor-add-box {
    .el-row {
      margin-right: 90px !important;
    }
  }
  .report-sub-title {
    padding-top: 6px;
    padding-bottom: 8px;
    color: $l-color-fontcolor-3;
    font-size: $l-font-size;
    font-weight: bold;
  }
}
</style>
