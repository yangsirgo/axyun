<template>
  <div class="wrapper">
    <el-form ref="bottomForm" :model="recordForm" :rules="rules">
      <el-row>
        <l-card-title
          ><span slot="left"
            >诊断<span style="color: #f05a23"> *</span></span
          ></l-card-title
        >
        <el-table class="" :data="zdData" ref="zdData" border stripe>
          <!-- 业务列 -->
          <el-table-column
            v-for="(item, index) in zdParams"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :min-width="item.width"
            header-align="center"
            :align="item.align || 'left'"
            :row-class-name="tableRowClassName"
          >
            <template slot-scope="scope" v-if="item.operateType != '1'">
              <!-- 可自定义内容 -->
              <template v-if="item.prop === 'cwFlag'">
                <l-value-domain
                  style=""
                  code="CWM"
                  :value.sync="scope.row[item.prop]"
                  placeholder="请选择"
                  @change="cwFlagChange(...arguments, scope.$index)"
                ></l-value-domain>
              </template>
              <template v-else-if="item.prop === 'diagName'">
                <el-select
                  class="width100"
                  :ref="'elem' + scope.$index"
                  placeholder="请输入诊断名称"
                  filterable
                  :remote-method="
                    (query) => {
                      return remoteMethod(query, scope.row);
                    }
                  "
                  remote
                  reserve-keyword
                  default-first-option
                  :loading="loading"
                  v-model="scope.row.diagName"
                  @change="
                    (val) => {
                      changeFunc(val, scope.row);
                    }
                  "
                  @focus="focusSelect(scope.$index, scope.row)"
                >
                  <el-option
                    v-for="(data, index) in scope.row.settingData"
                    :key="index"
                    :label="data[scope.row.labelname]"
                    :value="data[scope.row.valuekey]"
                  ></el-option>
                </el-select>
              </template>
              <template v-else-if="item.prop === 'diagTime'">
                <el-date-picker
                  v-model="scope.row.diagTime"
                  type="datetime"
                  style="width: 100%"
                  placeholder="选择日期"
                  @input="inputChange($event)"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="expireTimeOption"
                ></el-date-picker>
              </template>
              <template v-else-if="item.prop === 'diagIcd'">
                <el-input
                  v-model="scope.row.diagIcd"
                  style="width: 100%"
                  placeholder="请输入"
                  maxlength="50"
                  @input="inputChange($event)"
                ></el-input>
              </template>
              <template v-else-if="item.prop == 'operate'">
                <el-button
                  @click="deleteConfirm(scope.$index, scope.row)"
                  type="text"
                  size="small"
                  >删除</el-button
                >
              </template>
              <template v-else>
                <span>{{ scope.row[item.prop] }}</span>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div
          style="
            margin-top: 10px;
            width: 100%;
            display: flex;
            justify-content: center;
          "
        >
          <div
            @click="addZD"
            style="
              width: 400px;
              height: 35px;
              background-color: #f1f4f6;
              border: 1px dashed #e4e4e4;
              color: #959696;
              display: flex;
              justify-content: center;
              aligin-item: center;
            "
          >
            <span class="el-icon-plus iconFont-style"></span>
          </div>
        </div>
      </el-row>
      <el-row>
        <l-card-title><span slot="left">病情摘要</span></l-card-title>
        <el-row :gutter="8" class="margin-bottom-20 width1024-100">
          <el-col :span="24">
            <el-form-item prop="summaryOfIllness">
              <l-formt-title label="病情摘要" required :isMultiRow="true">
                <el-input
                  type="textarea"
                  v-model="recordForm.summaryOfIllness"
                  maxlength="500"
                  show-word-limit
                  :autosize="{ minRows: 8, maxRows: 10 }"
                  @input="inputChange($event)"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
      <el-row>
        <l-card-title><span slot="left">收治指征及建床意见</span></l-card-title>
        <el-row :gutter="8" class="margin-bottom-20 width1024-100">
          <el-col :span="24">
            <el-form-item prop="createOpinions">
              <l-formt-title
                label="收治指征及建床意见"
                required
                :isMultiRow="true"
              >
                <el-input
                  type="textarea"
                  v-model="recordForm.createOpinions"
                  maxlength="500"
                  show-word-limit
                  :autosize="{ minRows: 8, maxRows: 10 }"
                ></el-input>
              </l-formt-title>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="8" class="margin-bottom-20 width1024-100">
          <el-col :span="9">
            <LFormtTitle label="社保登记病种" required>
              <el-form-item prop="diseaseType">
                <l-value-domain
                  required
                  code="SiDiseaseType"
                  :value.sync="recordForm.diseaseType"
                  class="select-container"
                  :placeholder="$t('base.placeholder')"
                  key="key5"
                ></l-value-domain>
              </el-form-item>
            </LFormtTitle>
          </el-col>
          <el-col :span="5">
            <LFormtTitle label="建床类型" required>
              <el-form-item prop="createType">
                <l-value-domain
                  code="AdmitHosType"
                  :value.sync="recordForm.createType"
                  class="select-container"
                  :placeholder="$t('base.placeholder')"
                  key="key7"
                ></l-value-domain>
              </el-form-item>
            </LFormtTitle>
          </el-col>
          <el-col :span="5">
            <LFormtTitle label="建床次数">
              <el-form-item prop="inHosTimes">
                <el-input-number
                  disabled
                  :min="1"
                  :max="1000"
                  v-model="recordForm.inHosTimes"
                  style="width: 100%"
                  :placeholder="$t('base.placeholder')"
                  @input="inputChange($event)"
                ></el-input-number>
              </el-form-item>
            </LFormtTitle>
          </el-col>
          <el-col :span="5">
            <LFormtTitle label="首次建床日期">
              <el-form-item prop="firstBedBuild">
                <el-date-picker
                  disabled
                  v-model="recordForm.firstBedBuild"
                  type="date"
                  style="width: 100%"
                  placeholder="选择日期"
                  @input="inputChange($event)"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </LFormtTitle>
          </el-col>
        </el-row>

        <el-row :gutter="8" class="margin-bottom-20 width1024-100">
          <el-col :span="8">
            <LFormtTitle label="本次治疗" required>
              <el-form-item prop="company">
                <el-date-picker
                  width="100%"
                  v-model="recordForm.chargeDate2"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  clearable
                ></el-date-picker>
              </el-form-item>
            </LFormtTitle>
          </el-col>
        </el-row>
      </el-row>
    </el-form>
    <div class="readonlyCls"  v-if="readonly"></div>
    <!-- pStatus {{ pStatus }} -->
  </div>
</template>

<script>
import { get } from "@/utils/request";
export default {
  props: {
    recordFormobj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    zdDataObj: {
      type: Array,
      default: () => {
        return [];
      }
    },
    readonly: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    pStatus: {}
  },
  watch: {
    recordFormobj: {
      handler(val) {
        for (const key in this.recordForm) {
          this.recordForm[key] = val[key];
        }
        // this.recordForm = deepClone(val);
      },
      immediate: true,
      deep: true
    },
    zdDataObj: {
      handler(val) {
        this.zdData = JSON.parse(JSON.stringify(val));
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      // 诊断信息表格数据
      zdData: [],
      //form表单
      recordForm: {
        inHosTimes: undefined,
        firstBedBuild: "",
        summaryOfIllness: "",
        createOpinions: "",
        diseaseType: "",
        createType: "",
        chargeDate2: []
      },
      //日期只可以选当前日期
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() > Date.now();
        }
      },
      loading: false,
      // 危急值信息表头
      zdParams: [
        {
          prop: "cwFlag",
          label: "类型",
          fixed: "left",
          width: "10%"
        },
        {
          prop: "diagName",
          label: "诊断名称",
          fixed: "left",
          width: "20%"
        },
        {
          prop: "diagIcd",
          label: "诊断描述",
          width: "30%"
        },
        {
          prop: "diagCode",
          label: "ICD编码",
          width: "10%"
        },
        {
          prop: "diagTime",
          label: "诊断日期",
          width: "20%"
        },
        {
          prop: "operate",
          label: "操作",
          width: "10%"
        }
      ],
      // 校验规则
      rules: {
        summaryOfIllness: [
          { required: true, message: "请输入病情摘要", trigger: "blur" }
        ],
        createOpinions: [
          { required: true, message: "请输入建床意见", trigger: "blur" }
        ],
        diseaseType: [
          { required: true, message: "请选择社保登记病种", trigger: "change" }
        ],
        createType: [
          { required: true, message: "请选择建床类型", trigger: "change" }
        ],
        chargeDate2: [
          {
            type: "array",
            required: true,
            message: "请选择本次治疗时间",
            trigger: "change"
          }
        ]
      }
    };
  },
  /**
   * 1.诊断数据删除按钮click事件 (deleteConfirm) {删除一条诊断数据}
   * 2.诊断数据添加按钮click事件 (addZD) {添加一条诊断数据}
   * 3.诊断类型change事件 (cwFlagChange) {改变诊断类型}
   * 4.诊断名称change事件 (changeFunc) {改变诊断名称内容}
   * 5.通用方法，解决input组件无法输入问题 (inputChange) {手动触发页面刷新}
   * 6.诊断名称远程搜索方法 (remoteMethod) {请求诊断名称列表}
   * 7.诊断名称focus事件 (focusSelect) {请求诊断名称列表}
   * 8.bottomForm组件提交数据 (submit) {调用校验函数。若通过则抛出表单数据}
   */
  methods: {
    deleteConfirm(rowIndex, row) {
      this.$confirm("确定要删除此项吗？", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.zdData.splice(rowIndex, 1);
          // this.zdData[rowIndex].operateType = "1"
          console.log(this.zdData);
          // this.$nextTick(() => {
          //   this.$refs.zdData.doLayout();
          // });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addZD(rowIndex, row) {
      this.zdData.push({
        cwFlag: "1",
        diagName: "",
        diagIcd: "",
        diagCode: "",
        diagTime: new Date().format("yyyy-MM-dd"),
        remoteParams1: {
          keyword: "",
          type: "",
          cwFlag: "1"
        },
        _orgSettingData: [],
        settingData: [],
        keyword: "",
        currVal: null,
        valuekey: "icd10Encoding",
        labelname: "dictionaryName",
        operateType: "0"
      });
    },
    cwFlagChange(n, m, index) {
      // debugger;
      this.zdData[index].remoteParams1 = {
        keyword: "",
        type: "",
        cwFlag: n
      };
      this.zdData[index].diagCode = "";
      this.zdData[index].diagIcd = "";
      this.zdData[index].diagName = "";
      this.zdData[index].diagTime = "";
    },
    // 触发父组件的change事件
    changeFunc(key, row) {
      let obj = {};
      obj = row.settingData.find(item => {
        if (row.cwFlag == "1") {
          return item.icd10Encoding == key;
        } else {
          return item.tcdCode == key;
        }
      });
      if (row.cwFlag == "1") {
        row.diagCode = obj.icd10Encoding;
        row.diagName = obj.dictionaryName;
      } else {
        row.diagCode = obj.tcdCode;
        row.diagName = obj.tcdName;
      }

      // 重复诊断添加校验
      let zdList = this.zdData.filter(
        zdItem => zdItem.diagCode === row.diagCode
      );
      if (zdList.length > 1) {
        this.$message.warning("不能添加重复诊断！");
        row.diagCode = "";
        row.diagName = "";
        return;
      }
    },
    //element组件input无法输入问题
    inputChange(e) {
      this.$forceUpdate();
    },
    remoteMethod(query, row) {
      row.remoteParams1.keyword = query;
      console.log("remoteMethod-----query-----", query);
      console.log("remoteMethod-----row-----", row);
      // this.settingData = [...this._orgSettingData];
      this.request(row);
    },
    async focusSelect(index, row) {
      console.log("focusSelect-------", index, row);
      // this.settingData = [...this._orgSettingData];
      await this.request(row);
    },
    async request(row) {
      console.log("request-------", row);
      try {
        this.loading = true;
        let params = {};
        if (row.remoteParams1) {
          params = { ...row.remoteParams1 };
        }

        let { data } = await get("/patTcmDiag/getDiagNameCode", params);
        console.log(data, "中医证型请求的数据：data");
        if (row.cwFlag == "2") {
          row.valuekey = "tcdCode";
          row.labelname = "tcdName";
        } else {
          row.valuekey = "icd10Encoding";
          row.labelname = "dictionaryName";
        }
        // row._orgSettingData = [...data];
        // row.settingData = this.filterHandler(row);
        row.settingData = [...data];
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.$message.error(error.errorMsg);
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.operateType == "1") {
        return "operate-type-hide";
      }
      return "";
    },
    //校验函数
    checkHandler() {
      if (this.zdData.length < 1) {
        this.$message.error("请填写至少一条诊断");
        return false;
      }
      // 诊断内部具体信息校验
      if (this.zdData.length > 0) {
        for (let j = 0; j < this.zdData.length; j++) {
          let item = this.zdData[j];
          if (!item.diagName || !item.diagTime) {
            this.$message.error("请填写完整诊断信息");
            return false;
          }
        }
      }
      if (
        !this.recordForm.summaryOfIllness ||
        this.recordForm.summaryOfIllness.length <= 0
      ) {
        this.$message.error("病情摘要不能为空");
        return false;
      }
      if (
        !this.recordForm.createOpinions ||
        this.recordForm.createOpinions.length <= 0
      ) {
        this.$message.error("建床意见不能为空");
        return false;
      }
      if (
        !this.recordForm.diseaseType ||
        this.recordForm.diseaseType.length <= 0
      ) {
        this.$message.error("社保登记病种不能为空");
        return false;
      }
      if (
        !this.recordForm.createType ||
        this.recordForm.createType.length <= 0
      ) {
        this.$message.error("建床类型不能为空");
        return false;
      }
      if (
        !this.recordForm.chargeDate2 ||
        this.recordForm.chargeDate2.length <= 0
      ) {
        this.$message.error("本次治疗时间不能为空");
        return false;
      }
      return true;
    },
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs["bottomForm"].validate(valid => {
          if (this.checkHandler() && valid) {
            resolve({
              zdData: this.zdData,
              recordForm: this.recordForm
            });
          } else {
            reject(false);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.margin-bottom-20 {
  margin-bottom: 1px;
}
.iconFont-style {
  cursor: pointer;
  width: 35px;
  height: 35px;
  background-color: #f2f4f6;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cardtitle {
  height: 50px;
}
.readonlyCls{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.01;
  background-color: black;
}
.wrapper {
  position: relative;
}
</style>
