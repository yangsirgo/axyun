<template>
  <div class="drugForm width100 height100">
    <el-card class="card-cont width100 height100">
      <el-row style="border-bottom:1px solid #E4E4E4">
        <el-col :span="24" class="cardTitleStyle">
          <l-card-title>
            <span slot="left">药房信息</span>
          </l-card-title>
        </el-col>
      </el-row>

      <div class="tabs">
        <el-form ref="drugForm" :model="this.drugFormDeail">
          <el-row style="margin-top:4px" :gutter="10">
            <el-col :span="24">
              <l-formt-title label="库房名称" required labelWidth="76">
                <el-select v-model="drugFormDeail.pharCode" placeholder="请选择" style="width:100%">
                  <el-option
                    v-for="item in execDeptCodelist"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </l-formt-title>
            </el-col>
          </el-row>
          <el-row style="margin-top:4px" :gutter="10">
            <el-col :span="24">对照药库</el-col>
          </el-row>
          <el-row
            style="margin-top:4px"
            :gutter="10"
            v-for="(item,index) in drugFormDeail.storageCodeList"
            :key="index"
            :value="index"
          >
            <el-col :span="20">
              <el-select
                v-model="item.storageCode"
                placeholder="请选择"
                style="width:100%"
                @change="codeChange($event,index)"
              >
                <el-option
                  v-for="ite in libraryCodelist"
                  :key="ite.code"
                  :label="ite.name"
                  :value="ite.code"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <span class="remove-button" @click="deleteLibrary(index)">
                <svg
                  t="1568190829279"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="13492"
                  width="18"
                  height="18"
                >
                  <path
                    d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z"
                    fill="#FFE3E2"
                    p-id="13493"
                  />
                  <path
                    d="M284.444444 455.111111h455.111112v113.777778H284.444444z"
                    fill="#E1140A"
                    p-id="13494"
                  />
                </svg>
              </span>
              <span
                class="add-button"
                @click="addLibrary(item)"
                v-if="index==drugFormDeail.storageCodeList.length-1"
              >
                <svg
                  t="1568190873204"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="13604"
                  width="18"
                  height="18"
                >
                  <path
                    d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m0 56.888889a455.111111 455.111111 0 1 0 0 910.222222A455.111111 455.111111 0 0 0 512 56.888889z"
                    fill="#E4E4E4"
                    p-id="13605"
                  />
                  <path
                    d="M227.555556 455.111111h568.888888v113.777778H227.555556z"
                    fill="#2E323A"
                    p-id="13606"
                  />
                  <path
                    d="M455.111111 227.555556h113.777778v568.888888H455.111111z"
                    fill="#2E323A"
                    p-id="13607"
                  />
                </svg>
              </span>
            </el-col>
          </el-row>
          <el-row style="margin-top:4px" :gutter="10" v-if="!drugFormDeail.isnew">
            <el-col :span="12">
              <l-formt-title label="操作人" labelWidth="62" style="width:100%" :disabled="true">
                <el-form-item label label-width prop="updatedByName">
                  <el-input
                    v-model="drugleftDeail.updatedByName"
                    style="line-height: 34px;width:100%"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
            </el-col>

            <el-col :span="12">
              <l-formt-title label="操作时间" labelWidth="76" style="width:100%" :disabled="true">
                <el-form-item label label-width prop="updatedAt">
                  <el-input
                    v-model="drugleftDeail.updatedAt"
                    style="line-height: 34px;"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </l-formt-title>
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
import hmmBaseApi from "@/api/hmm/base";
export default {
  props: ["drugForm"],
  data() {
    return {
      execDeptCodelist: [], //药房数据源
      libraryCodelist: [], //药库数据源
      drugleftDeail: {},
      drugFormDeail: {},
      favorites: [], //左侧下拉框数据
      localFavorites: [], //右侧侧下拉框数据
      rules: {
        drugName: [
          { required: true, message: "请输入药品名称", trigger: "blur" }
        ],
        spec: [{ required: true, message: "请输入规格", trigger: "blur" }],
        cwType: [
          { required: true, message: "请选择药品类型", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getDrugStorageList("0");
    this.getDrugCodelis("1");
  },
  watch: {
    drugForm(val) {
      this.drugleftDeail = { ...this.drugForm };
      if (val && val.pharCode) {
        this.drugDeail(val.pharCode);
      }
    }
  },
  methods: {
    getDrugStorageList(params) {
      hmmBaseApi.getDrugStorage(params).then(res => {
        this.libraryCodelist = res.data;
      });
    },

    getDrugCodelis(params) {
      hmmBaseApi.getDrugStorage(params).then(res => {
        this.execDeptCodelist = res.data;
      });
    },

    //获取右侧数据
    drugDeail(pharCode) {
      hmmBaseApi.getstrgPharRelaget(pharCode).then(res => {
        this.drugFormDeail = res.data;
        console.log(this.drugFormDeail);
      });
    },
    //修改某一条药品数据
    confirm() {
      let storageCodeList = this.drugFormDeail.storageCodeList.filter(
        item => item.storageCode
      );
      let params = {
        pharCode: this.drugFormDeail.pharCode,
        storageCodeList: storageCodeList
      };

      if (!this.drugFormDeail.pharCode) {
        this.$message.warning("请选择库房名称!");
        return;
      }
      if (storageCodeList.length === 0) {
        this.$message.warning("请选择对照药库!");
        return;
      }
      this.$showLoading();
      hmmBaseApi
        .addStrgPharRela(params)
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
    },

    //删除对照药库
    deleteLibrary(index) {
      if (this.drugFormDeail.storageCodeList.length <= 1) {
        this.$delete(this.drugFormDeail.storageCodeList, index);
        this.drugFormDeail.storageCodeList.push({ storageCode: "" });
      } else {
        this.$delete(this.drugFormDeail.storageCodeList, index);
      }
    },
    //新增对照药库
    addLibrary(item) {
      if (item.storageCode == "") {
        this.$message.error("不能为空");
      } else {
        this.drugFormDeail.storageCodeList.push({ storageCode: "" });
      }
    },
    //新增
    newadd() {
      this.drugFormDeail = {
        isnew: true,
        pharCode: "",
        pharName: "",
        storageCode: "",
        storageCodeList: [
          {
            storageCode: ""
          }
        ],
        storageName: ""
      };
    },
    codeChange(val, index) {
      // 对照药库去重
      let itemIndex = this.drugFormDeail.storageCodeList.findIndex(
        item => item.storageCode === val
      );
      if (itemIndex !== index) {
        this.$message.warning("禁止选择相同的对照药库");
        this.$set(this.drugFormDeail.storageCodeList, index, {
          storageCode: ""
        });
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.drugForm {
  .card-cont {
    padding: 0 20px 20px 20px;
 .cardTitleStyle{
      padding: 8px 0px;
    }
    .el-form-item {
      margin-bottom: 0;
    }

    .tabs {
      height: calc(100% - 150px);

      .el-tabs__content {
        height: calc(100% - 55px);
      }

      .el-tab-pane {
        overflow-y: auto;
      }

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
</style>
