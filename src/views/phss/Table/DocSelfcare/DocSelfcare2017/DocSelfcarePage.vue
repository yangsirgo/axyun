<template>
  <div>
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">老年人生活自理能力评估表</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" justify="space-between">
          <el-col :span="24">
            <div>该表为自评表，根据下表中 5 个方面进行评估，将各方面判断评分汇总后，0～3 分者为可自理；4～8 分者为轻度依赖；9～18 分者为中度依赖； ≥19 分者为不能自理。</div>
          </el-col>
        </el-row>
      </header>
      <main class="table_main">
        <el-row class="lh24 rowChildren rowChildrenLocation">
          <el-col :span="4">
            <div class="center">评估事项、内容与评分</div>
          </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="24">
                <div class="center">程度等级</div>
              </el-col>
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="5">
                  <div class="center">可自理</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">轻度依赖</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">中度依赖</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">不能自理</div>
                </el-col>
                <el-col :span="4">
                  <div class="center">判断评分</div>
                </el-col>
              </el-row>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="lh24 rowChildren rowChildrenLocation">
          <el-col :span="4">
            <el-row class="lh24Row">
              <div class="center">进餐：使用餐具将饭菜送入口、咀嚼、吞咽等活动</div>
            </el-row>
            <el-row>
              <div class="center">评分</div>
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row class="lh24Row" style="border-bottom: none !important;">
              <el-col :span="5" class="lh90">
                <div class="center lh90">独立完成</div>
              </el-col>
              <el-col :span="5" class="lh90">
                <div class="center">—</div>
              </el-col>
              <el-col :span="5" class="lh90">
                <div class="center">需要协助，如切碎、搅拌食物等</div>
              </el-col>
              <el-col :span="5" class="lh90">
                <div class="center">完全需要帮助</div>
              </el-col>
              <el-col :span="4" class="lh90"></el-col>
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="5">
                  <div class="center">0</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">0</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">3</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">5</div>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input class="rowChildrenLocationRight" v-if="!readonly" :readonly="readonly" v-model="TableForm.dining_score" @change="onGrade"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="lh24 rowChildren rowChildrenLocation">
          <el-col :span="4">
            <el-row class="lh24Row">
              <div class="center">梳洗：梳头、洗脸、刷牙、剃须、洗澡等活动</div>
            </el-row>
            <el-row>
              <div class="center">评分</div>
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row class="lh24Row">
              <el-col :span="5">
                <div class="center lh90">独立完成</div>
              </el-col>
              <el-col :span="5">
                <div class="center">能独立地洗头、梳头、洗脸、刷牙、剃须等；洗澡需要协助</div>
              </el-col>
              <el-col :span="5">
                <div class="center">在协助下和适当的时间内，能完成部分梳洗活动</div>
              </el-col>
              <el-col :span="5" class="lh90">
                <div class="center">完全需要帮助</div>
              </el-col>
              <el-col :span="4" class="lh90"></el-col>
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="5">
                  <div class="center">0</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">1</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">3</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">7</div>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input class="rowChildrenLocationRight" v-if="!readonly" :readonly="readonly" v-model="TableForm.grooming_score" @change="onGrade"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="lh24 rowChildren rowChildrenLocation">
          <el-col :span="4">
            <el-row class="lh24Row">
              <div class="center">穿衣：穿衣裤、袜子、鞋子等活动</div>
            </el-row>
            <el-row>
              <div class="center">评分</div>
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row class="lh24Row">
              <el-col :span="5" class="lh60">
                <div class="center lh60">独立完成</div>
              </el-col>
              <el-col :span="5" class="lh60">
                <div class="center">—</div>
              </el-col>
              <el-col :span="5" class="lh60">
                <div class="center">需要协助，在适当的时间内完成部分穿衣</div>
              </el-col>
              <el-col :span="5" class="lh60">
                <div class="center">完全需要帮助</div>
              </el-col>
              <el-col :span="4" class="lh60"></el-col>
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="5">
                  <div class="center">0</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">0</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">3</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">5</div>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input class="rowChildrenLocationRight" v-if="!readonly" :readonly="readonly" v-model="TableForm.dressing_score" @change="onGrade"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="lh24 rowChildren rowChildrenLocation">
          <el-col :span="4">
            <el-row class="lh24Row">
              <div class="center h90">如厕：小便、大便等活动及自控</div>
            </el-row>
            <el-row>
              <div class="center lh30">评分</div>
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row class="lh24Row">
              <el-col :span="5" class="lh90">
                <div class="center lh90">不需协助，可自控</div>
              </el-col>
              <el-col :span="5" class="lh90">
                <div class="center">偶尔失禁，但基本上能如厕或使用便具</div>
              </el-col>
              <el-col :span="5" class="lh90">
                <div class="center">经常失禁，在很多提示和协助下尚能如厕或使用便具</div>
              </el-col>
              <el-col :span="5" class="lh90">
                <div class="center">完全失禁，完全需要帮助</div>
              </el-col>
              <el-col :span="4" class="lh90"></el-col>
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="5">
                  <div class="center">0</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">1</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">5</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">10</div>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input class="rowChildrenLocationRight" v-if="!readonly" :readonly="readonly" v-model="TableForm.toileting_score" @change="onGrade"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="lh24 rowChildren rowChildrenLocation">
          <el-col :span="4">
            <el-row class="lh24Row">
              <div class="center">活动：站立、室内行走、上下楼梯、户外活动</div>
            </el-row>
            <el-row>
              <div class="center">评分</div>
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row class="lh24Row">
              <el-col :span="5" class="lh90">
                <div class="center lh90">独立完成所有活动</div>
              </el-col>
              <el-col :span="5" class="lh90">
                <div class="center">借助较小的外力或辅助装置能完成站立、行走、上下楼梯等</div>
              </el-col>
              <el-col :span="5" class="lh90">
                <div class="center">借助较大的外力才能完成站立、行走，不能上下楼梯</div>
              </el-col>
              <el-col :span="5" class="lh90">
                <div class="center">卧床不起，活动完全需要帮助</div>
              </el-col>
              <el-col :span="4" class="lh90"></el-col>
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="5">
                  <div class="center">0</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">1</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">5</div>
                </el-col>
                <el-col :span="5">
                  <div class="center">10</div>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input class="rowChildrenLocationRight" v-if="!readonly" :readonly="readonly" v-model="TableForm.movement_score" @change="onGrade"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="rowChildren">
          <el-col :span="4"></el-col>
          <el-col :span="20" style="border-left:none;">
            <el-row>
              <el-col :span="20" class="textAlign">总得分</el-col>
              <el-col :span="4">
                <el-form-item class="el-form-item-bottom">
                  <el-input v-if="!readonly" :readonly="true" v-model="TableForm.tot_score"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </main>
    </el-form>
  </div>
</template>

<script>
  import { dateConversion } from "@/utils/common";
  export default {
    name: "DocCmHlthMngmtPage1",
    components: {},
    data() {
      return {
        // 是否只读
        readonly: false,
        // input最大个数
        maxLength: 0,
        // 状态 新增 查看 编辑  view edit
        status: this.$store.state.table.tableStatus,
        // 表单数据
        TableForm: {
          dining_score: "", //进餐评分
          grooming_score: "", //梳洗评分
          dressing_score: "", //穿衣评分
          toileting_score: "", //如厕评分
          movement_score: "", //活动评分
          tot_score: "" //总分
        },
        // 责任医生 选择框数据
        selectOptions: [{
            value: "1",
            label: "吴剑锋"
          },
          {
            value: "2",
            label: "吴剑锋"
          },
          {
            value: "3",
            label: "吴剑锋"
          }
        ],
        // --- checkbox Data ---
        symptomOptions: [
          { id: "1", content: "无症状" },
          { id: "2", content: "头痛" },
          { id: "3", content: "头晕" },
          { id: "4", content: "心悸" },
          { id: "5", content: "胸闷" },
          { id: "6", content: "胸痛" },
          { id: "7", content: "慢性咳嗽" },
          { id: "8", content: "咳痰" },
          { id: "9", content: "呼吸困难" },
          { id: "10", content: "多饮" },
          { id: "11", content: "多尿" },
          { id: "12", content: "体重下降" },
          { id: "13", content: "乏力" },
          { id: "14", content: "关节肿痛" },
          {
            id: "15",
            content: "视力模糊"
          },
          {
            id: "16",
            content: "手脚麻木"
          },
          {
            id: "17",
            content: "尿急"
          },
          {
            id: "18",
            content: "尿痛"
          },
          {
            id: "19",
            content: "便秘"
          },
          {
            id: "20",
            content: "腹泻"
          },
          {
            id: "21",
            content: "恶心呕吐"
          },
          {
            id: "22",
            content: "眼花"
          },
          {
            id: "23",
            content: "耳鸣"
          },
          {
            id: "24",
            content: "乳房胀痛"
          },
          {
            id: "25",
            content: "其他"
          }
        ],
        EatingHabitsOptions: [
          { id: "1", content: "荤素均衡" },
          { id: "2", content: "荤食为主" },
          { id: "3", content: "素食为主" },
          { id: "4", content: "嗜盐" },
          { id: "5", content: "嗜油" },
          { id: "6", content: "嗜糖" }
        ],
        DrinkingTypesOptions: [
          { id: "1", content: "白酒" },
          { id: "2", content: "啤酒" },
          { id: "3", content: "红酒" },
          { id: "4", content: "黄酒" },
          { id: "5", content: "其他" }
        ],
        chObject: {
          symptom: [
            { value: "" },
            { value: "" },
            { value: "" },
            { value: "" },
            { value: "" },
            { value: "" },
            { value: "" },
            { value: "" },
            { value: "" },
            { value: "" }
          ],
          eating_habits: [
            { value: "" },
            { value: "" },
            { value: "" },
            { value: "" }
          ],
          drinking_type: [
            { value: "" },
            { value: "" },
            { value: "" },
            { value: "" },
            { value: "" }
          ]
        }
        // --- checkbox Data ---
      };
    },
    created() {
      console.log("this.status", this.status);
      this.EchoMethod();
    },
    mounted() {
      if (this.status != "view") {
        this.init();
      }
    },
    methods: {
      onGrade() {
        this.TableForm.tot_score =
          Number(this.TableForm.dining_score) +
          Number(this.TableForm.grooming_score) +
          Number(this.TableForm.dressing_score) +
          Number(this.TableForm.toileting_score) +
          Number(this.TableForm.movement_score);
      },
      init() {
        setTimeout(() => {
          this.initInput();
          this.addEnterListener();
        }, 10);
      },
      emptyData() {
        for (var obj in this.TableForm) {
          this.TableForm[obj] = ""
        };
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
    watch: {}
  };
</script>