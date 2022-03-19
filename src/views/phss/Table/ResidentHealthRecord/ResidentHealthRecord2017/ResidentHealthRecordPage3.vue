<template>
  <div>
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">居民健康档案信息卡</div>
          </el-col>
        </el-row>
      </header>
      <main class="table_main">
        <el-row class="lh24">
          <el-col :span="3">
            <div class="center">姓名</div>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input
                v-if="!readonly"
                readonly
                v-model="TableForm.rsdt_name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <div class="center">性别</div>
          </el-col>
          <el-col :span="5">
            <div class="pl-10">
              <div v-if="TableForm.gender == '1'">男</div>
              <div v-if="TableForm.gender == '2'">女</div>
              <div v-if="TableForm.gender == '9'">未说明的性别</div>
              <div v-if="TableForm.gender == '0'">未知的性别</div>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">出生日期</div>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input
                @change="DateConversion"
                v-if="!readonly"
                readonly
                v-model="TableForm.birthday"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center">健康档案编号</div>
          </el-col>
          <el-col :span="20">
            <div class="center">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.dig_doc_no"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center">AOB血型</div>
          </el-col>
          <el-col :span="8">
            <div class="pl-10">
              <div v-if="TableForm.blood_type == '1'">A型</div>
              <div v-if="TableForm.blood_type == '2'">B型</div>
              <div v-if="TableForm.blood_type == '3'">O型</div>
              <div v-if="TableForm.blood_type == '4'">AB型</div>
              <div v-if="TableForm.blood_type == '5'">不详</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="center">RH血型</div>
          </el-col>
          <el-col :span="8">
            <div class="pl-10">
              <div v-if="TableForm.blood_type_rh == '1'">阴性</div>
              <div v-if="TableForm.blood_type_rh == '2'">阳性</div>
              <div v-if="TableForm.blood_type_rh == '3'">不详</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="pl-10">慢性病患病情况：</div>
            <div class="lh20 padding-10 text_left">
              <PCheckbox
                @childValInput="childVal"
                @otherValInput="otherVal"
                :readonly="readonly"
                :formKey="'chronic'"
                :otherKey="'chronic_other'"
                :otherData="TableForm.chronic_other"
                :checkboxOptions="DrinkingTypesOptions"
                :checkboxForm="chObject.chronic"
                :clearFlag="clearFlag"
              />
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="lh90" :span="24">
            <div class="pl-10">过敏史：</div>
            <el-form-item class="padding-5">
              <el-input
                type="textarea"
                :rows="2"
                v-model="TableForm.allegry_history_text"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="2">
            <div class="center">特殊人群</div>
          </el-col>
          <el-col :span="22">
            <div class="pl-10">特殊人群慢性病患病情况：</div>
            <div class="lh20 padding-10 text_left">
              <PCheckbox
                @childValInput="childVal"
                @otherValInput="otherVal"
                :readonly="readonly"
                :formKey="'drinking_type'"
                :otherKey="'drinking_type_other'"
                :otherData="TableForm.drinking_type_other"
                :checkboxOptions="DrinkingTypesOptions2222"
                :checkboxForm="chObject.drinking_type"
              />
            </div>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="4">
            <div class="center">家庭住址</div>
          </el-col>
          <el-col :span="8">
            <div class="center">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.current_address"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="center">家庭电话</div>
          </el-col>
          <el-col :span="8">
            <div class="center">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.telephone"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center">紧急情况联系人</div>
          </el-col>
          <el-col :span="8">
            <div class="center">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.contact_person"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="center">联系人电话</div>
          </el-col>
          <el-col :span="8">
            <div class="center">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.contact_person_phone"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center">建档机构名称</div>
          </el-col>
          <el-col :span="8">
            <div class="center">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="false"
                  v-model="TableForm.create_org_name"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="center">联系人电话</div>
          </el-col>
          <el-col :span="8">
            <div class="center">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="true"
                  v-model="TableForm.create_org_phone"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="center">责任医生或护士</div>
          </el-col>
          <el-col :span="8">
            <div class="center">
              <el-form-item>
               <!-- <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.create_doc_user_name"
                ></el-input> -->
                <el-select v-model="TableForm.responsible_dr_id" disabled placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="item in userOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="center">联系人电话</div>
          </el-col>
          <el-col :span="8">
            <div class="center">
              <el-form-item>
                <el-input
                  v-if="!readonly"
                  :readonly="true"
                  v-model="TableForm.responsible_dr_phone"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="lh90" :span="24">
            <div class="pl-10">其他说明：</div>
            <el-form-item class="padding-5">
              <el-input
                type="textarea"
                :rows="2"
                v-model="TableForm.other"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </main>
    </el-form>
  </div>
</template>

<script>
import { dateConversion } from "@/utils/common";
import { onGet, onPost } from "@/api/public/public";
export default {
  name: "HealthChecklistPage1",
  components: {},
  data() {
    return {
      AllStepData: {},
      // 是否只读
      readonly: false,
      // input最大个数
      maxLength: 0,
      // 状态 新增 查看 编辑  view edit
      status: this.$store.state.table.tableStatus,
      // 清楚判断按钮
      clearFlag: false,
      // 表单数据
      TableForm: {
        rsdt_name: "", //居民姓名
        gender: "", //性别
        birthday: "", //生日
        dig_doc_no: "", //电子健康档案编号
        blood_type: "", //血型
        blood_type_rh: "", //RH
        chronic: "", //慢性病情况
        chronic_other: "", //其他疾病
        allegry_history_text: "", //过敏史
        current_address: "", //现住址
        telephone: "", //家庭电话
        contact_person: "", //紧急情况联系人
        contact_person_phone: "", //联系人电话
        create_org_id: "", //建档机构名称
        create_org_phone: "", //建档机构电话
        responsible_dr_id: "", //责任医生或护士id
        create_doc_user_name: "", //责任医生或护士姓名
        responsible_dr_phone: "", //责任医生或护士电话
        other: "" //其他说明
      },
      // --- checkbox Data ---
      DrinkingTypesOptions: [
        { id: "1", content: "无" },
        { id: "2", content: "高血压" },
        { id: "3", content: "糖尿病" },
        { id: "4", content: "脑卒中" },
        { id: "5", content: "冠心病" },
        { id: "6", content: "哮喘" },
        { id: "7", content: "职业病" },
        { id: "8", content: "其他疾病" }
      ],
      DrinkingTypesOptions2222: [
        { id: "1", content: "患风湿关节炎" },
        { id: "2", content: "关节病" },
        { id: "3", content: "重性精神障碍" },
        { id: "4", content: "急性脑血管疾病后遗症" },
        { id: "5", content: "慢性阻塞性肺疾病" },
        { id: "6", content: "肺源性心脏病" },
        { id: "7", content: "糖尿病" },
        { id: "8", content: "结核病" },
        { id: "9", content: "风湿性心脏病" },
        { id: "10", content: "老年性痴呆" },
        { id: "11", content: "心脏病并发心功能不全" },
        { id: "12", content: "冠状动脉粥样硬化性心脏病" },
        { id: "13", content: "心肌病" },
        { id: "14", content: "血友病" },
        { id: "15", content: "慢性支气管炎结核病" },
        { id: "16", content: "支气管哮喘" },
        { id: "17", content: "肾病综合征" },
        { id: "18", content: "慢性肾功能不全" },
        { id: "19", content: "慢性肾炎" },
        { id: "20", content: "强制性脊柱炎" },
        { id: "21", content: "癫痫" },
        { id: "22", content: "肝硬化" },
        { id: "23", content: "慢性活动性肝炎" },
        { id: "24", content: "丙型病毒性肝炎" },
        { id: "25", content: "高血压" },
        { id: "26", content: "系统性红斑狼疮" },
        { id: "27", content: "再生障碍性贫血" },
        { id: "28", content: "白血病" },
        { id: "29", content: "甲状腺功能减退" },
        { id: "30", content: "甲亢" },
        { id: "31", content: "帕金森" },
        { id: "32", content: "重症肌无力" },
        { id: "33", content: "器官移植术后的抗排斥药物治疗" },
        { id: "34", content: "地中海贫血" },
        { id: "35", content: "骨髓增生异常综合征及骨髓增生性疾病" },
        { id: "36", content: "肺间质纤维化" },
        { id: "37", content: "矽肺" },
        { id: "38", content: "心脏瓣膜置换术后" },
        { id: "39", content: "心脏搭桥术后" },
        { id: "40", content: "血管支架植入后" },
        { id: "41", content: "各类严重肿瘤" }
      ],
      chObject: {
        chronic: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }]
      },
      userOptions: [],
      create_org_phone1: ''
      // --- checkbox Data ---
    };
  },
  created() {
    console.log("this.status", this.status);
    this.AllStepData = this.$store.state.table.AllStepData;

    this.onQueryUsersByHosId(null, "user");
    this.EchoMethod();
  },
  mounted() {
    if (this.status != "view") {
      this.init();
    }
  },
  methods: {
    init() {
      setTimeout(() => {
        this.initInput();
        this.addEnterListener();
      }, 10);
    },
    emptyData(){
        this.TableForm.chronic = "";
        this.TableForm.chronic_other = "";
        this.TableForm.allegry_history_text = "";
        this.TableForm.current_address = "";
        this.TableForm.chronic_other = "";
        this.TableForm.telephone = "";
        this.TableForm.other = "";
        this.chObject = {
          chronic: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }]
        };
        this.clearFlag = true;
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
      temp.focus();
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
    DateConversion() {
      if (this.TableForm.checkup_date.length == 8) {
        this.TableForm.checkup_date = dateConversion(
          this.TableForm.checkup_date
        );
      }
    },
    // 复选框 input 联动
    childVal(val, key) {
      console.log("key", key);
      console.log("val", val);
      this.TableForm[key] = "";
      let temp = [];
      val.forEach(el => {
        if (el.value != "") {
          temp.push(el.value);
        }
      });
      temp = temp.join(",");
      this.TableForm[key] = temp;
      this.chObject[key] = val;
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
      // console.log("表格状态99999999", this.$store.state.table.tableStatus);
      // console.log("this.status", this.status);
      console.log("============this.AllStepData=============",this.AllStepData)
      this.AllStepData = this.$store.state.table.AllStepData;
      let tableConfiguration = {};
      if (this.status == "add") {
         this.TableForm.create_org_name = this.AllStepData[0].create_org_name;
        let endObj = {};
        this.AllStepData.forEach(el => {
          Object.assign(endObj, el);
        });
        for (let obj in this.TableForm) {
          this.TableForm[obj] = endObj[obj];
        }
        this.TableForm.create_org_phone = this.AllStepData[0].create_org_phone;
        this.TableForm.responsible_dr_phone = this.AllStepData[0].mobile
        return;
      }

      if (this.status == "view") {
        tableConfiguration = this.$store.state.table.viewTableConfiguration;
      }
      if (this.status == "edit") {
        tableConfiguration = this.$store.state.table.tableConfiguration;

      };
      for (let obj in this.TableForm) {
        this.TableForm[obj] = tableConfiguration.editData[obj];
      }
      console.log("view数据返显", this.TableForm)
      let endObj = {};
      this.AllStepData.forEach(el => {
        Object.assign(endObj, el);
      });
      for (let obj in this.TableForm) {
        this.TableForm[obj] = endObj[obj];
      }
      this.TableForm.create_org_name = this.AllStepData[0].create_org_name;
      this.TableForm.create_org_phone = tableConfiguration.editData.create_org_phone;
      this.TableForm.responsible_dr_phone = tableConfiguration.editData.responsible_dr_phone;
      this.TableForm.allegry_history_text = tableConfiguration.editData.allegry_history_text;
      this.TableForm.other = tableConfiguration.editData.other;
      this.TableForm.chronic_other = tableConfiguration.editData.chronic_other;
      if (tableConfiguration.editChObject == undefined) {
        return;
      };
      console.log("this.TableForm回显数据3", this.TableForm);
      let editChObject = JSON.parse(tableConfiguration.editChObject);

      for (let obj in this.chObject) {
        this.chObject[obj] = editChObject[obj];
      }
    }
  },
  watch: {
    AllStepData(n, o) {
       let tableConfiguration = {};
       let endObj = {};
      this.AllStepData = this.$store.state.table.AllStepData;
      console.log("this.AllStepData",this.AllStepData);
      tableConfiguration = this.$store.state.table.tableConfiguration;
      this.AllStepData.forEach(el => {
        Object.assign(endObj, el);
      });
      console.log("endObj----------", endObj);
      for (let obj in this.TableForm) {
        this.TableForm[obj] = endObj[obj];
      }
      console.log("this.TableForm监听回显数据3", this.TableForm);
      console.log("this.chObject", this.chObject);

      this.EchoMethod();
    }
  }
};
</script>
