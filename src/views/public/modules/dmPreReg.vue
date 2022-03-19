<template>
  <div class="dm-box">
    <l-card-title class="dec-title mb10">
      <span slot="left">毒麻处方回收登记</span>
    </l-card-title>
    <div class="pre-no mb10">19082300001</div>
    <div class="pre-info mb10">已发药 金额：20.35元</div>
    <div class="info-list">
      <p>诊断：心悸</p>
      <p>开单科室：心内科</p>
      <p>开单医生：张XX</p>
      <p>收费人员：李XX</p>
      <p>收费时间：2019-08-23 13:05:43</p>
      <p>配方人员：董培培</p>
      <p>发药人员：董培培</p>
    </div>
    <div class="drug-info mb10">
      <div class="drug-name">盐酸普鲁卡因</div>
      <div class="spec">2ml：40mg*10支/盒</div>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
      <el-form-item prop="name">
        <l-formt-title label="回收数">
          <el-input v-model="ruleForm.hss" placeholder="请输入内容"></el-input>
        </l-formt-title>
      </el-form-item>
      <el-form-item prop="name">
        <l-formt-title label="回收人">
          <el-select v-model="ruleForm.hsr" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </l-formt-title>
      </el-form-item>
      <el-form-item prop="name">
        <l-formt-title label="回收时间">
          <el-date-picker
            v-model="ruleForm.hssj"
            :clearable="false"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </l-formt-title>
      </el-form-item>
      <el-form-item prop="name">
        <l-formt-title label="核对人">
          <el-select v-model="ruleForm.hdr" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </l-formt-title>
      </el-form-item>
      <el-form-item prop="name">
        <l-formt-title label="销毁人">
          <el-select v-model="ruleForm.xhr" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </l-formt-title>
      </el-form-item>
      <el-form-item prop="name">
        <l-formt-title label="销毁时间">
          <el-date-picker
            v-model="ruleForm.value"
            :clearable="false"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </l-formt-title>
      </el-form-item>
      <el-form-item prop="name">
        <l-formt-title label="销毁方式">
          <el-select v-model="ruleForm.xhfs" placeholder="请选择">
            <el-option
              v-for="item in xhType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </l-formt-title>
      </el-form-item>
      <el-form-item prop="name">
        <l-formt-title label="监毁人">
          <el-select v-model="ruleForm.jhr" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </l-formt-title>
      </el-form-item>
      <el-form-item class="align-right">
        <el-button type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "dmPreReg",
  data() {
    return {
      ruleForm: {
        hss: "",
        hsr: "",
        hssj: "",
        hdr: "",
        xhr: "",
        xhsj: "",
        xhfs: "",
        jhr: ""
      },
      rules: {},
      options: [
        {
          value: "1",
          label: "张三"
        },
        {
          value: "2",
          label: "李四"
        }
      ],
      xhType: [
        {
          value: "1",
          label: "方式一"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.dm-box {
  height: 100%;
  overflow-y: auto;
  font-size: $l-font-size;
}
.dec-title {
  height: 35px;
  line-height: 35px;
  /deep/ .titleleft::before {
    margin-top: 8px;
  }
}
.mb10 {
  margin-bottom: 10px;
}
.pre-no {
  font-size: $l-font-size-max;
  font-weight: bold;
}
.pre-info {
  font-size: $l-font-size;
}
.align-right {
  text-align: right;
}
.info-list {
  line-height: 30px;
}
.drug-info {
  line-height: 30px;
}
</style>