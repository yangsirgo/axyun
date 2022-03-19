<template>
  <div class="drugForm width100 height100">
    <el-card class="card-cont width100 height100">
      <el-row style="border-bottom:1px solid #E4E4E4">
        <el-col :span="24" class="cardTitleStyle">
          <l-card-title>
            <span slot="left">皮试药品信息</span>
          </l-card-title>
        </el-col>
      </el-row>

      <div class="tabs">
        <el-form ref="drugForm" :rules="rules" :model="this.drugFormDeail">
          <el-row>
            <el-col :span="24">
              <el-form-item label label-width prop="drugName">
                <l-formt-title
                  required
                  label="皮试药品"
                  labelWidth="48"
                  :disabled="!drugFormDeail.isnew"
                >
                  <Linput
                    v-if="drugFormDeail.isnew"
                    :popoverWidth="800"
                    v-model="drugFormDeail.drugName"
                    suffix-icon="el-icon-search"
                    style="width:200px;"
                    :tableData="selectOptions"
                    @query="elsearch($event)"
                    @select="select"
                    :tableParams="dropColumn"
                    :total="total"
                    placeholder="请选择药品"
                  ></Linput>
                  <el-input
                    v-else
                    v-model="drugFormDeail.drugName"
                    style="line-height: 34px;"
                    :disabled="!drugFormDeail.isnew"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label label-width prop="spec">
                <l-formt-title label="规格" labelWidth="48" :disabled="true">
                  <el-input
                    v-model="drugFormDeail.spec"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label label-width prop="stClassCode">
                <l-formt-title label="分类码" labelWidth="62" :disabled="true">
                  <l-value-domain
                    code="DrugTypeCode"
                    :value.sync="drugFormDeail.stClassCode"
                    :disabled="true"
                  />
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label label-width prop="stSolutionType">
                <l-formt-title required label="皮试液类型" labelWidth="76">
                  <el-select
                    v-model="drugFormDeail.stSolutionType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in liquidlist"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label label-width prop="stType">
                <l-formt-title required label="皮试类型" labelWidth="76">
                  <el-select
                    v-model="drugFormDeail.stType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in stCodelist"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label label-width prop="stRemindTime">
                <l-formt-title required label="皮试提醒时间" labelWidth="76">
                  <el-input-number
                    v-model="drugFormDeail.stRemindTime"
                    controls-position="right"
                    :min="1"
                  ></el-input-number>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="line-height: 32px;">分钟</el-col>
          </el-row>
          <el-row>
            <el-col :span="14">
              <el-form-item label label-width prop="validTime">
                <l-formt-title required label="皮试有效时间" labelWidth="76">
                  <el-input-number
                    v-model="drugFormDeail.validTime"
                    controls-position="right"
                    :min="1"
                  ></el-input-number>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="line-height: 32px;">小时</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label label-width prop="positiveDispense">
                <l-formt-title required label="阳性允许发药" labelWidth="76">
                  <el-select
                    v-model="drugFormDeail.positiveDispense"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in positivelist"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label label-width prop="applicationRange">
                <l-formt-title required label="适用范围" labelWidth="76">
                  <el-select
                    v-model="drugFormDeail.applicationRange"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in scopelist"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="status">
                <l-formt-title
                  required
                  label="状态标识"
                  labelWidth="76"
                  style="width:100%"
                >
                  <el-select
                    v-model="drugFormDeail.status"
                    style="line-height: 34px;width:100%"
                  >
                    <el-option
                      v-for="item in statuslist"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="!drugFormDeail.isnew">
            <el-col :span="12">
              <el-form-item label label-width prop="createdByName">
                <l-formt-title
                  label="创建人"
                  labelWidth="62"
                  style="width:100%"
                  :disabled="true"
                >
                  <el-input
                    v-model="drugFormDeail.createdByName"
                    style="line-height: 34px;width:100%"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="createdAt">
                <l-formt-title
                  label="创建时间"
                  labelWidth="76"
                  style="width:100%"
                  :disabled="true"
                >
                  <el-input
                    v-model="drugFormDeail.createdAt"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-if="!drugFormDeail.isnew">
            <el-col :span="12">
              <el-form-item label label-width prop="updatedByName">
                <l-formt-title
                  label="修改人"
                  labelWidth="62"
                  style="width:100%"
                  :disabled="true"
                >
                  <el-input
                    v-model="drugFormDeail.updatedByName"
                    style="line-height: 34px;width:100%"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label label-width prop="updatedAt">
                <l-formt-title
                  label="修改时间"
                  labelWidth="76"
                  style="width:100%"
                  :disabled="true"
                >
                  <el-input
                    v-model="drugFormDeail.updatedAt"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </l-formt-title>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="button-cont">
        <el-button class="confirm-button" @click="confirm">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Linput from "./Linput";
import hmmBaseApi from "@/api/hmm/base";
export default {
  props: ["drugForm"],
  components: {
    Linput
  },
  data() {
    return {
      liquidlist: [
        { code: "0", name: "原液皮试" },
        { code: "1", name: "皮试液皮试" }
      ], //皮试液类型数据源
      stCodelist: [
        { code: "0", name: "非必须皮试" },
        { code: "1", name: "必须皮试" }
      ], //皮试类型数据源
      positivelist: [
        { code: "0", name: "阳性不允许发药" },
        { code: "1", name: "阳性允许发药" }
      ], //阳性是否允许发药数据源
      scopelist: [
        { code: "0", name: "全院" },
        { code: "1", name: "住院" },
        { code: "2", name: "门诊" }
      ], //适用范围数据源
      statuslist: [{ code: "0", name: "暂停" }, { code: "1", name: "正常" }], //状态标识数据源
      drugFormDeail: {
        isnew: false
      },
      //表格编辑输入药品名称联想药品table数据源
      selectOptions: [],
      // 下拉 table 配置表头
      dropColumn: [
        {
          prop: "drugName",
          label: "药品名称",
          width: 150
        },
        {
          prop: "spec",
          label: "规格",
          width: 50
        },
        {
          prop: "originCode",
          label: "生产厂商"
          // width: 50
        },
        {
          prop: "formCode",
          label: "剂型",
          width: 50
        }
      ],
      selectlist: [], //药品快速选择
      favorites: [], //左侧下拉框数据
      localFavorites: [], //右侧侧下拉框数据
      rules: {
        drugName: [
          { required: true, message: "请输入药品名称", trigger: "blur" }
        ],
        stSolutionType: [
          { required: true, message: "请选择皮试液类型", trigger: "change" }
        ],
        stType: [
          { required: true, message: "请选择皮试类型", trigger: "change" }
        ],
        stRemindTime: [
          { required: true, message: "请输入皮试提醒时间", trigger: "blur" }
        ],
        validTime: [
          { required: true, message: "请输入皮试有效时间", trigger: "blur" }
        ],
        positiveDispense: [
          { required: true, message: "请输入阳性允许发药", trigger: "blur" }
        ],
        applicationRange: [
          { required: true, message: "请选择适用范围", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择状态标识", trigger: "change" }
        ]
      },
      storageCode: "",
      pageParams: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0
    };
  },
  created() {
    this.getUserStorage();
  },
  watch: {
    drugForm() {
      this.$refs.drugForm && this.$refs.drugForm.resetFields();
      this.drugFormDeail = { ...this.drugForm };
    }
  },
  methods: {
    //修改某一条药品数据
    confirm() {
      this.$refs.drugForm.validate(valid => {
        if (valid) {
          let params = {
            id: this.drugFormDeail.id,
            dataVersion: this.drugFormDeail.dataVersion,
            applicationRange: this.drugFormDeail.applicationRange,
            deletedStatus: this.drugFormDeail.deletedStatus,
            drugId: this.drugFormDeail.drugId,
            drugName: this.drugFormDeail.drugName,
            spec: this.drugFormDeail.spec,
            positiveDispense: this.drugFormDeail.positiveDispense,
            stClassCode: this.drugFormDeail.stClassCode,
            stRemindTime: this.drugFormDeail.stRemindTime,
            stSolutionType: this.drugFormDeail.stSolutionType,
            stType: this.drugFormDeail.stType,
            status: this.drugFormDeail.status,
            validTime: this.drugFormDeail.validTime
          };

          hmmBaseApi
            .saveStDrug(params)
            .then(res => {
              if (res.code == 1) {
                this.$message.success("保存成功");
                this.$emit("getRefreshList", this.drugFormDeail);
              } else {
                this.$message.error(res.msg || "保存失败");
              }
              this.$hideLoading();
            })
            .catch(err => {
              this.$hideLoading();
              this.$message.error(err.msg || "保存失败");
            });
        }
      });
    },
    //新增
    newadd() {
      this.$refs.drugForm.resetFields();
      this.drugFormDeail = {
        isnew: true,
        applicationRange: "",
        deletedStatus: "0",
        drugId: "",
        drugName: "",
        id: "",
        positiveDispense: "",
        spec: "",
        stClassCode: "",
        stRemindTime: "",
        stSolutionType: "",
        stType: "",
        status: "",
        validTime: ""
      };
    },
    // 获取当前登录的药房
    getUserStorage() {
      hmmBaseApi
        .getCurDrugStorage()
        .then(res => {
          if (res.code === 1) {
            console.log(res.data);
            this.storageCode = res.data.storageCode;
          } else {
            this.$message.error("获取当前库房失败");
          }
        })
        .catch(err => {
          this.$message.error("获取当前库房失败");
        });
    },
    //联想输入方法
    elsearch(row) {
      let temp = {
        pageSize: 10,
        drugName: row.inputValue,
        cwType: "1",
        pageNo: row.pageNo
      };
      this.selectOptions = [];
      this.getDrugList(temp);
    },
    //获取联想搜索结果
    getDrugList(params) {
      hmmBaseApi.getDrugList(params).then(res => {
        const list = res.data.map(drugWapper => {
          return {
            ...drugWapper,
            id: "",
            drugId: drugWapper.id,
            stClassCode: drugWapper.classCode
          };
        });
        this.selectOptions = list;
        this.total = res.total;
      });
    },
    //回填
    select(row) {
      console.log(row);
      this.selectOptions = [];
      for (let i in row) {
        this.$set(this.drugFormDeail, i, row[i]);
      }
      this.$refs.drugForm.validate();
    }
  }
};
</script>

<style lang="scss" scoped>
.drugForm {
  .card-cont {
    padding: 0 20px 20px 20px;
    .cardTitleStyle {
      padding: 8px 0px;
    }
    .el-form-item {
      margin-bottom: 0;
    }

    .tabs {
      height: calc(100% - 150px);
      overflow-y: auto;
      .remove-button,
      .add-button {
        width: 18px;
        height: 18px;
        margin-top: 8px;
        display: inline-block;
      }
      .add-button {
        margin-left: 10px;
      }
    }

    .button-cont {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid $l-color-bgcolor-11;

      .confirm-button {
        width: 80px;
        height: 36px;
        padding: 0;
        text-align: center;
        line-height: 36px;
        background: $l-color-primary;
        border-radius: 2px;
        font-size: $l-font-size;

        font-weight: 400;
        color: $l-color-white;
        float: right;
      }
    }
  }
}
.tabs {
  padding-top: 4px;
  overflow-x: hidden;
  /deep/ .el-form-item--medium .el-form-item__content {
    height: 36px;
    margin-bottom: 4px;
  }
}
</style>
