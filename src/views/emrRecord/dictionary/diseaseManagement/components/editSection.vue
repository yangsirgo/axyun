<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
  <el-dialog
    title="病种维护"
    :visible.sync="dialogVisible"
    :show="isShow"
    @close="dialogClose"
    width="880px"
  >
    <div style="margin: 15px 40px">
      <el-row style="margin-top: 10px">
        <el-col :span="12">
          <span class="form-control">疾病编码</span>
          <el-input
            disabled
            v-model="myTemplate.diseasesCode"
            style="width: 280px; margin-left: 5px"
          ></el-input>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <span class="form-control">疾病名称</span>
          <el-input
            v-model="myTemplate.diseasesName"
            :disabled="vDisabled"
            maxlength="50"
            style="width: 280px; margin-left: 5px"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <span class="form-control" style="vertical-align: top; margin-left: 1em"
          >关联icd</span
        >
        <div style="display: inline-block">
          <i
            class="el-icon-plus"
            style="font-size: 25px; margin: 0px 20px; float: right"
            v-popover:popover
          ></i>
          <div
            style="
              float: left;
              border: 1px solid #e4e4e4;
              overflow: auto;
              width: 600px;
              height: 100px;
            "
          >
            <el-tag
              :key="tag.ICD10_ENCODING"
              v-for="tag in myTemplate.icdDic"
              closable
              type="info"
              style="margin-left: 10px; margin-top: 10px"
              @close="handleClose(tag)"
            >
              {{ tag.DICTIONARY_NAME }}
            </el-tag>
          </div>

          <el-popover
            ref="popover"
            placement="right"
            :offset="100"
            width="400"
            trigger="click"
            @show="icdSelectPop"
            v-model="popoverShow"
          >
            <div class="dialog-footer" style="float: right; margin: 5px 0px">
              <el-button type="primary" @click="handleClosePop">关闭</el-button>
            </div>
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText"
              @change="filterTextChanged"
            ></el-input>
            <el-table
              stripe
              :data="listData"
              ref="icdTable"
              @row-dblclick="dblclick"
              border
              height="360px"
              v-loading="tlm_isLoading"
              v-loadmore="{
                noMoreVar: 'tlm_noMore',
                loadingVar: 'tlm_isLoading',
                value: loadNextPage,
              }"
              style="width: 100%; margin-top: 10px"
            >
              <el-table-column
                prop="dictionaryName"
                min-width="60%"
                label="名称"
              ></el-table-column>
              <el-table-column
                prop="icd10Encoding"
                min-width="40%"
                label="编码"
              ></el-table-column>
            </el-table>
          </el-popover>
        </div>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="line-height: 30px; margin-left: 1em">拼音码</span>
          <el-input
            v-model="myTemplate.pinyinCode"
            :disabled="vDisabled"
            readonly
            style="width: 280px; margin-left: 5px"
          ></el-input>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <span style="line-height: 30px; margin-left: 1em">五笔码</span>
          <el-input
            v-model="myTemplate.wubiCode"
            :disabled="vDisabled"
            readonly
            style="width: 280px; margin-left: 5px"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="line-height: 30px; margin-left: 1em">助记码</span>
          <el-input
            v-model="myTemplate.customCode"
            :disabled="vDisabled"
            style="width: 280px; margin-left: 5px"
          ></el-input>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <span style="line-height: 30px; margin-left: 1em">顺序号</span>
          <el-input
            v-model="myTemplate.sortNo"
            :disabled="vDisabled"
            style="width: 280px; margin-left: 5px"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px">
        <el-col :span="12">
          <span style="line-height: 30px">启用标识</span>
          <l-value-domain-emr
            disabled
            style="width: 280px; margin-left: 5px"
            code="ModelStatus"
            :value.sync="myTemplate.enabled"
            placeholder="请选择"
          ></l-value-domain-emr>
        </el-col>
      </el-row>
      <el-row style="margin-top: 12px; height: 50px">
        <el-col :span="24">
          <span style="margin-left: 2em; vertical-align: top">描述</span>
          <el-input
            type="textarea"
            :disabled="vDisabled"
            v-model="myTemplate.description"
            style="width: 735px; margin-left: 5px"
          />
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editModel" type="primary" @click="submitForm"
        >确定</el-button
      >
      <el-button v-if="editModel" @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getUId, getUN } from "@/utils/crypto";
import { getPamars } from "@/utils/auth";

import { getParagraphTypeOpt, getTypeByCode } from "@/api/emr/paragraphType";
import { getOrgDeptList } from "@/api/emrRecord/admin/user";

import { insert, update, getCd } from "@/api/emrRecord/emr/disease";
import {
  getIcd10DictionaryByKey,
  getAllIcd10Dictionary,
  getIcd10DictionaryPage,
} from "@/api/emrRecord/emr/paragraphType";

export default {
  props: {
    template: Object,
    //模板内容
    innerHtml: String,
    isShow: {
      type: Boolean,
      default: false,
    },
    //是否保存模板内容
    saveContent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // 是否可编辑
    vDisabled() {
      return false;
    },
    editModel() {
      return !this.vDisabled;
    },
    viewModel() {
      return this.vDisabled;
    },
    tlm_noMore() {
      return (
        Math.ceil(this.pageParams.total / this.pageParams.pageSize) <=
        this.pageParams.pageNo
      );
    },
  },
  watch: {
    template(obj) {
      console.log("obj====", obj);
      //复制
      if (Object.keys(obj).length > 0 && obj.diseasesCode) {
        this.myTemplate = { ...obj };
      } else {
        for (let key in this.myTemplate) {
          if (key === "icdDic") {
            this.myTemplate[key] = [];
          } else if (key === "enabled") {
            this.myTemplate[key] = "0";
          } else {
            this.myTemplate[key] = "";
          }
        }
        getCd()
          .then((res) => {
            this.myTemplate.diseasesCode = res.data;
          })
          .catch((res) => {
            this.$message({
              type: "error",
              message: res.msg,
            });
          });
      }
      this.changeOwner();
    },
    isShow() {
      this.dialogVisible = this.isShow;
    },
  },
  data() {
    return {
      filterText: "",
      tlm_isLoading: false,
      pageParams: {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      },
      popoverShow: false,
      popPlace: "right",
      listData: [],
      myTemplate: {
        customCode: "",
        dataVersion: 0,
        description: "",
        diseasesCode: "",
        diseasesId: "",
        diseasesName: "",
        hosCode: "",
        hosId: "",
        icdDic: [],
        icdList: "",
        orgCode: "",
        orgId: "",
        pinyinCode: "",
        sortNo: "",
        wubiCode: "",
        enabled: "0",
      },
      icdList: [],
      loading: false,
      ownNameOpt: [],
      diseaseOpt: [],
      ownerId: "",
      typeRemoteParams: {},
      remoteParams: { pageSize: 10 },
      dialogVisible: this.isShow,
      rules: {
        diseasesCode: [
          { required: true, message: "请输入编码", trigger: "blur" },
        ],
        diseasesName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleClosePop() {
      this.filterText = "";
      this.popoverShow = false;
    },
    dblclick(data) {
      // this.popoverShow = false;
      console.log(this.myTemplate.icdDic);
      // 判断是否是已存在疾病
      let flag = this.myTemplate.icdDic.findIndex(
        (item) => item.ICD10_ENCODING === data.icd10Encoding
      );
      if (flag >= 0) return;

      this.myTemplate.icdDic.push({
        ICD10_ENCODING: data.icd10Encoding,
        DICTIONARY_NAME: data.dictionaryName,
      });

      let arr = this.myTemplate.icdList.trim()
        ? this.myTemplate.icdList.split(",")
        : [];
      arr.push(data.icd10Encoding);
      this.myTemplate.icdList = this.changeIcdList(arr);
    },
    loadNextPage() {
      if (this.tlm_noMore || this.filterText != "") {
        this.tlm_isLoading = false;
        return;
      }
      this.pageParams.pageNo++;
      this.loadTable();
    },
    loadTable() {
      this.tlm_isLoading = true;
      getIcd10DictionaryPage({
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
      })
        .then((res) => {
          this.tlm_isLoading = false;

          if (res.code === 1) {
            this.listData = [...this.listData, ...res.data];
            this.pageParams = {
              pageNo: res.pageNo,
              pageSize: res.pageSize,
              total: res.total,
            };
          } else {
            this.$message.error("获取接口失败!");
            return;
          }
        })
        .catch((error) => {
          this.$message.error(error);
          this.tlm_isLoading = false;
        });
    },
    filterTextChanged() {
      if (this.filterText === "") {
        this.icdSelectPop();
      } else {
        this.tlm_isLoading = true;
        getIcd10DictionaryByKey(this.filterText)
          .then((res) => {
            this.tlm_isLoading = false;
            if (res.code === 1) {
              this.listData = res.data;
            } else {
              this.$message.error("获取接口失败!");
              return;
            }
          })
          .catch((error) => {
            this.$message.error(error);
            this.tlm_isLoading = false;
          });
      }
    },
    icdSelectPop() {
      this.listData = [];
      this.pageParams = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
      };
      this.loadTable();
    },
    handleClose(tag) {
      console.log(this.myTemplate.icdDic);
      this.myTemplate.icdDic = this.myTemplate.icdDic.filter(
        (item) => item.ICD10_ENCODING !== tag.ICD10_ENCODING
      );

      let arr = this.myTemplate.icdList.split(",");
      arr.splice(arr.indexOf(tag.ICD10_ENCODING), 1);
      this.myTemplate.icdList = this.changeIcdList(arr);
    },
    // 适用病重远程搜索
    remoteMethod(query) {
      getIcd10DictionaryByKey(query).then((resData) => {
        if (resData.code === 1 && resData.data) {
          this.diseaseOpt = resData.data;
        } else {
          this.$message.error("获取接口失败!");
          return;
        }
      });
    },
    // 改变icdList的格式
    changeIcdList(icdList) {
      if (icdList.length > 0) {
        return icdList.join(",");
      }
      return "";
    },
    //对话框关闭
    dialogClose() {
      this.$emit("update:isShow", false);
    },

    //确定
    submitForm() {
      if (
        this.myTemplate.diseasesCode == "" ||
        this.myTemplate.diseasesName == ""
      ) {
        this.$message.error("病种名称、病种编码");
        return;
      }
      let obj = {
        ownerId: this.ownerId,
      };

      let uId = this.myTemplate.diseasesId;
      this.myTemplate = { ...this.myTemplate, ...obj };

      if (uId == "" || uId == null || uId == undefined) {
        //new
        insert(this.myTemplate)
          .then((res) => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-save", res.data);
            } else {
              this.$message.error("操作失败：" + res.msg);
              return;
            }
          })
          .catch((res) => {
            this.$message({
              type: "error",
              message: res.msg,
            });
          });
      } else {
        update(this.myTemplate)
          .then((res) => {
            if (res.code === 1) {
              this.$message.success("操作成功");
              this.$emit("handle-update", this.myTemplate);
            } else {
              this.$message.error("操作失败：" + res.msg);
              return;
            }
          })
          .catch((res) => {
            this.$message({
              type: "error",
              message: res.msg,
            });
          });
      }
      this.dialogClose();
    },
    handleCancel() {
      this.dialogClose();
    },
    //根据所属级别变更所属名称可选项
    changeOwner() {
      if (this.myTemplate.scopeLevel == "0") {
        let hosId = JSON.parse(getPamars()).hosId;
        let hosName = JSON.parse(getPamars()).hosName;
        this.ownNameOpt = [{ id: hosId, orgNm: hosName }];
        this.myTemplate.ownerId = this.ownNameOpt[0].id;
        this.ownerId = this.ownNameOpt[0].id;
      } else if (this.myTemplate.scopeLevel == "1") {
        getOrgDeptList().then((res) => {
          if (res.code === 1) {
            this.ownNameOpt = res.data;
            this.myTemplate.ownerId = this.ownNameOpt[0].id;
            this.ownerId = this.ownNameOpt[0].id;
          } else {
            this.$message("请求数据失败");
            return;
          }
        });
      } else {
        this.ownNameOpt = [{ id: getUId(), orgNm: getUN() }];
        this.myTemplate.ownerId = this.ownNameOpt[0].id;
        this.ownerId = this.ownNameOpt[0].id;
      }
    },
    //医护标识下拉事件
    changeDnFlag() {
      if (this.myTemplate.dnFlag != "") {
        this.typeRemoteParams = { dnFlag: this.myTemplate.dnFlag };
      } else {
        this.typeRemoteParams = {};
      }
    },
  },
};
</script>

<style type="scss" scoped>
.myFormItem {
  width: 280px;
  display: inline-block;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
/deep/.el-form-item__content {
  margin-left: 0px !important;
}
.form-control {
  position: relative;
  width: 100px;
}
.form-control:before {
  content: "*";
  color: #f56c6c;
  position: absolute;
  top: 2px;
  left: -6px;
}
</style>
