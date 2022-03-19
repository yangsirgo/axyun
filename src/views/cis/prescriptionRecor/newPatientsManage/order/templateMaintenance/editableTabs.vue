<template>
  <div class="height100" v-loading="pageLoading">
    <el-form
      :model="utils"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      :inline="true"
    >
      <el-form-item label="" prop="search">
        <l-formt-title label="模板名称">
          <el-input
            v-model="utils.search"
            placeholder="请输入内容"
            @clear="resetOnSubmit"
            @keyup.native.enter="onSubmit"
            clearable
          ></el-input>
        </l-formt-title>
      </el-form-item>
      <el-form-item label="" prop="search">
        <l-formt-title label="模板的医嘱类型">
          <!-- <l-value-domain
          clearable type="select"

          remoteShowKey="uname"
          remoteValueKey="uid"
          placeholder
          style="width:100%"
          ></l-value-domain> -->
          <l-value-domain
            clearable
            remoteUrl="/doctorsAdvice/getListOn"
            type="select"
            :remoteParams="remoteParams"
            :value.sync="utils.templetType"
            remoteShowKey="doctorsAdviceName"
            remoteValueKey="doctorsAdviceCode"
          ></l-value-domain>
        </l-formt-title>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <!--<el-button @click="resetOnSubmit">重置查询</el-button>-->
        <el-button @click="addClick">新增</el-button>
        <el-button @click="addTableRow">新增明细</el-button>
        <el-button v-if="activeTab !== '2'" @click="copyOrder">复制</el-button>
        <el-button @click="deleteHandler">删除明细</el-button>
        <!--<el-button-->
        <!--@click="bunchingHandler"-->
        <!--class="filter-item"-->
        <!--type="text"-->
        <!--icon="iconfont iconchengzu"-->
        <!--v-hotKey="{ func: 'func_grouping' }"-->
        <!--&gt;成组</el-button>-->
        <!--<el-button-->
        <!--@click="cancelBunching"-->
        <!--class="filter-item"-->
        <!--type="text"-->
        <!--icon="iconfont iconquxiaochengzu"-->
        <!--v-hotKey="{ func: 'cancel_grouping' }"-->
        <!--&gt;取消成组</el-button>-->
      </el-form-item>
    </el-form>
    <div
      v-if="editableTabs.length === 0"
      style="text-align: center; margin-top: 15vh"
    >
      暂无数据
    </div>
    <el-tabs
      tab-position="left"
      v-else
      v-model="activeTabsValue"
      closable
      style="height: calc(100% - 48px)"
      @tab-click="tabClickHandler"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="index"
        :name="item.tabsValue"
        lazy
      >
        <span slot="label" class="labelPart">
          <el-tooltip class="item" placement="right" effect="dark">
            <div slot="content">
              <div>模板名称:{{ item.name }}</div>
              <!-- <div>通用范围:<span :val="item.templetRange" code="AntimicrobialRanges" v-codeTransform></span></div> -->
              <div>
                通用范围:
                <span
                  v-for="(item1, index) in item.templetRange
                    ? item.templetRange.split(',')
                    : []"
                  :key="index"
                >
                  <span
                    :val="item1"
                    code="AntimicrobialRanges"
                    v-codeTransform
                  ></span
                  ><span v-if="index < item.templetRange.split(',').length - 1"
                    >,</span
                  >
                </span>
              </div>
              <div>
                医嘱类型:<span
                  columns="doctors_advice_name"
                  :conditionMap="{
                    doctors_advice_code: item.templetType || null,
                  }"
                  tableName="cnf_doctors_advice"
                  v-tableTransform
                ></span>
              </div>
            </div>
            <span class="title-text fl ellipsis" style="">{{ item.name }}</span>
          </el-tooltip>

          <span
            class="edit-icon"
            style="padding-left: 8px"
            @click.stop="editLabel(item)"
            ><i class="el-icon-edit"></i
          ></span>
        </span>
        <!--<component is="tableEditor" :data="item.outpatientCisTempDetailPOList" :templetId="item.id" :ref="'tablePart' + item.tabsValue"></component>-->
        <div class="height100" v-if="activeTabsValue === item.tabsValue">
          <component
            v-bind:is="tableComponents"
            :templetType="item.templetType"
            :templetId="item.id"
            :reloadMainTableKey="reloadMainTableKey"
            :ref="'tablePart' + item.tabsValue"
            :typeDisable.sync="typeDisable"
          ></component>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="dialogEditInfo.title" :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        class="tempDialogs"
        :model="form"
        :rules="diaFormRules"
        v-loading="dialogLoading"
      >
        <el-form-item label="" prop="firstCategoryCode">
          <l-formt-title label="模板分类">
            <el-select v-model="form.firstCategoryCode" placeholder="请选择模板分类" clearable>
              <el-option
                v-for="(item,index) in firstCategoryCodeOptions"
                :key="index"
                :label="item.dictionaryName"
                :value="item.dictionaryValue">
              </el-option>
            </el-select>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="name">
          <l-formt-title label="模板名称" :required="true">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入模板名称"></el-input>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="templetType">
          <l-formt-title
            label="医嘱类型"
            :required="true"
            :disabled="typeDisable"
          >
            <l-value-domain
              v-if="dialogFormVisible"
              :disabled="typeDisable"
              clearable
              remoteUrl="/doctorsAdvice/getListOn"
              type="select"
              :remoteParams="remoteParams"
              :value.sync="form.templetType"
              remoteShowKey="doctorsAdviceName"
              remoteValueKey="doctorsAdviceCode"
            ></l-value-domain>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="ouptDeptId" v-if="activeTab === '1'">
          <l-formt-title class="form-item" label="模板所属科室">
            <l-value-domain
              code=""
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="form.ouptDeptId"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择科室"
              @change="ouptDeptIdChange"
            ></l-value-domain>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="recordType">
          <l-formt-title label="使用范围">
            <l-value-domain
              code="AntimicrobialRanges"
              multiple
              :value.sync="form.recordType"
              placeholder="请选择使用范围"
              @change="recordTypeChange"
            ></l-value-domain>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="categoryCode" v-if="isCheckedCatShow">
          <l-formt-title label="医嘱类别" :required="true">
            <l-value-domain
              code="category_Code"
              :value.sync="form.categoryCode"
              placeholder="请选择医嘱类别"
              @change="handleCheckedCatChange"
            ></l-value-domain>
          </l-formt-title>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="复制模板" :visible.sync="copyDialog">
      <el-form
        ref="copyDialogRuleForm"
        class="tempDialogs"
        :model="copyForm"
        :rules="copyFormRules"
        v-loading="dialogLoading"
      >
        <!--<el-form-item label="" prop="name">-->
        <!--<l-formt-title label="模板名称" :required="true">-->
        <!--&lt;!&ndash;<el-input v-model="copyForm.name" autocomplete="off"></el-input>&ndash;&gt;-->
        <!--<el-select v-model="copyForm.name" placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="item in editableTabs"-->
        <!--:key="item.id"-->
        <!--:label="item.templetName"-->
        <!--:value="item.id">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</l-formt-title>-->
        <!--</el-form-item>-->
        <el-form-item label="" prop="firstCategoryCode">
          <l-formt-title label="模板分类">
            <el-select v-model="copyForm.firstCategoryCode" placeholder="请选择模板分类" clearable>
              <el-option
                v-for="(item,index) in firstCategoryCodeOptions"
                :key="index"
                :label="item.dictionaryName"
                :value="item.dictionaryValue">
              </el-option>
            </el-select>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="name">
          <l-formt-title label="模板名称" :required="true">
            <el-input v-model="copyForm.name" autocomplete="off"></el-input>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="recordType">
          <l-formt-title label="使用范围" :required="true">
            <l-value-domain
              code="AntimicrobialRanges"
              multiple
              :value.sync="copyForm.recordType"
              placeholder="请选择使用范围"
              @change="recordTypeChange"
            ></l-value-domain>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="categoryCode" v-if="isCheckedCatShow">
          <l-formt-title label="医嘱类别" :required="true">
            <l-value-domain
              code="category_Code"
              :value.sync="copyForm.categoryCode"
              placeholder="请选择医嘱类别"
              @change="handleCheckedCatChange"
            ></l-value-domain>
          </l-formt-title>
        </el-form-item>
        <el-form-item
          label=""
          prop="ouptDeptId"
          v-if="copyForm.shareLevelValue === '1'"
        >
          <l-formt-title
            class="form-item"
            label="模板所属科室"
            :required="true"
          >
            <l-value-domain
              remoteUrl="/wadmin/hos/dept"
              type="select"
              :value.sync="copyForm.ouptDeptId"
              remoteShowKey="orgNm"
              remoteValueKey="id"
              placeholder="请选择科室"
              @change="ouptDeptIdChange"
            ></l-value-domain>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="" prop="shareLevelValue">
          <l-formt-title class="form-item" label="复制到" :required="true">
            <el-select v-model="copyForm.shareLevelValue" placeholder="请选择">
              <el-option
                style="padding: 0 20px !important"
                v-for="item in shareLevel"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </l-formt-title>
        </el-form-item>
        <el-form-item label="操作人" prop="recordType">
          <span>{{ copyForm.person }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="copyDialog = false">取 消</el-button>
        <el-button type="primary" @click="copyConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getToken,
  setToken,
  removeToken,
  setPamars,
  removePamars,
  setUserId,
  removeUserId,
  setUserName,
  getUserName,
  removeUserName,
  setRoles
} from "@/utils/auth";
import Base64 from "@/utils/base64.js";
import tableEditor from "./tableEditor.vue";
import {
  getListByTypeAndName,
  deleteByTemplateId,
  copyTemplate,
  createEditTemplate
} from "@/api/cis/order/order";
import { getRole } from "@/utils/auth.js";
import getFirstCategoryCodeOptionsMinxin from "@/views/cis/prescriptionRecor/newPatientsManage/order/templateMaintenance/getFirstCategoryCodeOptions.js";

export default {
  name: "editableTabs",
  mixins: [getFirstCategoryCodeOptionsMinxin],
  components: { tableEditor },
  props: {
    activeTab: {
      default: "personal"
    }
  },
  data() {
    return {
      typeDisable: false,
      tableComponents: tableEditor,
      reloadMainTableKey: "",
      remoteParams: { pageSize: 10, parentId: "0" }, // 分页参数,医嘱大类参数
      pageLoading: false,
      copyDialog: false,
      utils: {
        search: "",
        templetType: ""
      },
      rules: {
        search: []
      },
      editableTabs: [],
      activeTabsValue: "1",
      tabIndex: 1,
      dialogFormVisible: false,
      dialogLoading: false,
      shareLevel: [
        {
          value: "0",
          label: "全院模板"
        },
        {
          value: "1",
          label: "科室模板"
        },
        {
          value: "2",
          label: "个人模板"
        }
      ],
      form: {
        firstCategoryCode: "",
        name: "",
        categoryCode: "",
        recordType: [],
        templetType: "",
        ouptDeptId: ""
      },
      copyForm: {
        firstCategoryCode: "",
        person: Base64.decode(getUserName()),
        shareLevelValue: "",
        name: "",
        ouptDeptId: "",
        recordType: [],
        categoryCode: ""
      },
      copyFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        shareLevelValue: [
          { required: true, message: "请选择复制项", trigger: "change" }
        ],
        ouptDeptId: [
          { required: true, message: "请选择科室", trigger: "blur" }
        ],
        recordType: [
          { required: true, message: "请选择使用范围", trigger: "blur" }
        ],
        categoryCode: [
          { required: true, message: "请选择医嘱类别", trigger: "change" }
        ]
      },
      diaFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        templetType: [
          { required: true, message: "请选择医嘱类型", trigger: "blur" }
        ],
        categoryCode: [
          { required: true, message: "请选择医嘱类别", trigger: "change" }
        ]
      },
      isCheckedCatShow: true,
      dialogEditInfo: {
        title: "新增",
        id: ""
      }
    };
  },
  created() {
    let hosId = JSON.parse(localStorage.getItem("pamars")).hosIdNum;
    this.getFirstCategoryCodeOptions({
      catalogCode: "CIS_OUTAPTIENT_MB",
      hosId
    })
    this.getListByTypeAndName();
    let role =
      typeof getRole("role") !== "undefined"
        ? JSON.parse(getRole("role"))
        : false;
    this.form.ouptDeptId = role.deptId;
  },
  mounted() {},
  methods: {
    copyOrder() {
      let templetObj = this.editableTabs.find(item => {
        return item.tabsValue === this.activeTabsValue;
      });

      if (!templetObj) {
        this.$message.info("没有需要复制的标签页！");
        return;
      }

      if (!templetObj.id) {
        this.$message.info("请选择需要复制的标签页");
        return;
      }
      this.copyDialog = true;
      this.$refs["copyDialogRuleForm"] &&
        this.$refs["copyDialogRuleForm"].resetFields();
      // this.copyForm.ouptDeptId = templetObj.ouptDeptId;
      // this.copyForm.recordType = templetObj.recordType;
      // this.copyForm.categoryCode = templetObj.categoryCode;
    },
    cancelBunching() {},
    bunchingHandler() {},
    deleteHandler() {
      let refs = this.$refs["tablePart" + this.activeTabsValue];
      refs[0] && refs[0].deleteHandler();
    },
    addTableRow() {
      let refs = this.$refs["tablePart" + this.activeTabsValue];

      if (refs) {
        refs[0] && refs[0].addRow();
      } else {
        this.$message.info("请先新增标签页");
      }
    },
    recordTypeChange(value) {
      if (value.indexOf("3") >= 0) {
        //住院显示
        this.isCheckedCatShow = true;
      } else {
        this.isCheckedCatShow = false;
      }
    },
    ouptDeptIdChange(value, a) {},
    editLabel(item) {
      this.dialogFormVisible = true;
      this.$refs["ruleForm"].clearValidate();
      this.$nextTick(() => {
        for (let key in this.form) {
          this.form[key] = item[key];
          if (key === "ouptDeptId") {
            this.form[key] = Number(item[key]);
          }
        }
      });
      this.dialogEditInfo.id = item.id;
    },
    copyConfirm() {
      this.$refs["copyDialogRuleForm"].validate(async valid => {
        if (valid) {
          let templetObj = this.editableTabs.find(item => {
            return item.tabsValue === this.activeTabsValue;
          });
          if (!templetObj.id) {
            this.$message.info("请需要复制的标签页");
            return;
          }
          let params = {
            firstCategoryCode: this.copyForm.firstCategoryCode,
            templetName: this.copyForm.name,
            shareLevel: this.copyForm.shareLevelValue,
            id: templetObj.id,
            templetRange: String(this.copyForm.recordType) || null,
            templetType: templetObj.templetType,
            categoryCode: this.copyForm.categoryCode
          };

          if (this.activeTab === "1") {
            params.ouptDeptId = this.copyForm.ouptDeptId;
          }
          // params = {...templetObj, ...params};
          // let result = await copyTemplate(JSON.stringify(params));
          let result = await copyTemplate(params);
          if (result.code === 1) {
            this.$message.success("复制成功");
            this.getListByTypeAndName();
            this.activeTabsValue = "1";
            this.copyDialog = false;
          } else {
            this.$message.error(result.msg || "复制失败");
          }
        } else {
          return false;
        }
      });
    },
    removeTab(name) {
      this.$confirm("确认删除吗？")
        .then(async () => {
          let findObj = this.editableTabs.find(item => {
            return item.tabsValue === name;
          });
          if (!findObj) return;
          let result = await deleteByTemplateId({ id: findObj.id });
          if (result.code === 1) {
            this.$message.success("删除成功");
            this.getListByTypeAndName();
            this.activeTabsValue = "1";
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch(_ => {});
    },
    addClick() {
      this.typeDisable = false;
      this.dialogFormVisible = true;
      let self = this;
      this.$nextTick(() => {
        self.$refs["ruleForm"].resetFields();
        self.form.categoryCode = "";
      });

      this.dialogEditInfo.id = "";
    },
    async onSubmit() {
      this.activeTabsValue = "666";
      try {
        let result = await this.getListByTypeAndName();
        if (result) {
          this.activeTabsValue = "1";
        }
      } catch (error) {}
    },
    resetOnSubmit() {
      this.activeTabsValue = "1";
      this.utils.search = "";
      // this.utils.templetType = "";
      this.getListByTypeAndName();
    },
    handleCheckedCatChange(value) {},
    async createEditTemplate() {
      let obj = {
        firstCategoryCode: this.form.firstCategoryCode,
        templetName: this.form.name,
        templetRange: String(this.form.recordType) || null,
        categoryCode: this.form.categoryCode,
        shareLevel: this.activeTab,
        templetType: this.form.templetType
      };

      if (this.dialogEditInfo.id) {
        let current = this.editableTabs.find(item => {
          return item.id === this.dialogEditInfo.id;
        });
        obj = { ...current, ...obj };
      }

      if (this.activeTab === "1") {
        obj.ouptDeptId = this.form.ouptDeptId;
      }

      try {
        this.dialogLoading = true;
        let result = await createEditTemplate(obj);
        if (result.code === 1) {
          // console.log(result);
          // let listLength = this.editableTabs.length;
          // let newTabName = ++listLength + '';
          // let pushObj = {...{name: "", tabsValue: newTabName}, ...this.form};
          // this.editableTabs.push(pushObj);

          this.dialogFormVisible = false;
          this.utils.search = "";
          this.utils.templetType = "";

          try {
            let result = await this.getListByTypeAndName();
            if (result) {
              let activeName = this.form.name;
              let activeTabsItem = this.editableTabs.find(item => {
                return item.name === activeName;
              });
              try {
                if (!this.dialogEditInfo.id) {
                  this.activeTabsValue = activeTabsItem.tabsValue;
                }
              } catch (e) {
                console.log("设置activeTabsValue 错误");
              }
            }
          } catch (e) {}
        } else {
          this.$message.error(result.msg || "获取数据错误");
        }
        this.dialogLoading = false;
      } catch (e) {
        this.dialogLoading = false;
        this.$message.error(e.msg || "获取数据错误");
      }
    },
    async confirm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.createEditTemplate();
        } else {
          return false;
        }
      });
    },
    async getListByTypeAndName() {
      this.pageLoading = true;
      let obj = {
        name: this.utils.search,
        templetType: this.utils.templetType,
        shareLevel: this.activeTab
      };
      return new Promise(async (resolve, reject) => {
        try {
          let result = await getListByTypeAndName(obj);
          if (result.code === 1) {
            this.editableTabs = result.data.map((item, index) => {
              let obj = {
                name: item.templetName,
                tabsValue: "" + (index + 1),
                categoryCode: "",
                recordType: item.templetRange
                  ? item.templetRange.split(",")
                  : [] // 默认是住院
              };
              return { ...obj, ...item };
            });
            this.reloadMainTableKey = +new Date();
            resolve(true);
          } else {
            this.$message.error(result.msg || "获取数据错误");
            reject("该prormise已被拒绝");
          }
          this.pageLoading = false;
        } catch (e) {
          this.pageLoading = false;
          this.$message.error(e.msg || "获取数据错误");
          reject(e);
        }
      });
    },
    tabClickHandler() {
      this.reloadMainTableKey = +new Date();
    }
  },
  watch: {
    activeTab(n, o) {
      this.getListByTypeAndName();
    },
    "dialogEditInfo.id"(n, o) {
      if (n) {
        this.dialogEditInfo.title = "编辑";
      } else {
        this.dialogEditInfo.title = "新增";
      }
    },
    copyDialog(n, o) {
      if (n) {
        this.$nextTick(() => {
          if (this.form.recordType.indexOf("3") >= 0) {
            this.isCheckedCatShow = true;
          } else {
            this.isCheckedCatShow = false;
          }
        });
      } else {
        this.isCheckedCatShow = false;
      }
    },
    dialogFormVisible(n, o) {
      if (n) {
        this.$nextTick(() => {
          if (this.form.recordType.indexOf("3") >= 0) {
            this.isCheckedCatShow = true;
          } else {
            this.isCheckedCatShow = false;
          }
        });
      } else {
        this.isCheckedCatShow = false;
      }
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
.demo-ruleForm {
  padding: 8px 0px;
}

/deep/ .el-tabs--left .el-tabs__item.is-left {
  writing-mode: unset !important;
  padding: 10px !important;
  width: auto !important;
  max-width: 200px;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tempDialogs {
  padding: 30px 30px 0;

  > .el-form-item {
    margin-bottom: 22px !important;
  }
}

.labelPart {
  .title-text {
    width: 180px;
    text-align: left;
  }
  .edit-icon {
    visibility: hidden;
  }
}
.labelPart + /deep/.el-icon-close {
  visibility: hidden;
}

/deep/.is-active .edit-icon {
  visibility: visible;
}

/deep/.is-active .title-text {
  width: 130px !important;
}

/deep/.is-active .el-icon-close {
  visibility: visible;
}

/*/deep/.el-select-dropdown__item.is-disabled {*/
/*!important;*/
/*}*/
</style>
