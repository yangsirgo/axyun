<template>
  <div class="ResidentHealthRecordPage1">
    <el-form class="table_form" :rules="rules" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">居民健康档案</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" align="middle" justify="space-between">
          <el-col :span="8">
            <div>
              <LFormtTitle :required="true" label="执行医生">
                <el-select v-model="TableForm.exec_dr" placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="item in userOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </LFormtTitle>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="fr">
              <PFormTitle name="录入人" :val="status!='add'?TableForm.create_doc_user_name:userName" />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="fr">
              <PFormTitle name="录入时间" :val="status!='add'?TableForm.register_date:newDate" />
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
      </header>
      <main class="ResidentHealthRecordPage1_main">
        <PFormTitle class="mb-10 ml-5" name="电子健康档案编号" :val="TableForm.dig_doc_no" />
        <el-form-item style="width:320px">
          <LFormtTitle label="纸质档案编号" :required="true">
            <el-input
              :readonly="readonly"
              v-model="TableForm.pap_doc_no"
              style="line-height: 34px;"
            ></el-input>
          </LFormtTitle>
        </el-form-item>
        <el-form-item style="width:320px">
          <LFormtTitle label="姓名" :required="true">
            <el-input :readonly="readonly" v-model="TableForm.rsdt_name" style="line-height: 34px;"></el-input>
          </LFormtTitle>
        </el-form-item>
        <el-form-item style="width:320px">
          <LFormtTitle label="现住地址" :required="true">
            <el-input
              :readonly="readonly"
              v-model="TableForm.current_address"
              style="line-height: 34px;"
            ></el-input>
          </LFormtTitle>
        </el-form-item>
        <el-form-item style="width:320px">
          <LFormtTitle label="户籍地址" :required="true">
            <el-input
              :readonly="readonly"
              v-model="TableForm.hshd_rgst_addr"
              style="line-height: 34px;"
            ></el-input>
          </LFormtTitle>
        </el-form-item>
        <el-form-item style="width:320px">
          <LFormtTitle label="联系电话">
            <el-input :readonly="readonly" v-model="TableForm.telephone" style="line-height: 34px;"></el-input>
          </LFormtTitle>
        </el-form-item>
        <el-form-item style="width:320px">
          <LFormtTitle label="其他联系电话">
            <el-input
              :readonly="readonly"
              v-model="TableForm.other_phone"
              style="line-height: 34px;"
            ></el-input>
          </LFormtTitle>
        </el-form-item>
        <el-form-item style="width:320px">
          <l-formt-title :required="true" label="村(居)委会-网格">
            <el-cascader v-model="TableForm.orgGrid" :options="neighborhoodGridOptions" clearable></el-cascader>
          </l-formt-title>
        </el-form-item>
        <el-form-item style="width:320px">
          <LFormtTitle label="建档人" :required="true">
            <el-select disabled v-model="userID" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </LFormtTitle>
        </el-form-item>
        <el-form-item style="width:320px">
          <LFormtTitle label="责任医生" :required="true">
            <el-select @change="responsibleDrId" v-model="TableForm.responsible_dr_id" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in userOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </LFormtTitle>
        </el-form-item>
        <el-form-item style="width:320px">
          <LFormtTitle label="建档时间" :required="true">
            <el-input
              @change="DateConversion('create_doc_date', $event)"
              :readonly="readonly"
              v-model="TableForm.create_doc_date"
              style="line-height: 34px;"
            ></el-input>
          </LFormtTitle>
        </el-form-item>
        <PFormTitle
          class="mb-10 ml-5"
          name="建档单位"
          :val="status!='add'?TableForm.create_org_name:baseMes.hosName"
        />
        <PFormTitle
          class="mb-10 ml-5"
          name="当前单位"
          :val="status!='add'?TableForm.current_org_name:baseMes.hosName"
        />
        <PFormTitle
          class="mb-10 ml-5"
          name="登记时间"
          :val="status!='add'?TableForm.register_date:newDate"
        />
      </main>
    </el-form>
  </div>
</template>

<script>
import { onGet, onPost } from "@/api/public/public";
import {
  dateConversion,
  getBasicDetail,
  getCurrentTime_
} from "@/utils/common";
import { queryRegionAndGridByHospitalId } from "@/api/phss/region/grid_information";
import { getUserId, getPamars } from "@/utils/auth";
export default {
  name: "ResidentHealthRecordPage1",
  components: {},
  data() {
    return {
      newDate: getCurrentTime_(),
      baseMes: JSON.parse(getPamars()),
      userID: getBasicDetail().userId,
      userName: getBasicDetail().userName,
      // 是否只读
      readonly: false,
      // input最大个数
      maxLength: 0,
      // 状态 新增 查看 编辑  view edit
      status: this.$store.state.table.tableStatus,
      // 表单数据
      TableForm: {
        dig_doc_no: "", //电子健康档案编号
        create_org_id: "", //建档单位
        create_org_name: "",
        current_org_id: "", //当前单位
        current_org_name: "",
        register_date: "", //登记时间
        pap_doc_no: "", //纸质档案编号
        rsdt_name: "", //居民姓名
        current_address: "", //现住址
        hshd_rgst_addr: "", //户籍地址
        telephone: "", //联系电话
        other_phone: "", //其他联系电话
        cmnt_cmt_id: "", //村居委会id
        responsible_dr_id: "", //责任医生id
        create_doc_date: "", //建档时间
        exec_dr: "", //执行医生
        create_doc_user_name: "", //创建人名称
        orgGrid: [],
        create_org_phone: ''
      },
      rules: {
        checkup_date: [
          { required: true, message: "checkup_date", trigger: "blur" }
        ]
      },
      //--- Options ---
      neighborhoodGridOptions: [],
      userOptions: []
    };
  },
  created() {
    console.log("this.status", this.status);
    this.EchoMethod();
    this.onQueryUsersByHosId(null, "user");
    this.onqueryRegionAndGridByHospitalId(null);
    this.getCurrentOrgPhont();
  },
  mounted() {
    if (this.status != "view") {
      this.init();
    }
  },
  methods: {
    emptyData(){
              this.TableForm.pap_doc_no = "";
              this.TableForm.rsdt_name = "";
              this.TableForm.current_address = "";
              this.TableForm.hshd_rgst_addr = "";
              this.TableForm.other_phone = "";
              this.TableForm.cmnt_cmt_id = "";
              this.TableForm.responsible_dr_id = "";
              this.TableForm.exec_dr = "";
              this.TableForm.orgGrid = "";
              this.TableForm.create_org_phone = "";
              this.TableForm.telephone = "";
              this.TableForm.create_doc_date = "";
    },
    submitForm(formName) {
      return [];
      // console.log("this.form", this.form);
      // this.$refs.refForm.validate(valid => {
      //   if (valid) {
      //     alert("submit!");
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    },
    // getCurrentOrgPhont
    getCurrentOrgPhont(){
      onPost({
        url: "/phss/docIndex/getCurrentOrgPhont"
      })
        .then(res => {
          console.log(res);
          if (res.code === 1) {
            this.TableForm.create_org_phone = res.data;
          } else {
            console.log("error", res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    responsibleDrId(event){
        for(var i = 0;i < this.userOptions.length;i++){
          if(event == this.userOptions[i].id){
              this.TableForm.mobile = this.userOptions[i].mobile;
          }
        }
        console.log(event)
    },
    onQueryUsersByHosId(hosId, flg) {
      onPost({
        url: "/phss/sysPublic/onQueryUsersByHosId",
        data: { hosId: hosId }
      })
        .then(res => {
          console.log(res);
          if (res.code === 1) {
            this.userOptions = res.data;
          } else {
            console.log("error", res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 查询选项
    onqueryRegionAndGridByHospitalId(hospitalId) {
      queryRegionAndGridByHospitalId({
        hospitalId: hospitalId
      })
        .then(res => {
          console.log(res);
          if (res.code === 1) {
            // if (flg == "dr") {
            this.neighborhoodGridOptions = res.data;

          } else {
            console.log(res);

          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    init() {
      console.log("初始化");
      setTimeout(() => {
        this.initInput();
        this.addEnterListener();
      }, 10);
    },
    initInput() {
      // let val = document.getElementsByClassName("el-input--medium");
      let val = document
        .querySelector("#tableDialog")
        .getElementsByClassName("el-input--medium");
      for (var i = 0; i < val.length; i++) {
        // 给每个input添加id
        val[i].children[0].setAttribute("id", "elinput" + (i + 1));
        // 添加唯一index
        val[i].children[0].intpuIndex = i + 1;
      }
      // 获取最大input数   设置最大长度保证回车不会溢出
      this.maxLength = val.length;
      console.log("val.length", val.length);
      let temp = document.getElementById("elinput1");
      if (this.status == "add") {
        temp.focus();
      }
      // const obj = {};
      // for (const prop in temp) {
      //   obj[prop] = temp[prop];
      // }
      // console.log(obj);
    },
    // 监听回车事件具体方法
    listenEnterEvent(e) {
      // console.log("listenEnterEvent", e);
      let tempIndex = e.target.intpuIndex;
      if (e.keyCode === 13) {
        // if ((e.ctrlKey && e.keyCode == 13) || (e.shiftKey && e.keyCode == 13)) {
        if (e.shiftKey && e.keyCode == 13) {
          if (tempIndex == 1) {
            return;
          }
          tempIndex--;
        } else {
          if (this.maxLength == tempIndex) {
            return;
          }
          tempIndex++;
        }
        let temp = document.getElementById("elinput" + tempIndex);
        // 设置焦点
        temp.focus();
        // const obj = {};
        // for (const prop in temp) {
        //   obj[prop] = temp[prop];
        // }
        // console.log("huiche", obj);
      }
    },
    // 开启键盘监听事件
    addEnterListener() {
      if (window.__completeEnterBind__) {
        return;
      }
      window.addEventListener("keydown", this.listenEnterEvent);
      window.__completeEnterBind__ = true;
    },
    // 移除键盘监听事件
    removeEnterListener() {
      console.log("移除键盘监听事件");
      window.removeEventListener("keydown", this.listenEnterEvent);
      window.__completeEnterBind__ = false;
    },
    // dateConversion 日期转换
    DateConversion(val, e) {
      console.log("val", val);
      console.log("e", e);
      if (this.TableForm[val].length == 8) {
        this.TableForm[val] = dateConversion(this.TableForm[val]);
      }
    },
    // 复选框 input 联动
    childVal(val, key) {
      this.TableForm[key] = "";
      let temp = [];
      val.forEach(el => {
        if (el.value != "") {
          temp.push(el.value);
        }
      });
      temp = temp.join(",");
      this.TableForm[key] = temp;
    },
    otherVal(val, key) {
      console.log("key", key);
      this.TableForm[key] = val;
      console.log(`this.TableForm.${key}`, this.TableForm[key]);
    },
    // 返显方法
    EchoMethod() {
      console.log(
        "tableConfiguration**************",
        this.$store.state.table.tableConfiguration
      );
      console.log("表格状态99999999", this.$store.state.table.tableStatus);
      console.log("this.status", this.status);
      let tableConfiguration = {};
      if (this.status == "add") {
         this.TableForm.create_org_name = this.baseMes.hosName
        return;
      }
      if (this.status == "view") {
        tableConfiguration = this.$store.state.table.viewTableConfiguration;
        console.log("view数据返显", tableConfiguration);
      }
      if (this.status == "edit") {
        tableConfiguration = this.$store.state.table.tableConfiguration;
        console.log("edit数据返显", tableConfiguration);
      }
      for (let obj in this.TableForm) {
        this.TableForm[obj] = tableConfiguration.editData[obj];
      }
      if (tableConfiguration.editChObject == undefined) {
        return;
      }

      let editChObject = JSON.parse(tableConfiguration.editChObject);
      // console.log("tableConfiguration.editChObject", editChObject);
      for (let obj in this.chObject) {
        this.chObject[obj] = editChObject[obj];
      }
      this.userID = this.status == 'add' ? UserId : this.TableForm.create_doc_user_name
      console.log("this.TableForm回显数据1", this.TableForm);
      console.log("this.chObject", this.chObject);
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
.ResidentHealthRecordPage1 {
  .el-divider--horizontal {
    margin-top: 10px;
  }
  .ResidentHealthRecordPage1_main {
    margin-left: 247px;
    .el-form-item {
      margin-bottom: 30px;
    }
    /deep/.el-form-item__error {
      padding-top: 10px;
      padding-left: 3px;
    }
  }
}
</style>
