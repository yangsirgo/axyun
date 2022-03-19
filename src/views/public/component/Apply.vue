<template>
  <div :data="dataHz" class="areacontent width100 height100">
    <el-row class="arearowall">
      <!--左侧  -->
      <el-col :span="8" class="arearowleft">
        <el-row style="padding:0 20px;">
          <el-col :span="24">
            <l-card-title>
              <div slot="left">{{dataHz.titlename}}</div>
            </l-card-title>
          </el-col>
        </el-row>

        <!-- 头部搜索区域 -->
        <el-row :gutter="10" class="topseach">
          <el-col :span="6">
            <el-select v-model="formSearch.group" placeholder="组套" @change="search(1)">
              <el-option v-for="item in groups" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-input
              placeholder="项目名称或简拼回车查询"
              suffix-icon="el-icon-search"
              v-model="formSearch.inputop"
              @keyup.enter.native="search(2)"
            ></el-input>
          </el-col>
          <el-col :span="8">
            <el-button
              class="filter-item iconfont icontijiao1"
              type="text"
              @click="sent()"
            >&nbsp;提交申请</el-button>
            <el-button
              class="filter-item iconfont iconcunweimoban"
              type="text"
              @click="showRelList"
            >&nbsp;存为模板</el-button>
          </el-col>
        </el-row>

        <el-row class="navall">
          <el-col :span="8" class="navmenu">
            <el-menu
              :default-active="activeIndex"
              :unique-opened="true"
              class="el-menu-vertical-demo"
              @select="handleSelect"
            >
              <el-submenu index="1">
                <template slot="title">
                  <span>科室套餐</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(item, index) in setmeal"
                    :key="index"
                    :index="item.id"
                  >{{item.name}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <span>个人套餐</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(item, index) in persmeal"
                    :key="index"
                    :index="item.id"
                  >{{item.name}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <span>常用套餐</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(item, index) in usedmeal"
                    :key="index"
                    :index="item.id"
                  >{{item.name}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item index="0">
                <span slot="title">全部</span>
              </el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="16">
            <el-table
              :data="orderTable"
              row-key="yzname"
              border
              :span-method="objectSpanMethod"
              @selection-change="handleSelectionChange"
            >
              <el-table-column prop="name" label="组合名称"></el-table-column>
              <el-table-column type="selection" :reserve-selection="true" align="center" width="55"></el-table-column>
              <el-table-column prop="yzname" label="医嘱名称" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>

      <!-- 右侧列表 -->
      <el-col :span="16" class="righttable">
        <el-row class="rightrow">
          <!-- 右侧title -->
          <el-row>
            <el-col :span="24">
              <l-card-title>
                <div slot="left">历史申请</div>
              </l-card-title>
            </el-col>
          </el-row>

          <!-- 右侧搜索条件 -->
          <el-row :gutter="20" style="margin-bottom:10px;">
            <el-col :span="6">
              <el-date-picker
                style="width:100%"
                :clearable="false"
                v-model="rightdata.rightseach.timepicker"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-col>

            <el-col :span="2">
              <el-select v-model="rightdata.rightseach.statechack">
                <el-option
                  v-for="item in rightdata.stategroup"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>

            <el-col :span="2">
              <el-button @click="rightseach(0)" type="primary" size="small">查询</el-button>
            </el-col>

            <el-col :span="3" :offset="9" style="line-height:36px;">
              <el-checkbox v-model="rightdata.rightseach.checkedstat" @change="rightseach(1)">仅看我的申请</el-checkbox>
            </el-col>
            <el-col :span="2">
              <el-button @click="cancel()" type="primary" size="small" plain>撤销申请</el-button>
            </el-col>
          </el-row>

          <!-- table -->
          <el-row class="rigmidtable">
            <el-table
              :data="rightdata.rightable"
              border
              stripe
              highlight-current-row
              @current-change="handleCurrentChange"
            >
              <el-table-column label="进度" min-width="80">
                <template slot-scope="scope">
                  <Lprogress :barwhid="scope.row.progre"></Lprogress>
                  <!-- <el-progress :percentage="scope.row.progre"></el-progress> -->
                </template>
              </el-table-column>
              <el-table-column prop="begaintime" label="申请日期" min-width="120"></el-table-column>
              <el-table-column prop="project" label="项目" min-width="120"></el-table-column>
              <el-table-column prop="state" label="状态" min-width="120"></el-table-column>
              <el-table-column prop="remarks" label="备注" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="specimen" label="标本" min-width="80"></el-table-column>
              <el-table-column prop="coststatus" label="费用状态" min-width="80"></el-table-column>
              <el-table-column prop="AppSection" label="申请科室" min-width="120"></el-table-column>
              <el-table-column prop="appDoctor" label="申请医生" min-width="80"></el-table-column>
            </el-table>
          </el-row>

          <el-row class="bottomtext">
            <el-col :span="24">
              <el-steps :active="rightdata.active" finish-status="success" style="padding:20px;">
                <el-step
                  title="申请"
                  icon="filter-item iconfont icon-dianziyizhujiaohu1"
                  :description="rightdata.qsteplist.docname + rightdata.qsteplist.steptime"
                ></el-step>
                <el-step
                  title="采集"
                  icon="filter-item iconfont icon-dianziyizhujiaohu1"
                  :description="rightdata.caijiteplist.docname + rightdata.caijiteplist.steptime"
                ></el-step>
                <el-step
                  title="签收"
                  icon="filter-item iconfont icon-dianziyizhujiaohu1"
                  :description="rightdata.jcteplist.docname + rightdata.jcteplist.steptime"
                ></el-step>
                <el-step
                  title="审核发布"
                  icon="filter-item iconfont icon-dianziyizhujiaohu1"
                  :description="rightdata.fbteplist.docname + rightdata.fbteplist.steptime"
                ></el-step>
              </el-steps>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>

    <!-- 保存模板弹窗 -->
    <el-dialog :visible.sync="modelVisible" title="保存至个人诊断模板" width="470px" @close="huidanClose">
      <el-form label-position="top" inline style="padding:20px 0;">
        <el-row>
          <el-col :offset="4" :span="16">
            <LFormtTitle label="名称" labelWidth="50">
              <el-input v-model="modeldata.modelname" style="line-height: 34px;" placeholder="请输入"></el-input>
            </LFormtTitle>
          </el-col>
        </el-row>
        <el-row>
          <el-col :offset="4" :span="16">
            <LFormtTitle label="备注" labelWidth="50">
              <el-input
                v-model="modeldata.modelbz"
                style="line-height: 34px;"
                placeholder="请输入至少5个字"
              ></el-input>
            </LFormtTitle>
          </el-col>
        </el-row>
        <el-row style="border-top:1px solid #E4E4E4;margin-top:20px; padding-top:20px;">
          <el-col :offset="6" :span="18">
            <div style="float:right;padding-right:30px;">
              <el-button type="primary" @click="conserve">确认</el-button>
              <el-button type="primary" plain @click="huidanClose">关闭</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
// import adHeight from "@/mixins/adHeight";
import LFormtTitle from "@/components/LFormtTitle.vue";
import Lprogress from "@/components/Lprogress.vue";
export default {
  // mixins: [adHeight],
  props: {
    dataHz: {
      type: Object
    }
  },
  data() {
    return {
      //保存模板弹窗默认关闭
      modelVisible: false,
      //弹窗数据源
      modeldata: {
        modelname: "",
        modelbz: ""
      },
      //搜索
      formSearch: {
        group: "",
        inputop: ""
      },
      //组套下拉
      groups: [],

      //选中套餐id
      chacakid: "",
      //菜单导航数据源
      activeIndex: "1",
      //科室套餐
      setmeal: [
        {
          id: "11", //科室套餐id
          name: "科室套餐一" //科室套餐名称
        },
        {
          id: "1", //科室套餐id
          name: "科室套餐一" //科室套餐名称
        },
        {
          id: "11", //科室套餐id
          name: "科室套餐一" //科室套餐名称
        }
      ],
      //个人套餐
      persmeal: [],
      //常用套餐
      usedmeal: [],

      //检查项表格数据源
      orderTable: [
        {
          id: "1", //组合名称id
          name: "血常规", //组合名称
          yzid: "01", //医嘱名称id
          yzname: "超敏C反应蛋白" //医嘱名称
        },
        {
          id: "1", //组合名称id
          name: "血常规", //组合名称
          yzid: "01", //医嘱名称id
          yzname: "超敏C反应蛋白" //医嘱名称
        },
        {
          id: "2", //组合名称id
          name: "血常规", //组合名称
          yzid: "01", //医嘱名称id
          yzname: "超敏C反应蛋白" //医嘱名称
        },
        {
          id: "3", //组合名称id
          name: "血常规", //组合名称
          yzid: "01", //医嘱名称id
          yzname: "超敏C反应蛋白" //医嘱名称
        },
        {
          id: "3", //组合名称id
          name: "血常规", //组合名称
          yzid: "03", //医嘱名称id
          yzname: "超敏C反应蛋白" //医嘱名称
        },
        {
          id: "3", //组合名称id
          name: "血常规", //组合名称
          yzid: "02", //医嘱名称id
          yzname: "超敏C反应蛋白" //医嘱名称
        },
        {
          id: "4", //组合名称id
          name: "血常规", //组合名称
          yzid: "02", //医嘱名称id
          yzname: "超敏C反应蛋白" //医嘱名称
        }
      ],

      //选中数据源
      checkedList: [],
      rowIndex: "-1",
      OrderIndexArr: [],

      //右侧表单数据源
      rightdata: {
        //右侧搜索数据源
        rightseach: {
          statechack: "0", //搜索范围
          timepicker: ["2019-08-21T16:00:00.000Z", "2019-09-14T16:00:00.000Z"], //搜索时间
          checkedstat: false //是否只看自己
        },
        stategroup: [
          {
            id: "0",
            name: "全部"
          },
          {
            id: "1",
            name: "已提交"
          },
          {
            id: "1",
            name: "未提交"
          }
        ],

        //右侧表格数据源
        rightable: [
          {
            progre: "10", //进度
            begaintime: "2019-05-01", //申请时间
            project: "血常规检查", //项目
            state: "已提交", //状态
            remarks: "备注", //备注
            specimen: "体液", //标本
            coststatus: "已缴费", //费用状态
            AppSection: "泌尿外科", //申请科室
            appDoctor: "张医生", //申请医生
            id: "1" //id
          }
        ],

        //步骤图数据源
        active: "",
        qsteplist: {
          docname: "",//人员
          steptime: " "//时间
        },
        caijiteplist: { docname: "", steptime: " " },
        jcteplist: { docname: "", steptime: " " },
        fbteplist: { docname: "", steptime: " " },

        //右侧当前选中行
        currentRow: ""
      }
    };
  },
  methods: {
    //获取组套下拉接口
    async listForgroups() {
      // let data =await base.listForgroups({});
      this.groups = [
        {
          id: "11",
          label: "组套1"
        },
        {
          id: "12",
          label: "组套2"
        }
      ];
    },

    //获取组套菜单接口
    async Forgroups() {
      // let data =await base.Forgroups({});
      this.setmeal = [
        {
          id: "11",
          name: "科室套餐一"
        },
        {
          id: "12",
          name: "科室套餐二"
        },
        {
          id: "13",
          name: "科室套餐三"
        },
        {
          id: "14",
          name: "科室套餐四"
        }
      ];
      //个人套餐
      this.persmeal = [
        {
          id: "21",
          name: "个人套餐一"
        },
        {
          id: "22",
          name: "个人套餐二"
        },
        {
          id: "23",
          name: "个人套餐三"
        },
        {
          id: "24",
          name: "个人套餐四"
        }
      ];
      //常用套餐
      this.usedmeal = [
        {
          id: "31",
          name: "常用套餐一"
        },
        {
          id: "32",
          name: "常用套餐二"
        },
        {
          id: "33",
          name: "常用套餐三"
        },
        {
          id: "34",
          name: "常用套餐四"
        }
      ];
    },

    //顶部搜索接口
    async search(type) {
      try {
        // this.$showLoading();
        let param = {};
        if (type == "1") {
          param = {
            id: this.formSearch.group
          };
        } else {
          param = {
            id: this.formSearch.inputop
          };
        }
        // let response = await opha.search(param);
        this.orderTable = [
          {
            id: "1",
            name: "血常规",
            yzid: "01",
            yzname: "超敏C反应蛋白"
          },
          {
            id: "1",
            name: "血常规",
            yzid: "02",
            yzname: "嗜酸性粒细胞直接计数"
          },
          {
            id: "1",
            name: "血常规",
            yzid: "03",
            yzname: "异常细胞形态监测"
          },
          {
            id: "2",
            name: "入院三大常规",
            yzid: "04",
            yzname: "尿常规"
          },
          {
            id: "2",
            name: "入院三大常规",
            yzid: "05",
            yzname: "血常规"
          },
          {
            id: "2",
            name: "入院三大常规",
            yzid: "06",
            yzname: "大便常规"
          }
        ];
        // this.$hideLoading();
        this.getOrderNumber();
      } catch (error) {
        // this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },

    //菜单搜索接口
    async handleSelect(key) {
      console.log(key);
      this.chacakid = key;
      try {
        // this.$showLoading();
        let param = this.chacakid;
        // let response = await opha.handleSelect(param);
        this.orderTable = [
          {
            id: "1",
            name: "血常规",
            yzid: "01",
            yzname: "超敏C反应蛋白"
          },
          {
            id: "1",
            name: "血常规",
            yzid: "02",
            yzname: "嗜酸性粒细胞直接计数"
          },
          {
            id: "1",
            name: "血常规",
            yzid: "03",
            yzname: "异常细胞形态监测"
          },
          {
            id: "2",
            name: "入院三大常规",
            yzid: "04",
            yzname: "尿常规"
          },
          {
            id: "2",
            name: "入院三大常规",
            yzid: "05",
            yzname: "血常规"
          },
          {
            id: "2",
            name: "入院三大常规",
            yzid: "06",
            yzname: "大便常规"
          }
        ];
        // this.$hideLoading();
        this.getOrderNumber();
      } catch (error) {
        // this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    // 获取相同编号的数组
    getOrderNumber() {
      let OrderObj = {};
      this.orderTable.forEach((element, index) => {
        element.rowIndex = index;
        if (OrderObj[element.id]) {
          OrderObj[element.id].push(index);
        } else {
          OrderObj[element.id] = [];
          OrderObj[element.id].push(index);
        }
      });
      // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      for (let k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderIndexArr.push(OrderObj[k]);
        }
      }
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          let element = this.OrderIndexArr[i];
          for (let j = 0; j < element.length; j++) {
            let item = element[j];
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
                  colspan: 1
                };
              } else if (j != 0) {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
            }
          }
        }
      }
    },

    //选中行
    handleSelectionChange(val) {
      this.checkedList = val;
      console.log(this.checkedList);
    },

    //提交申请
    sent() {
      var listdata = [];
      if (this.checkedList.length > 0) {
        this.checkedList.map(item => listdata.push(item.yzid));
        // let response = await opha.sent({
        //     listdata,
        //    chacakid:this.chacakid
        //   });
        //this.$hideLoading();
      } else {
        this.$message.warning("请选择一条或者多条数据");
      }
    },

    //存为模板弹窗
    showRelList() {
      if (this.checkedList.length > 0) {
        this.modelVisible = true;
      } else {
        this.$message.warning("请选择一条或者多条数据");
      }
    },
    // 关闭模板弹窗
    huidanClose() {
      this.modelVisible = false;
    },

    //存为模板
    conserve() {
      var listdata = [];
      this.checkedList.map(item => listdata.push(item.yzid));
      //  let response = await opha.conserve({
      //      listdata,
      //     chacakid:this.chacakid
      //    });
      // this.$hideLoading();
      this.rightseach();
    },

    // 右侧表格方法
    // 搜索方法
    async rightseach(type) {
      try {
        let param = {};
        if (type == "0") {
          param = {
            statechack: this.rightdata.rightseach.statechack,
            timepicker1: this.rightdata.rightseach.timepicker[0],
            timepicker2: this.rightdata.rightseach.timepicker[1]
          };
        } else {
          param = {
            checkedstat: this.rightdata.rightseach.checkedstat
          };
        }

        // let response = await opha.rightseach(param);
        this.rightdata.rightable = [
          {
            progre: "10", //进度
            begaintime: "2019-05-01", //申请时间
            project: "血常规检查", //项目
            state: "已提交", //状态
            remarks: "备注", //备注
            specimen: "体液", //标本
            coststatus: "已缴费", //费用状态
            AppSection: "泌尿外科", //申请科室
            appDoctor: "张医生", //申请医生
            id: "1"
          },
          {
            progre: "10", //进度
            begaintime: "2019-05-01", //申请时间
            project: "血常规检查", //项目
            state: "已提交", //状态
            remarks: "备注", //备注
            specimen: "体液", //标本
            coststatus: "已缴费", //费用状态
            AppSection: "泌尿外科", //申请科室
            appDoctor: "张医生", //申请医生
            id: "2"
          },
          {
            progre: "40", //进度
            begaintime: "2019-05-01", //申请时间
            project: "血常规检查", //项目
            state: "已提交", //状态
            remarks: "备注", //备注
            specimen: "体液", //标本
            coststatus: "已缴费", //费用状态
            AppSection: "泌尿外科", //申请科室
            appDoctor: "张医生", //申请医生
            id: "3"
          },
          {
            progre: "30", //进度
            begaintime: "2019-05-01", //申请时间
            project: "血常规检查", //项目
            state: "已提交", //状态
            remarks: "备注", //备注
            specimen: "体液", //标本
            coststatus: "已缴费", //费用状态
            AppSection: "泌尿外科", //申请科室
            appDoctor: "张医生", //申请医生
            id: "4"
          },
          {
            progre: "20", //进度
            begaintime: "2019-05-01", //申请时间
            project: "血常规检查", //项目
            state: "已提交", //状态
            remarks: "备注", //备注
            specimen: "体液", //标本
            coststatus: "已缴费", //费用状态
            AppSection: "泌尿外科", //申请科室
            appDoctor: "张医生", //申请医生
            id: "5"
          }
        ];
      } catch (error) {
        // this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },

    //右侧表格单选
    handleCurrentChange(val) {
      this.rightdata.currentRow = val;
      console.log(this.rightdata.currentRow);
      try {
        let param = this.rightdata.currentRow.id;
        // let response = await opha.handleSelecttext(param);
        this.rightdata.active = "1";

        this.rightdata.qsteplist = {
          docname: "夏邑",
          steptime: " 2019-08-21 16:00:00 "
        };
        this.rightdata.caijiteplist = {
          docname: "夏邑",
          steptime: " 2019-08-21 16:00:00 "
        };
        this.rightdata.jcteplist = {
          docname: "",
          steptime: ""
        };
        this.rightdata.fbteplist = {
          docname: "",
          steptime: ""
        };
      } catch (error) {
        // this.$hideLoading();
        this.$message.error(error.msg || "标准错误提示");
      }
    },
    //撤销申请
    cancel() {
      if (!this.rightdata.currentRow) {
        this.$message.warning("请选择一条数据");
      } else if (this.rightdata.currentRow.coststatus == "已缴费") {
        this.$message.warning("本条申请已缴费不可取消");
      } else {
        this.$confirm("", "", {
          showClose: "false",
          confirmButtonText: "撤销",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: "true",
          message:
            "<div>撤销申请</div><p><span>撤销申请无法重复编辑,</span>你要继续吗？</p>",
          type: "warning"
        })
          .then(() => {
            // let param = this.rightdata.currentRow.id;
            // let response = await opha.cancel(param);
            //this.$hideLoading();
            this.$message({
              type: "success",
              message: "申请撤销成功!"
            });
          })
          .catch(() => {});
      }
    }
  },
  mounted() {
    this.getOrderNumber();//合并单元格 
    this.Forgroups();
    this.listForgroups();
  }
};
</script>
<style lang="scss">
.areacontent {
  overflow: hidden;
  padding: 0 0px;
  // height: 900px;
  .arearowall {
    height: 100%;
    .arearowleft {
      height: 100%;
      border-right: 1px solid #e4e4e4;
      .topseach {
        height: 45px;
        padding: 0 20px;
        .el-button--text {
          color: #2e323a;
        }
      }
      .navall {
        height: calc(100% - 45px - 63px);
        .navmenu {
          height: 100%;
          border-right: 1px solid #e4e4e4;
          .el-menu {
            background-color: $l-color-bgcolor-18;
          }
          .el-submenu {
            border-bottom: 1px solid #fff;
            .el-menu-item.is-active {
              background-color: $l-color-bgcolor-1;
              color: #2e323a;
            }
          }
        }
        .el-table-column--selection .cell {
          padding-left: 10px;
        }
      }
    }
  }
  .righttable {
    padding-left: 20px;
    height: 100%;
    .rightrow {
      height: 100%;
      .rigmidtable {
        height: calc(100% - 45px - 63px - 170px);
        .el-table {
          height: 100%;
        }
        // height: 300px;
        margin-bottom: 20px;
      }
      .bottomtext {
        width: 100%;
        height: 150px;
        background: #f5f5f5;
        .el-step__icon.is-icon {
          width: 24px;
          height: 24px;
          border-radius: 12px;
          border: 1px solid;
        }
      }
    }
  }
}
</style>