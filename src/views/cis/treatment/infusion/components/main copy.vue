<template>
  <div class="infusion-main width100 height100">
    <div class="infusion-content width100 height-button-main">
      <el-steps :active="activeStep" align-center>
        <el-step
          v-for="(item, index) in stepList"
          :title="item"
          :key="index"
          :icon="index <= activeStep - 1 ? 'iconfont icon-dianziyizhujiaohu' : 'iconfont icon-dianziyizhujiaohu1'">
        </el-step>
      </el-steps>
      <l-card-title>
        <span slot="left">就诊信息</span>
      </l-card-title>
      <el-form ref="infusionForm" :model="infusionForm" :rules="rules">
        <el-row class="infusion-item" :gutter="20">
          <el-col :span="6">
            <l-formt-title label="诊断" :disabled="true">
              <el-input v-model="infusionForm.diagnosis" :disabled="true"></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="科室" :disabled="true">
              <el-input v-model="infusionForm.dept" :disabled="true"></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="医生" :disabled="true">
              <el-input v-model="infusionForm.doctor" :disabled="true"></el-input>
            </l-formt-title>
          </el-col>
          <el-col :span="6">
            <l-formt-title label="时间" :disabled="true">
              <el-input v-model="infusionForm.time" :disabled="true"></el-input>
            </l-formt-title>
          </el-col>
        </el-row>
        <l-card-title>
          <span slot="left">药品信息（共<span class="title-days">{{ days }}</span>天，已执行<span class="title-days-done">{{ doneDays }}</span>天）</span>
        </l-card-title>
        <table>
              <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
          <tr v-for="(item, index) in drugData" :key="index">
            <td v-for="(name, i) in drugProps" :key="i" class="drug-cell">{{ item[name] }}</td>
          </tr>
        </table>
        <l-card-title>
          <span slot="left">已执行记录</span>
        </l-card-title>
        <table>
              <!-- 修改质量管理的bug 无实际用处 START -->
              <caption></caption>
              <tr style="display:none">
                <th  scope="col"></th>
              </tr>
              <!-- 修改质量管理的bug 无实际用处 END -->
          <tr v-for="(item, index) in doneData" :key="index">
            <td
              v-for="(prop, i) in (item['rowspan'] ? doneProps : doneProps.slice(0, doneProps.length -1))"
              :key="i"
              :class="prop === 'class' ? item['class'] : 'drug-cell'"
              :rowspan="prop === 'time' ? item['rowspan'] : undefined"
            >
              {{ prop === 'class' ? '' : item[prop] }} {{ prop === 'time' ? '已执行' : ''}}
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <div class="infusion-bottom height-button-bottom">
      <el-button type="primary" @click="handlePatientPrev" plain>上一位</el-button>
      <el-button type="primary" @click="handlePatientCall">呼叫</el-button>
      <el-button type="primary" @click="handlePatientNext" plain>下一位</el-button>

      <el-button type="primary" @click="handlePatientReceive" class="margin-left-40">接诊</el-button>
      <el-button type="primary" @click="handleDrugVerify" plain>药品审核</el-button>

      <el-button type="primary" @click="handleDrugDispense" plain>配药</el-button>
      <el-button type="primary" @click="handlePuncture">穿刺</el-button>
      <el-button type="primary" @click="handleNormalStop" plain>正常停止</el-button>
      <el-button type="primary" @click="handleExceptionStop" plain>异常停止</el-button>

      <el-button type="primary" @click="handlePay" class="margin-left-40" plain>补费</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      activeStep: 2,
      stepList: ['接', '配', '刺', '滴'],
      infusionForm: {
        diagnosis: '上呼吸道感染',
        dept: '呼吸科',
        doctor: '张立根',
        time: '2019-09-09 13:09:21',
      },
      days: '',
      doneDays: '',
      drugProps: ['name', 'size', 'unit'],
      doneProps: ['name', 'size', 'unit', 'class', 'time'],
      drugData: [],
      doneData: [],
      rules: {
      }
    }
  },
  created () {
    this.getDrugInfo();
    this.getDoneInfo();
  },
  methods: {
    getDrugInfo() {
      let data = [
        {
          name: '阿奇霉素干混悬剂',
          size: '15g',
          unit: '1只'
        }, {
          name: '葡萄糖氯化钠注射液',
          size: '500ml',
          unit: '2袋'
        }
      ];
      this.drugData = data;
      this.days = 3;
    },
    getDoneInfo() {
      let data = [
        {
          name: '阿奇霉素干混悬剂',
          size: '15g',
          unit: '1只',
          time: '2019-09-01 10:32:45'
        }, {
          name: '葡萄糖氯化钠注射液',
          size: '500ml',
          unit: '2袋',
          time: '2019-09-01 10:32:45'
        }
      ];
      let results = {}
      data.forEach(item => {
        !results[item.time] && (results[item.time] = []); 
        results[item.time].push(item);
      })
      Object.keys(results).forEach(key => {
        results[key].forEach((item, index) => {
          item.class = index === 0 ? 'bunchingTop' : (index === results[key].length - 1 ? 'bunchingBottom' : 'bunchingCenter');
          index === 0 && (item.rowspan = results[key].length);
        })
      })
      this.doneData = [].concat.apply([], Object.values(results));

      this.doneDays = Object.keys(results).length;
    },
    handlePatientPrev() {

    },
    handlePatientCall() {

    },
    handlePatientNext() {

    },
    handlePatientReceive() {

    },
    handleDrugVerify() {

    },
    handleDrugDispense() {

    },
    handlePuncture() {

    },
    handleNormalStop() {

    },
    handleExceptionStop() {

    },
    handlePay() {

    }
  },
  computed : {
    ...mapGetters("base", ["receivePatientData"])
  },
  watch: {
    receivePatientData: {
      handler(value) {
        // this.infusionForm.diagnosis = value.patientName;
        this.infusionForm.dept = value.ouptDeptId;
        this.infusionForm.doctor = value.doctorName;
        // this.infusionForm.time = value.patientAddr
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.infusion-main {
  /deep/ .el-step__title.is-process {
    font-weight: 400;
  }
  /deep/ .el-step__title.is-success {
    color: $l-color-primary;
  }
  /deep/ .el-step__head.is-success {
    color: $l-color-primary;
    border-color: $l-color-primary;
  }
}
.infusion-content {
  padding: 20px;
  background: #fff;

  /deep/ .el-step__icon-inner.iconfont {
    font-size: 20px;
  }
  /deep/ .el-step__title.is-finish {
    color: $l-color-fontcolor-3;
  }
  /deep/ .el-step__title.is-process {
    color: $l-color-fontcolor-3;
  }
  /deep/ .el-step__title.is-wait {
    color: $l-color-fontcolor-3;
  }
  /deep/ .el-step__head.is-process {
    color: $l-color-primary;
  }
  /deep/ .el-step__head.is-finish .el-step__line {
    background-color: $l-color-primary;
  }
}
.infusion-bottom {
  padding: 20px;
  background: #fff;
  border-top: 1px solid $l-color-border-3;
  border-radius: 0 0 4px 4px;

  /deep/ .el-button {
    margin-bottom: 5px;
  }
}
.title-days {
  color: $l-color-fontcolor-5;
}
.title-days-done {
  color: $l-color-fontcolor-7;
}
.drug-cell {
  padding: 5px 10px;
}
.infusion-item {
  margin-bottom: 20px;
}

.bunchingTop::after {
  content: '┓';
}
.bunchingCenter::after {
  content: '┫';
}
.bunchingBottom::after {
  content: '┛';
}
</style>