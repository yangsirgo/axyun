<template>
  <div>
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <main class="table_main">
        <el-row>
          <el-col :span="2">
            <div class="center">主要用药情况</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="5">
                  <div class="lh60">药物名称</div>
                </el-col>
                <el-col :span="5">
                  <div class="lh60">用法</div>
                </el-col>
                <el-col :span="4">
                  <div class="lh60">用量</div>
                </el-col>
                <el-col :span="5">
                  <div class="lh60">用药时间</div>
                </el-col>
                <el-col :span="5">
                  服药依从性
                  <br />1 规律 2 间断 3 不服药
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="flex itemsCenter">
                    <span>1</span>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.order_name_1"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_1"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_1"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.take_time_1"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.compliance_1"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="flex itemsCenter">
                    <span>2</span>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.order_name_2"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_2"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_2"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.take_time_2"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.compliance_2"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="flex itemsCenter">
                    <span>3</span>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.order_name_3"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_3"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_3"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.take_time_3"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.compliance_3"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="flex itemsCenter">
                    <span>4</span>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.order_name_4"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_4"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_4"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.take_time_4"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.compliance_4"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="flex itemsCenter">
                    <span>5</span>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.order_name_5"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_5"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_5"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.take_time_5"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.compliance_5"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="flex itemsCenter">
                    <span>6</span>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.order_name_6"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.route_6"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.medi_qty_6"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.take_time_6"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.compliance_6"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center">主要用药情况</div>
          </el-col>
          <el-col :span="22">
            <div class="rowChildren center">
              <el-row>
                <el-col :span="5">名称</el-col>
                <el-col :span="5">接种日期</el-col>
                <el-col :span="14">接种机构</el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="flex itemsCenter">
                    <span>1</span>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.vaccinate_name_1"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.vaccinate_date_1"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.vaccinate_hospital_name_1"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="flex itemsCenter">
                    <span>2</span>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.vaccinate_name_2"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.vaccinate_date_2"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.vaccinate_hospital_name_2"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <div class="flex itemsCenter">
                    <span>3</span>
                    <el-form-item>
                      <el-input
                        v-if="!readonly"
                        :readonly="readonly"
                        v-model="TableForm.vaccinate_name_3"
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.vaccinate_date_3"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item>
                    <el-input
                      v-if="!readonly"
                      :readonly="readonly"
                      v-model="TableForm.vaccinate_hospital_name_3"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center">健康评价</div>
          </el-col>
          <el-col :span="22">
            <div class="flex_cs">
              <el-radio-group class="flex_c mt-10 ml-10" v-model="TableForm.health_evaluation">
                <el-radio label="1">1 体检无异常</el-radio>
                <el-radio label="2">2 有异常</el-radio>
              </el-radio-group>
              <PFormInput class="mr-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.health_evaluation"
                ></el-input>
              </PFormInput>
            </div>
            <div class="flex_c mt-5">
              <div>异常1</div>
              <el-form-item class="ml-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.health_evaluation_abnormal_1"
                ></el-input>
              </el-form-item>
            </div>
            <div class="flex_c mt-5">
              <div>异常2</div>
              <el-form-item class="ml-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.health_evaluation_abnormal_2"
                ></el-input>
              </el-form-item>
            </div>
            <div class="flex_c mt-5">
              <div>异常3</div>
              <el-form-item class="ml-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.health_evaluation_abnormal_3"
                ></el-input>
              </el-form-item>
            </div>
            <div class="flex_c mt-5">
              <div>异常4</div>
              <el-form-item class="ml-10">
                <el-input
                  v-if="!readonly"
                  :readonly="readonly"
                  v-model="TableForm.health_evaluation_abnormal_4"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="center lh186">健康指导</div>
          </el-col>
          <el-col :span="11">
            <div class="h186 padding-10">
              <PCheckbox
                @childValInput="childVal"
                @otherValInput="otherVal"
                :readonly="readonly"
                :formKey="'health_guidance'"
                :checkboxOptions="HealthGuidanceOptions"
                :checkboxForm="chObject.health_guidance"
                :clearFlag = "clearFlag"
              />
            </div>
          </el-col>
          <el-col :span="11">
            <div class="lh20 padding-10">
              <PHealthGuidance
                :readonly="readonly"
                :formKey="'hazard_control'"
                @childValInput="childVal"
                @otherInput="HealthGuidanceInput"
                :checkboxOptions="chObject.RiskFactorsOptions"
                :checkboxForm="chObject.hazard_control"
                :clearFlag = "clearFlag"
              />
            </div>
          </el-col>
        </el-row>
      </main>
    </el-form>
  </div>
</template>

<script>
import { dateConversion } from "@/utils/common";
export default {
  name: "HealthChecklistPage4",
  components: {},
  data() {
    return {
      // 是否只读
      readonly: false,
      // input最大个数
      maxLength: 0,
      // 状态 新增 查看 编辑  view edit
      status: this.$store.state.table.tableStatus,
      // clearFlag
      clearFlag:false,
      // 表单数据
      TableForm: {
        order_name_1: "", //药物名称1
        route_1: "", //用法1
        medi_qty_1: "", //用量1
        take_time_1: "", //用药时间1
        compliance_1: "", //服药依从性1
        order_name_2: "", //药物名称2
        route_2: "", //用法2
        medi_qty_2: "", //用量2
        take_time_2: "", //用药时间2
        compliance_2: "", //服药依从性2
        order_name_3: "", //药物名称3
        route_3: "", //用法3
        medi_qty_3: "", //用量3
        take_time_3: "", //用药时间3
        compliance_3: "", //服药依从性3
        order_name_4: "", //药物名称4
        route_4: "", //用法4
        medi_qty_4: "", //用量4
        take_time_4: "", //用药时间4
        compliance_4: "", //服药依从性4
        order_name_5: "", //药物名称5
        route_5: "", //用法5
        medi_qty_5: "", //用量5
        take_time_5: "", //用药时间5
        compliance_5: "", //服药依从性5
        order_name_6: "", //药物名称6
        route_6: "", //用法6
        medi_qty_6: "", //用量6
        take_time_6: "", //用药时间6
        compliance_6: "", //服药依从性6
        vaccinate_name_1: "", //非免疫规划预防接种史名称1
        vaccinate_date_1: "", //非免疫规划预防接种史接种日期1
        vaccinate_hospital_name_1: "", //非免疫规划预防接种史接种机构1
        vaccinate_name_2: "", //非免疫规划预防接种史名称2
        vaccinate_date_2: "", //非免疫规划预防接种史接种日期2
        vaccinate_hospital_name_2: "", //非免疫规划预防接种史接种机构2
        vaccinate_name_3: "", //非免疫规划预防接种史名称3
        vaccinate_date_3: "", //非免疫规划预防接种史接种日期3
        vaccinate_hospital_name_3: "", //非免疫规划预防接种史接种机构3
        health_evaluation: "", //健康评价
        health_evaluation_abnormal_1: "", //健康评价异常1
        health_evaluation_abnormal_2: "", //健康评价异常2
        health_evaluation_abnormal_3: "", //健康评价异常3
        health_evaluation_abnormal_4: "", //健康评价异常4
        health_guidance: "", //健康指导
        hazard_control: "", //健康指导危险因素控制
        lose_weight: "", //健康指导危险因素控制减体重
        vaccinate: "", //健康指导危险因素控制建议接种疫苗
        hazard_other: "" //健康指导危险因素控制其他
      },
      // checkbox Data
      HealthGuidanceOptions: [
        { id: "1", content: "纳入慢性病患者健康管理" },
        { id: "2", content: "建议复查" },
        { id: "3", content: "建议转诊" }
      ],

      chObject: {
        health_guidance: [{ value: "" }, { value: "" }, { value: "" }],
        hazard_control: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ],
        RiskFactorsOptions: [
          { id: "1", content: "戒烟" },
          { id: "2", content: "健康饮酒" },
          { id: "3", content: "饮食" },
          { id: "4", content: "锻炼" },
          { id: "5", content: "减体重", value: "", key: "lose_weight" },
          { id: "6", content: "建议接种疫苗", value: "", key: "vaccinate" },
          { id: "7", content: "其他", value: "", key: "hazard_other" }
        ]
      }

    };
  },
  created() {
    this.EchoMethod();
  },
  mounted() {
    // 判断状态信息
    if (this.status != "view") {
      this.init();
    }
  },
  destroy() {
    console.log("销毁");
    this.removeEnterListener();
  },

  methods: {
    init() {
      // 判断查看、编辑 状态
      console.log("this.status", this.status);
      setTimeout(() => {
        this.initInput();
        this.addEnterListener();
      }, 10);
    },
    emptyData() {
      for (var obj in this.TableForm) {
        this.TableForm[obj] = ""
      };
      this.chObject = {
        health_guidance: [{ value: "" }, { value: "" }, { value: "" }],
        hazard_control: [
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" },
          { value: "" }
        ],
        RiskFactorsOptions: [
          { id: "1", content: "戒烟" },
          { id: "2", content: "健康饮酒" },
          { id: "3", content: "饮食" },
          { id: "4", content: "锻炼" },
          { id: "5", content: "减体重", value: "", key: "lose_weight" },
          { id: "6", content: "建议接种疫苗", value: "", key: "vaccinate" },
          { id: "7", content: "其他", value: "", key: "hazard_other" }
        ]
      }

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
    DateConversion() {
      if (this.temp.length == 8) {
        this.temp = dateConversion(this.temp);
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
      console.log(`this.TableForm.${key}`, this.TableForm[key]);
    },
    HealthGuidanceInput(key, val) {
      console.log("HealthGuidanceInput");
      console.log("key", key);
      console.log("val", val);
      this.TableForm[key] = val;
      console.log(`this.TableForm.${key}`, this.TableForm[key]);
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
      let editChObject = JSON.parse(tableConfiguration.editChObject);
      // console.log("tableConfiguration.editChObject", editChObject);
      for (let obj in this.chObject) {
        this.chObject[obj] = editChObject[obj];
      }
      console.log("this.TableForm", this.TableForm);
      console.log("this.chObject", this.chObject);
    }
  },
  watch: {},
  computed: {}
};
</script>
