<template>
  <div>
    <el-form class="table_form" ref="refForm" :model="TableForm">
      <header class="table_header">
        <el-row>
          <el-col :span="24">
            <div class="table_title">老年人中医药健康管理服务记录表</div>
          </el-col>
        </el-row>
        <el-row class="mb-10" type="flex" justify="space-between">
          <el-col :span="12">
            <div>姓名:{{rsdt_name}}</div>
          </el-col>
          <el-col :span="12">
            <div class="fr">编号:{{pap_doc_no}}</div>
          </el-col>
        </el-row>
      </header>
      <main class="table_main">
        <el-row class="lh24">
          <el-col :span="8">
            <div class="center">请根据近一年的体验和感觉，回答以下问题。</div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              没有
              <br />(根本不/从来没有)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              很少
              <br />(有一点/偶尔)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              有时
              <br />(有些/少数时间)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              经常
              <br />(相当/多数时间)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              总是
              <br />(非常/每天)
            </div>
          </el-col>
          <el-col :span="1">
            <div class="center lh60">得分</div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(1)您精力充沛吗？（指精神头足，乐于做事）</div>
          </el-col>
          <el-col :span="3">
            <div class="center">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center">5</div>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(2)您容易疲乏吗？（指体力如何，是否稍微活动一下或做一点家务劳动就感到累）</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">5</div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_2"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(3)您容易气短，呼吸短促，接不上气吗？</div>
          </el-col>
          <el-col :span="3">
            <div class="center">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center">5</div>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(4)您说话声音低弱无力吗?（指说话没有力气）</div>
          </el-col>
          <el-col :span="3">
            <div class="center">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center">5</div>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(5)您感到闷闷不乐、情绪低沉吗?（指心情不愉快，情绪低落）</div>
          </el-col>
          <el-col :span="3">
            <div class="center">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center">5</div>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(6)您容易精神紧张、焦虑不安吗?（指遇事是否心情紧张）</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">5</div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_6"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(7)您因为生活状态改变而感到孤独、失落吗？</div>
          </el-col>
          <el-col :span="3">
            <div class="center">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center">5</div>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_7"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(8)您容易感到害怕或受到惊吓吗?</div>
          </el-col>
          <el-col :span="3">
            <div class="center">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center">5</div>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_8"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(9)您感到身体超重不轻松吗?(感觉身体沉重)[BMI 指数=体重（kg）/身高 2（m）]</div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              1
              <br />(BMI＜24)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              2
              <br />(24≤BMI＜25)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              3
              <br />(25≤BMI＜26)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              4
              <br />(26≤BMI＜28)
            </div>
          </el-col>
          <el-col :span="3">
            <div class="center">
              5
              <br />(BMI≥28)
            </div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_9"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(10)您眼睛干涩吗?</div>
          </el-col>
          <el-col :span="3">
            <div class="center">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center">5</div>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(11)您手脚发凉吗?（不包含因周围温度低或穿的少导致的手脚发冷）</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">5</div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_11"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(12)您胃脘部、背部或腰膝部怕冷吗？（指上腹部、背部、腰部或膝关节等，有一处或多处怕冷）</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">5</div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_12"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row class="lh24">
          <el-col :span="8">
            <div class="text_left">(13)您比一般人耐受不了寒冷吗？（指比别人容易害怕冬天或是夏天的冷空调、电扇等）</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">1</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">2</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">3</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">4</div>
          </el-col>
          <el-col :span="3">
            <div class="center lh62">5</div>
          </el-col>
          <el-col :span="1">
            <div class="margin-16">
              <el-form-item>
                <el-input v-if="!readonly" :readonly="readonly" v-model="TableForm.question_13"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </main>
    </el-form>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from "vuex";
  import {
    dateConversion
  } from "@/utils/common";
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
        rsdt_name: "", //姓名
        pap_doc_no: "", //编号
        // 表单数据
        TableForm: {
          question_1: "", //(1)您精力充沛吗？（指精神头足，乐于做事）
          question_2: "", //(2)您容易疲乏吗？（指体力如何，是否稍微活动一下或做一点家务劳动就感到累）
          question_3: "", //(3)您容易气短，呼吸短促，接不上气吗？
          question_4: "", //(4)您说话声音低弱无力吗?（指说话没有力气）
          question_5: "", //(5)您感到闷闷不乐、情绪低沉吗?（指心情不愉快，情绪低落）
          question_6: "", //(6)您容易精神紧张、焦虑不安吗?（指遇事是否心情紧张）
          question_7: "", //(7)您因为生活状态改变而感到孤独、失落吗？
          question_8: "", //(8)您容易感到害怕或受到惊吓吗?
          question_9: "", //(9)您感到身体超重不轻松吗?(感觉身体沉重)[BMI 指数=体重（kg）/身高 2（m）]
          question_10: "", //(10)您眼睛干涩吗?
          question_11: "", //(11)您手脚发凉吗?（不包含因周围温度低或穿的少导致的手脚发冷）
          question_12: "", //(12)您胃脘部、背部或腰膝部怕冷吗？（指上腹部、背部、腰部或膝关节等，有一处或多处怕冷）
          question_13: "" //(13)您比一般人耐受不了寒冷吗？（指比别人容易害怕冬天或是夏天的冷空调、电扇等）
        }
        // --- checkbox Data ---
      };
    },
    computed: {
      ...mapGetters("table", ['BaseMesData'])
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
        this.pap_doc_no = this.BaseMesData.pap_doc_no; //编码
        this.rsdt_name = this.BaseMesData.rsdt_name; //姓名
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
        if (tableConfiguration.editChObject) {
          let editChObject = JSON.parse(tableConfiguration.editChObject);
          // console.log("tableConfiguration.editChObject", editChObject);
          for (let obj in this.chObject) {
            this.chObject[obj] = editChObject[obj];
          }
        }
        console.log("this.TableForm", this.TableForm);
        console.log("this.chObject", this.chObject);
      }
    },
    watch: {}
  };
</script>
